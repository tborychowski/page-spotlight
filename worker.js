chrome.action.onClicked.addListener(async (tab) => {

	await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['app.css'], });
	await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['app.js'] });

	chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
});
