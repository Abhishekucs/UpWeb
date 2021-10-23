let liked = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.clear();
  chrome.storage.sync.set({ liked });
});
