chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request !== "opensearch-block") {
      return;
    }
    chrome.browserAction.setBadgeText({
      text: '1',
      tabId: sender.tab.id
    });
});
