'use strict';
/* 我的：统计、设置、AI 设置、数据备份。 */

Views.me = root => {
  const S = Store.state, st = S.settings;
  const lessonsDone = Object.values(S.lessons).filter(l => l.done).length;
  const week = Store.week();
  const max = Math.max(st.goal, ...week.map(d => d.xp));

  const sel = (options, value, onChange) => {
    const s = h('select', null, options.map(o => h('option', { value: String(o[0]), selected: String(o[0]) === String(value) }, o[1])));
    s.value = String(value);
    s.addEventListener('change', () => onChange(s.value));
    return s;
  };
  const sw = (get, set) => {
    const b = h('button', { class: 'switch' + (get() ? ' on' : ''), role: 'switch' });
    b.addEventListener('click', async () => { const ok = await set(!get()); if (ok !== false) b.classList.toggle('on', get()); });
    return b;
  };
  const rowEl = (label, control, hint) => h('div', { class: 'setrow' }, h('div', { class: 'grow' }, label, hint ? h('div', { class: 'small mut' }, hint) : null), control);
  const save = () => Store.save();

  const voiceSel = h('select', null, h('option', { value: '' }, '自动（音质最好的）'));
  voiceSel.addEventListener('change', () => { st.voiceId = voiceSel.value; save(); TTS.speak('Hola, ¿qué tal? Así suena mi voz.'); });
  Native.call('voices', { lang: st.variant }).then(list => {
    (list || []).forEach(v => voiceSel.appendChild(h('option', { value: v.id, selected: v.id === st.voiceId }, v.name + (v.quality >= 2 ? '（增强）' : ''))));
    if (st.voiceId) voiceSel.value = st.voiceId;
  }).catch(() => {});

  const rate = h('input', { type: 'range', min: '0.6', max: '1.2', step: '0.05', value: String(st.rate) });
  rate.addEventListener('change', () => { st.rate = parseFloat(rate.value); save(); TTS.speak('Así de rápido voy a hablar.'); });

  const profile = h('textarea', { class: 'inp', style: 'min-height:64px', placeholder: '例如：在制造业做技术文档，喜欢钩织和做饭，打算去西班牙旅行', value: st.profile || '' });
  profile.addEventListener('change', () => { st.profile = profile.value.trim(); save(); });

  const time = h('input', { type: 'time', value: String(st.reminder.h).padStart(2, '0') + ':' + String(st.reminder.m).padStart(2, '0') });
  const applyReminder = async on => {
    try {
      await Native.call('notify', { enabled: on, hour: st.reminder.h, minute: st.reminder.m, title: '¡Hora de español!', body: '今天的西语还没练，来几分钟吧。' });
      st.reminder.on = on; save(); return true;
    } catch (e) { UI.toast(e.message, 3500); return false; }
  };
  time.addEventListener('change', () => {
    const [hh, mm] = time.value.split(':').map(Number);
    if (isNaN(hh)) return;
    st.reminder.h = hh; st.reminder.m = mm || 0; save();
    if (st.reminder.on) applyReminder(true);
  });

  add(root, [
    h('div', { class: 'title' }, 'Yo'), h('div', { class: 'sub', style: 'margin-bottom:16px' }, '当前级别 ' + st.level + ' · ' + (st.variant === 'es-ES' ? '西班牙西语' : '拉美西语')),
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', null, Store.streak()), h('span', null, '连续天数')),
      h('div', { class: 'stat' }, h('b', null, S.xp), h('span', null, '总经验')),
      h('div', { class: 'stat' }, h('b', null, lessonsDone), h('span', null, '学完的课'))),
    h('div', { class: 'card', style: 'margin-top:10px' }, h('div', { class: 'small mut' }, '最近 7 天'),
      h('div', { class: 'week' }, week.map(d => h('div', null, h('span', null, d.xp || ''), h('i', { style: `height:${Math.round(d.xp / max * 60)}px;${d.xp >= st.goal ? '' : 'opacity:.45'}` }), d.label)))),

    h('div', { class: 'sec' }, 'AI'),
    h('div', { class: 'card' },
      h('button', { class: 'setrow', style: 'width:100%;text-align:left', onclick: () => Views.aiSettings() },
        h('div', { class: 'grow' }, 'AI 设置', h('div', { class: 'small mut' }, 'B1 以上的课程、对话、查词、批改都需要')),
        h('span', { class: 'v', style: `color:var(--${AI.ready() ? 'ok' : 'bad'})` }, AI.ready() ? (AI.PRESETS[st.ai.provider] || {}).name + ' ✓' : '未设置'), h('span', { class: 'mut' }, '›')),
      h('div', { style: 'padding:12px 0 4px' }, h('div', { class: 'small mut', style: 'margin-bottom:6px' }, '个人背景（可选）：AI 举例和出题时会贴近你的生活'), profile)),

    h('div', { class: 'sec' }, '学习'),
    h('div', { class: 'card' },
      rowEl('学哪种西语', sel([['es-ES', '西班牙（castellano）'], ['es-MX', '拉丁美洲']], st.variant, v => { st.variant = v; st.voiceId = ''; save(); UI.renderTab(); }), '影响朗读口音、语音识别和 AI 的用词'),
      rowEl('当前级别', sel(LEVELS.map(l => [l[0], l[0] + ' ' + l[1]]), st.level, v => { st.level = v; save(); UI.renderTab(); })),
      rowEl('每日目标', sel([[10, '10 经验 · 轻松'], [20, '20 经验'], [30, '30 经验 · 常规'], [50, '50 经验 · 认真'], [100, '100 经验 · 冲刺']], st.goal, v => { st.goal = parseInt(v, 10); save(); UI.renderTab(); })),
      rowEl('课后口语题', sw(() => st.speaking, v => { st.speaking = v; save(); }), '需要麦克风和语音识别权限'),
      rowEl('每日提醒', h('div', { class: 'row' }, time, sw(() => st.reminder.on, v => applyReminder(v))))),

    h('div', { class: 'sec' }, '朗读'),
    h('div', { class: 'card' },
      rowEl('语速', rate),
      rowEl('声音', voiceSel, '到 设置 → 辅助功能 → 朗读内容 → 声音 可下载“增强”音质'),
      rowEl('自动朗读', sw(() => st.autoSpeak, v => { st.autoSpeak = v; save(); }), '答题后、翻卡片时、AI 回复后自动读出来')),

    h('div', { class: 'sec' }, '数据'),
    h('div', { class: 'card' },
      h('button', { class: 'setrow', style: 'width:100%;text-align:left', onclick: async () => {
        try { await Native.call('copy', { text: Store.exportAll() }); UI.toast('备份已复制到剪贴板，粘贴到备忘录里保存', 3500); } catch (e) { UI.toast('复制失败：' + e.message); }
      } }, h('div', { class: 'grow' }, '备份', h('div', { class: 'small mut' }, '把进度、卡片和 AI 课文复制成一段文字'))),
      h('button', { class: 'setrow', style: 'width:100%;text-align:left', onclick: async () => {
        if (!(await UI.confirm('用剪贴板里的备份覆盖现在的数据？', '恢复'))) return;
        try { Store.importAll(await Native.call('paste')); UI.toast('已恢复'); UI.renderTab(); } catch (e) { UI.toast('恢复失败：' + (e.message || '剪贴板里不是备份数据'), 3500); }
      } }, h('div', { class: 'grow' }, '从备份恢复', h('div', { class: 'small mut' }, '先复制备份文字，再点这里'))),
      h('button', { class: 'setrow', style: 'width:100%;text-align:left', onclick: async () => {
        if (await UI.confirm(`删除已生成的 ${Object.keys(Store.gen).length} 节 AI 课文和查词缓存？学习进度不受影响。`, '删除')) { Store.clearGen(); UI.toast('已清除'); UI.renderTab(); }
      } }, h('div', { class: 'grow' }, '清除 AI 生成的内容', h('div', { class: 'small mut' }, `已生成 ${Object.keys(Store.gen).length} 节课`))),
      h('button', { class: 'setrow', style: 'width:100%;text-align:left;color:var(--bad)', onclick: async () => {
        if (await UI.confirm('清空全部学习进度、复习卡片和对话记录？这一步无法撤销。', '全部清空')) { Store.resetProgress(); UI.toast('已重置'); UI.renderTab(); }
      } }, '重置学习进度')),
    h('div', { class: 'small mut center', style: 'margin-top:18px' }, 'Olé 1.0 · A1–C2')
  ]);
};

