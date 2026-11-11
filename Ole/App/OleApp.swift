import SwiftUI
import WebKit

@main
struct OleApp: App {
    var body: some Scene {
        WindowGroup {
            WebContainer()
                .ignoresSafeArea(.container, edges: .all)
        }
    }
}

struct WebContainer: UIViewRepresentable {
    func makeCoordinator() -> Bridge {
        Bridge()
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.userContentController.add(context.coordinator, name: "ole")

        let web = WKWebView(frame: .zero, configuration: config)
        web.isOpaque = false
        web.backgroundColor = UIColor.systemBackground
        web.scrollView.backgroundColor = UIColor.clear
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.allowsLinkPreview = false
        if #available(iOS 16.4, *) {
            web.isInspectable = true
        }
        context.coordinator.webView = web

        if let dir = Bundle.main.url(forResource: "Web", withExtension: nil) {
            let index = dir.appendingPathComponent("index.html")
            web.loadFileURL(index, allowingReadAccessTo: dir)
        } else {
            web.loadHTMLString("<h2 style='font-family:-apple-system;padding:40px'>Web 资源缺失</h2>", baseURL: nil)
        }
        return web
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
