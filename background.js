function openView() {
	chrome.tabs.create({
		"url": chrome.extension.getURL("content/view.html")
	});
}

chrome.commands.onCommand.addListener(function(command) {
	if (command == "openview") {
		openView();
	}
});

chrome.browserAction.onClicked.addListener(openView);