Views.aiSettings = () => {
  UI.push('AI 设置', ctx => {
    const cfg = Store.settings().ai;
    const base = h('input', { class: 'inp', value: cfg.base || '', placeholder: 'https://…', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
    const model = h('input', { class: 'inp', value: cfg.model || '', placeholder: '模型名', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
    const key = h('input', { class: 'inp', type: 'password', placeholder: AI.hasKey ? '已保存（不改就留空）' : '粘贴 API 密钥', autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off' });
    const note = h('div', { class: 'small mut', style: 'margin:8px 0 14px' });
    const status = h('div', { style: 'margin-top:12px' });
    const setNote = () => { note.textContent = (AI.PRESETS[cfg.provider] || AI.PRESETS.custom).note; };
    const commit = async () => {
      cfg.base = base.value.trim(); cfg.model = model.value.trim();
      Store.save();
      if (key.value.trim()) { await AI.setKey(key.value); key.value = ''; key.placeholder = '已保存（不改就留空）'; }
    };
    const chips = chipRow(Object.keys(AI.PRESETS).map(k => [k, AI.PRESETS[k].name]), cfg.provider, v => {
      cfg.provider = v;
      const p = AI.PRESETS[v];
      if (v !== 'custom') { base.value = p.base; model.value = p.model; }
      setNote(); Store.save();
    }, true);
    setNote();
    add(ctx.body, [
      h('p', { class: 'small mut', style: 'margin-bottom:12px' }, '选一家 AI 服务，填上你自己的 API 密钥。密钥只存在这台手机上，只会发给你选的那家服务；用量从你自己的账户里扣。'),
      chips, note,
      h('div', { class: 'field' }, h('label', null, '接口地址'), base),
      h('div', { class: 'field' }, h('label', null, '模型'), model,
        h('div', { style: 'margin-top:8px' }, h('button', { class: 'chip', onclick: async e => {
          const b = e.currentTarget; b.textContent = '获取中…';
          try {
            await commit();
            const list = await AI.models();
            const picked = await UI.choose('选一个模型', list.slice(0, 60).map(m => ({ label: m, value: m })));
            if (picked) { model.value = picked; cfg.model = picked; Store.save(); }
          } catch (err) { UI.toast(err.message, 4000); }
          b.textContent = '获取模型列表';
        } }, '获取模型列表'))),
      h('div', { class: 'field' }, h('label', null, 'API 密钥'), key),
      h('button', { class: 'btn', onclick: async e => {
        const b = e.currentTarget;
        await commit();
        if (!AI.ready()) { status.textContent = ''; status.appendChild(h('div', { class: 'card', style: 'color:var(--bad)' }, '接口地址、模型和密钥都要填。')); return; }
        b.disabled = true; status.textContent = ''; status.appendChild(loadingEl('正在测试连接…'));
        try {
          const r = await AI.chat({ system: 'Eres un asistente. Responde solo con un saludo muy corto en español.', messages: [{ role: 'user', content: 'Hola' }], max: 60 });
          status.textContent = '';
          status.appendChild(h('div', { class: 'card', style: 'border-color:var(--ok)' }, h('b', { style: 'color:var(--ok)' }, '连接成功 ✓'), h('div', { class: 'es', style: 'margin-top:4px' }, r.trim().slice(0, 120))));
        } catch (err) {
          status.textContent = '';
          status.appendChild(h('div', { class: 'card', style: 'color:var(--bad)' }, err.message));
        }
        b.disabled = false;
      } }, '保存并测试'), status,
      h('div', { class: 'sec' }, '怎么拿到密钥'),
      h('div', { class: 'card small' }, mdEl(`- **DeepSeek**：platform.deepseek.com 注册、充值后在 API keys 里创建
- **通义千问**：阿里云百炼控制台里创建 API-KEY
- **Claude**：console.anthropic.com 里创建，国内访问需要代理
- **自定义**：任何兼容 OpenAI 接口的服务或中转，填它给的地址、模型名和密钥

模型名会更新。连接报“模型不对”时，点「获取模型列表」重新选一个。`))
    ]);
  });
};
