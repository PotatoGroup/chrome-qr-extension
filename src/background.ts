// 监听扩展图标点击事件，打开侧边面板
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 设置侧边面板宽度为300px
    if (tab.windowId) {
      // 打开侧边面板
      await (chrome.sidePanel as any).open({ windowId: tab.windowId });
    }
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});

// 当扩展安装时设置侧边面板
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed, side panel ready');
});