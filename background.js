function openView() {
	chrome.tabs.create({
		"url": chrome.extension.getURL("chrome/content/view.html")
	});
}

chrome.commands.onCommand.addListener(function(command) {
	if (command == "openview") {
		openView();
	}
});

chrome.browserAction.onClicked.addListener(openView);

/*
function openIncSearch(aWindow) {
  var gBrowser = aWindow.gBrowser;

  var openUrl = 'chrome://seenthis_search/content/view.html';
  var target = null;

  var tabs = gBrowser.tabContainer.childNodes;

  for (var i = 0, len = tabs.length; i < len; i++) {
    if (tabs[i].linkedBrowser.currentURI.spec == openUrl) {
      target = tabs[i];
      break;
    }
  }

  if (!target) {
    gBrowser.selectedTab = gBrowser.addTab(openUrl);
  } else {
    gBrowser.selectedTab = target;
    target.linkedBrowser.contentDocument.getElementById('text').focus();
  }
}
*/