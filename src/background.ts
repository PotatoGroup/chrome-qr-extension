let isSidePanelOpen = false;
// 监听扩展图标点击事件，打开侧边面板
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (tab.windowId) {
      // 打开侧边面板
      await (chrome.sidePanel as any).open({ windowId: tab.windowId });
      isSidePanelOpen = true;
    }
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});

// 记录侧边面板的激活状态
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    if(!isSidePanelOpen) return;
    await chrome.runtime.sendMessage({
      type: 'TAB_CHANGED',
      tabId: activeInfo.tabId,
      windowId: activeInfo.windowId
    });
  } catch (error) {
    // 如果侧边面板未打开或无法发送消息，静默处理
    console.log('Side panel not active or error sending message:', error);
  }
});

// 监听标签页URL更新事件
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 只在URL变化且页面加载完成时触发
  if (changeInfo.status === 'complete' && changeInfo.url && isSidePanelOpen) {
    try {
      await chrome.runtime.sendMessage({
        type: 'TAB_UPDATED',
        tabId: tabId,
        url: changeInfo.url
      });
    } catch (error) {
      console.log('Side panel not active or error sending message:', error);
    }
  }
});

// 当扩展安装时设置侧边面板
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed, side panel ready');
});
