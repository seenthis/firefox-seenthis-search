function saveOptions(e) {
	localforage.setItem('pagination', document.querySelector("#pagination").value);
}
function restoreOptions() {
	localforage.getItem('pagination').then(function(value) {
		document.querySelector("#pagination").value = value || 10;
	});
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
