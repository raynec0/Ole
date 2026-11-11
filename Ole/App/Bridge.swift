import Foundation
import UIKit
import WebKit
import AVFoundation
import Speech
import UserNotifications
import Security

/// 网页与系统能力之间的桥：网络、朗读、语音识别、存储、提醒。
/// 网页调用：webkit.messageHandlers.ole.postMessage({id, cmd, args})
/// 回复：window.__oleReply({id, ok, err})；事件：window.__oleEvent({name, data})
final class Bridge: NSObject, WKScriptMessageHandler, URLSessionDataDelegate, AVSpeechSynthesizerDelegate {
    typealias Reply = (Any?, String?) -> Void

    weak var webView: WKWebView?

    // 朗读
    private let synth = AVSpeechSynthesizer()
    private var utterIDs: [ObjectIdentifier: String] = [:]

    // 流式网络
    private final class StreamState {
        let sid: String
        let reply: Reply
        var pending = Data()
        var errorBody = ""
        init(sid: String, reply: @escaping Reply) {
            self.sid = sid
            self.reply = reply
        }
    }
    private var streams: [Int: StreamState] = [:]
    private var streamTasks: [String: URLSessionDataTask] = [:]
    private var streamSession: URLSession?

    // 语音识别
    private let engine = AVAudioEngine()
    private var recRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recTask: SFSpeechRecognitionTask?
    private var recSession = 0
    private var recActive = false

    override init() {
        super.init()
        synth.delegate = self
        streamSession = URLSession(configuration: .default, delegate: self, delegateQueue: OperationQueue.main)
    }

    // MARK: - 消息入口

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let cmd = body["cmd"] as? String,
              let idNum = body["id"] as? NSNumber else { return }
        let id = idNum.intValue
        let a = body["args"] as? [String: Any] ?? [:]
        let reply: Reply = { [weak self] ok, err in
            DispatchQueue.main.async {
                self?.send(id: id, ok: ok, err: err)
            }
        }

