var options = {
	pagination: 10
};
function saveOptions(e) {
	options.pagination = document.querySelector("#pagination").value;
	localforage.setItem('options', options);
}
function restoreOptions() {
	localforage.getItem('options').then(function(value) {
		if (value) {
			options = value;
		}
		document.querySelector("#pagination").value = options.pagination;
	});
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
