'use strict';
(async function main() {
  const fit = () => {
    const vv = window.visualViewport;
    if (vv) document.documentElement.style.setProperty('--vvh', Math.round(vv.height) + 'px');
    if (window.scrollY) window.scrollTo(0, 0);
  };
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fit);
    window.visualViewport.addEventListener('scroll', fit);
    fit();
  }
  window.addEventListener('error', e => { console.error(e.error || e.message); });
  window.addEventListener('unhandledrejection', e => { console.error(e.reason); });

  await Store.init();
  await AI.init();
  UI.defineTabs([
    { id: 'learn', name: '学习', icon: 'Aa', render: Views.learn },
    { id: 'review', name: '复习', icon: '↻', render: Views.review },
    { id: 'chat', name: '对话', icon: '¿?', render: Views.chatTab },
    { id: 'tools', name: '工具', icon: '✦', render: Views.tools },
    { id: 'me', name: '我的', icon: 'Yo', render: Views.me }
  ]);
  UI.showTab('learn');
  window.__oleReady = true;
})();