        switch cmd {
        case "http":
            http(a, reply)
        case "httpStream":
            httpStream(a, reply)
        case "httpCancel":
            if let sid = a["sid"] as? String {
                streamTasks[sid]?.cancel()
            }
            reply(true, nil)
        case "speak":
            speak(a)
            reply(true, nil)
        case "stopSpeak":
            synth.stopSpeaking(at: .immediate)
            reply(true, nil)
        case "voices":
            reply(voiceList(a["lang"] as? String ?? "es-ES"), nil)
        case "sttStart":
            sttStart(a["lang"] as? String ?? "es-ES", reply)
        case "sttStop":
            sttStop()
            reply(true, nil)
        case "load":
            let key = a["key"] as? String ?? ""
            if let s = try? String(contentsOf: fileURL(key), encoding: .utf8) {
                reply(s, nil)
            } else {
                reply(nil, nil)
            }
        case "save":
            let key = a["key"] as? String ?? ""
            let value = a["value"] as? String ?? ""
            do {
                try value.write(to: fileURL(key), atomically: true, encoding: .utf8)
                reply(true, nil)
            } catch {
                reply(nil, error.localizedDescription)
            }
        case "secretGet":
            reply(secretGet(a["key"] as? String ?? ""), nil)
        case "secretSet":
            secretSet(a["key"] as? String ?? "", a["value"] as? String ?? "")
            reply(true, nil)
        case "open":
            if let s = a["url"] as? String, let url = URL(string: s) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            }
            reply(true, nil)
        case "copy":
            UIPasteboard.general.string = a["text"] as? String ?? ""
            reply(true, nil)
        case "paste":
            reply(UIPasteboard.general.string ?? "", nil)
        case "notify":
            setReminder(a, reply)
        case "haptic":
            haptic(a["kind"] as? String ?? "light")
            reply(true, nil)
        default:
            reply(nil, "unknown command: \(cmd)")
        }
    }

    private func send(id: Int, ok: Any?, err: String?) {
        var payload: [String: Any] = ["id": id]
        payload["ok"] = ok ?? NSNull()
        payload["err"] = err ?? NSNull()
        evalJSON("__oleReply", payload)
    }

    private func emit(_ name: String, _ data: [String: Any]) {
        evalJSON("__oleEvent", ["name": name, "data": data])
    }

    private func evalJSON(_ fn: String, _ payload: [String: Any]) {
        guard JSONSerialization.isValidJSONObject(payload),
              let d = try? JSONSerialization.data(withJSONObject: payload, options: []),
              let s = String(data: d, encoding: .utf8) else { return }
        webView?.evaluateJavaScript("window.\(fn) && window.\(fn)(\(s));", completionHandler: nil)
    }

    // MARK: - 网络

    private func makeRequest(_ a: [String: Any]) -> URLRequest? {
        guard let s = a["url"] as? String, let url = URL(string: s) else { return nil }
        var req = URLRequest(url: url)
        req.httpMethod = a["method"] as? String ?? "GET"
        if let t = a["timeout"] as? NSNumber {
            req.timeoutInterval = t.doubleValue
        } else {
            req.timeoutInterval = 60
        }
        if let hs = a["headers"] as? [String: Any] {
            for (k, v) in hs {
                req.setValue("\(v)", forHTTPHeaderField: k)
            }
        }
        if let b = a["body"] as? String {
            req.httpBody = b.data(using: .utf8)
        }
        return req
    }

    private func decode(_ d: Data) -> String {
        if let s = String(data: d, encoding: .utf8) { return s }
        if let s = String(data: d, encoding: .isoLatin1) { return s }
        return ""
    }

    private func http(_ a: [String: Any], _ reply: @escaping Reply) {
        guard let req = makeRequest(a) else {
            reply(nil, "网址无效")
            return
        }
        let task = URLSession.shared.dataTask(with: req) { [weak self] data, response, error in
            if let error = error {
                reply(nil, error.localizedDescription)
                return
            }
            let status = (response as? HTTPURLResponse)?.statusCode ?? 0
            let body = self?.decode(data ?? Data()) ?? ""
            reply(["status": status, "body": body], nil)
        }
        task.resume()
    }

    private func httpStream(_ a: [String: Any], _ reply: @escaping Reply) {
        guard let req = makeRequest(a), let sid = a["sid"] as? String, let session = streamSession else {
            reply(nil, "网址无效")
            return
        }
        let task = session.dataTask(with: req)
        streams[task.taskIdentifier] = StreamState(sid: sid, reply: reply)
        streamTasks[sid] = task
        task.resume()
    }

    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        guard let st = streams[dataTask.taskIdentifier] else { return }
        st.pending.append(data)
        // 只取出完整的 UTF-8 部分，半个字符留到下一块
        var cut = st.pending.count
        var text: String? = nil
        while cut > 0 && st.pending.count - cut < 4 {
            if let s = String(data: st.pending.prefix(cut), encoding: .utf8) {
                text = s
                break
            }
            cut -= 1
        }
        guard let chunk = text else {
            if st.pending.count > 64 {
                st.pending = Data()
            }
            return
        }
        st.pending = Data(st.pending.dropFirst(cut))
        let status = (dataTask.response as? HTTPURLResponse)?.statusCode ?? 200
        if status >= 400 {
            if st.errorBody.count < 4000 {
                st.errorBody += chunk
            }
        } else {
            emit("stream", ["sid": st.sid, "chunk": chunk])
        }
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        guard let st = streams.removeValue(forKey: task.taskIdentifier) else { return }
        streamTasks[st.sid] = nil
        if let error = error {
            let ns = error as NSError
            st.reply(nil, ns.code == NSURLErrorCancelled ? "cancelled" : ns.localizedDescription)
            return
        }
        let status = (task.response as? HTTPURLResponse)?.statusCode ?? 0
        st.reply(["status": status, "body": st.errorBody], nil)
    }

    // MARK: - 朗读

    private func naturalVoices(_ lang: String) -> [AVSpeechSynthesisVoice] {
        let all = AVSpeechSynthesisVoice.speechVoices().filter { $0.language == lang }
        let natural = all.filter { !$0.identifier.lowercased().contains("eloquence") }
        let list = natural.isEmpty ? all : natural
        return list.sorted { $0.quality.rawValue > $1.quality.rawValue }
    }

    private func voiceList(_ lang: String) -> [[String: Any]] {
        var out: [[String: Any]] = []
        for v in naturalVoices(lang) {
            let item: [String: Any] = ["id": v.identifier, "name": v.name, "quality": v.quality.rawValue]
            out.append(item)
        }
        return out
    }

    private func speak(_ a: [String: Any]) {
        let text = a["text"] as? String ?? ""
        let lang = a["lang"] as? String ?? "es-ES"
        let uid = a["uid"] as? String ?? ""
        let rate = (a["rate"] as? NSNumber)?.floatValue ?? 1.0
        let index = (a["voice"] as? NSNumber)?.intValue ?? 0
        let voiceId = a["voiceId"] as? String ?? ""

        if synth.isSpeaking {
            synth.stopSpeaking(at: .immediate)
        }
        if !recActive {
            let session = AVAudioSession.sharedInstance()
            try? session.setCategory(.playback, mode: .spokenAudio, options: [])
            try? session.setActive(true, options: [])
        }

        let u = AVSpeechUtterance(string: text)
        let voices = naturalVoices(lang)
        if index == 0, !voiceId.isEmpty, let v = AVSpeechSynthesisVoice(identifier: voiceId) {
            u.voice = v
        } else if !voices.isEmpty {
            var pick = voices[index % voices.count]
            if index > 0, !voiceId.isEmpty, pick.identifier == voiceId, voices.count > 1 {
                pick = voices[(index + 1) % voices.count]
            }
            u.voice = pick
        } else {
            u.voice = AVSpeechSynthesisVoice(language: lang)
        }
        let r = AVSpeechUtteranceDefaultSpeechRate * rate
        u.rate = max(AVSpeechUtteranceMinimumSpeechRate, min(AVSpeechUtteranceMaximumSpeechRate, r))
        utterIDs[ObjectIdentifier(u)] = uid
        synth.speak(u)
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        utteranceEnded(ObjectIdentifier(utterance))
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        utteranceEnded(ObjectIdentifier(utterance))
    }

    private func utteranceEnded(_ key: ObjectIdentifier) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            if let uid = self.utterIDs.removeValue(forKey: key) {
                self.emit("ttsEnd", ["uid": uid])
            }
        }
    }

    // MARK: - 语音识别

    private func sttStart(_ lang: String, _ reply: @escaping Reply) {
        SFSpeechRecognizer.requestAuthorization { status in
            DispatchQueue.main.async {
                guard status == .authorized else {
                    reply(nil, "没有语音识别权限，请到 设置 → Olé 里打开")
                    return
                }
                AVAudioSession.sharedInstance().requestRecordPermission { granted in
                    DispatchQueue.main.async { [weak self] in
                        guard let self = self else { return }
                        guard granted else {
                            reply(nil, "没有麦克风权限，请到 设置 → Olé 里打开")
                            return
                        }
                        do {
                            try self.beginRecognition(lang)
                            reply(true, nil)
                        } catch {
                            self.endRecognition(notify: false)
                            reply(nil, error.localizedDescription)
                        }
                    }
                }
            }
        }
    }

    private func beginRecognition(_ lang: String) throws {
        endRecognition(notify: false)
        synth.stopSpeaking(at: .immediate)

        guard let recognizer = SFSpeechRecognizer(locale: Locale(identifier: lang)), recognizer.isAvailable else {
            throw NSError(domain: "ole", code: 1, userInfo: [NSLocalizedDescriptionKey: "当前无法使用西班牙语语音识别（检查网络，或在系统键盘里添加西班牙语听写）"])
        }

        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playAndRecord, mode: .measurement, options: [.duckOthers, .defaultToSpeaker])
        try session.setActive(true, options: .notifyOthersOnDeactivation)

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true

        let input = engine.inputNode
        let format = input.outputFormat(forBus: 0)
        guard format.sampleRate > 0 else {
            throw NSError(domain: "ole", code: 2, userInfo: [NSLocalizedDescriptionKey: "麦克风不可用"])
        }
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
            request.append(buffer)
        }
        engine.prepare()
        try engine.start()

        recSession += 1
        let mySession = recSession
        recRequest = request
        recActive = true
        recTask = recognizer.recognitionTask(with: request) { result, error in
            let text = result?.bestTranscription.formattedString
            let isFinal = result?.isFinal ?? false
            let failed = error != nil
            DispatchQueue.main.async { [weak self] in
                guard let self = self, self.recSession == mySession else { return }
                if let text = text {
                    self.emit("stt", ["text": text, "final": isFinal])
                }
                if failed || isFinal {
                    self.endRecognition(notify: true)
                }
            }
        }
    }

    /// 用户点了停止：结束录音，等识别器给出最终结果
    private func sttStop() {
        guard recActive else { return }
        if engine.isRunning {
            engine.stop()
            engine.inputNode.removeTap(onBus: 0)
        }
        recRequest?.endAudio()
        let mySession = recSession
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            guard let self = self, self.recSession == mySession, self.recActive else { return }
            self.endRecognition(notify: true)
        }
    }

    private func endRecognition(notify: Bool) {
        let wasActive = recActive
        if engine.isRunning {
            engine.stop()
            engine.inputNode.removeTap(onBus: 0)
        }
        recRequest?.endAudio()
        recTask?.cancel()
        recRequest = nil
        recTask = nil
        recActive = false
        recSession += 1
        if wasActive {
            let session = AVAudioSession.sharedInstance()
            try? session.setCategory(.playback, mode: .spokenAudio, options: [])
            if notify {
                emit("sttEnd", [:])
            }
        }
    }

    // MARK: - 存储

    private func fileURL(_ key: String) -> URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        let dir = base.appendingPathComponent("ole", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true, attributes: nil)
        let safe = key.replacingOccurrences(of: "/", with: "_")
        return dir.appendingPathComponent(safe + ".json")
    }

    private func secretQuery(_ key: String) -> [String: Any] {
        return [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: "ole.secrets",
            kSecAttrAccount as String: key
        ]
    }

    private func secretSet(_ key: String, _ value: String) {
        let query = secretQuery(key)
        SecItemDelete(query as CFDictionary)
        let fallback = fileURL("secret-" + key)
        try? FileManager.default.removeItem(at: fallback)
        guard !value.isEmpty, let data = value.data(using: .utf8) else { return }
        var add = query
        add[kSecValueData as String] = data
        let status = SecItemAdd(add as CFDictionary, nil)
        if status != errSecSuccess {
            // 自签安装时钥匙串可能不可用，退回到应用沙盒内的文件
            try? value.write(to: fallback, atomically: true, encoding: .utf8)
        }
    }

    private func secretGet(_ key: String) -> String {
        var query = secretQuery(key)
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne
        var out: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &out)
        if status == errSecSuccess, let data = out as? Data, let s = String(data: data, encoding: .utf8) {
            return s
        }
        if let s = try? String(contentsOf: fileURL("secret-" + key), encoding: .utf8) {
            return s
        }
        return ""
    }

    // MARK: - 提醒与触感

    private func setReminder(_ a: [String: Any], _ reply: @escaping Reply) {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: ["ole.daily"])
        let enabled = (a["enabled"] as? NSNumber)?.boolValue ?? false
        guard enabled else {
            reply(true, nil)
            return
        }
        let hour = (a["hour"] as? NSNumber)?.intValue ?? 20
        let minute = (a["minute"] as? NSNumber)?.intValue ?? 0
        let title = a["title"] as? String ?? "¡Hora de español!"
        let body = a["body"] as? String ?? "今天的西语还没练"
        center.requestAuthorization(options: [.alert, .sound]) { granted, _ in
            guard granted else {
                reply(nil, "没有通知权限，请到 设置 → Olé 里打开")
                return
            }
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = UNNotificationSound.default
            var when = DateComponents()
            when.hour = hour
            when.minute = minute
            let trigger = UNCalendarNotificationTrigger(dateMatching: when, repeats: true)
            let request = UNNotificationRequest(identifier: "ole.daily", content: content, trigger: trigger)
            center.add(request, withCompletionHandler: nil)
            reply(true, nil)
        }
    }

    private func haptic(_ kind: String) {
        switch kind {
        case "ok":
            UINotificationFeedbackGenerator().notificationOccurred(.success)
        case "bad":
            UINotificationFeedbackGenerator().notificationOccurred(.error)
        default:
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        }
    }
}
