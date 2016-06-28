function saveOptions(e) {
	chrome.storage.local.set({
		colour: document.querySelector("#pagination").value
	});
}
function restoreOptions() {
	chrome.storage.local.get('pagination', (res) => {
		document.querySelector("#pagination").value = res.colour || 10;
	});
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
