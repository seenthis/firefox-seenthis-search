$(function() {

	var bookmarks, list = null;
	var options = {
		pagination: 10
	};

	var initList = function() {
		localforage.getItem('options').then(function(value) {
			if (value) {
				options = value;
			}
			list = new List(
				'seens',
				{
					valueNames: [ 'title', { name: 'url', attr: 'href' } , 'info', 'tags', 'time' ],
					item: '<tr><td><a href="" class="url title" target="_blank"></a><br /><p class="info"></p></td><td class="tags"></td><td class="time"></td></tr>',
					page: options.pagination,
					plugins: [
						ListPagination({
							name: "paginationTop",
							paginationClass: "paginationTop",
							includeDirectionLinks: true,
							leftDirectionText: chrome.i18n.getMessage("linkLeft"),
							rightDirectionText: chrome.i18n.getMessage("linkRight"),
							innerWindow: 0
						}),
						ListPagination({
							name: "paginationBottom",
							paginationClass: "paginationBottom",
							innerWindow: 4
						})
					]
				},
				bookmarks
			).on('updated', function(list){
				$('#hits').text(list.matchingItems.length);
			});
			$('#text').focus();
		});
	};

	var loadXml = function() {
		var url = 'http://seenthis.net/?page=xml_export';
		$('html').addClass('loading');
		$.get(url, function(xml) {
			bookmarks = SeenthisParser.parse(xml);
			localforage.setItem('database', bookmarks);
			localforage.setItem('userId', SeenthisParser.getUserId(xml));
			initList();
			$('html').removeClass('loading');
			alert( bookmarks.length + ' posts loaded');
		});
	};

	var sync = function() {
		list.clear();
		loadXml();
	};

	localforage.getItem('database').then(function(value) {
		if (!value) {
			$('html').addClass('loading');
			loadXml();
		} else {
			bookmarks = value;
			initList();
		}
		$('#total,#hits').text(bookmarks.length);
	}).catch(function(err) {
		console.log(err);
	});

	$('#sync').on('click', function() {
		sync();
	});

	// shortcuts
	document.addEventListener(
		'keydown',
		function(event) {
			if (event.ctrlKey) {
				switch(event.keyCode) {
					case 37:  // Left
						$('.paginationTop .prev').trigger('click');
						break;
					case 39:  // Right
						$('.paginationTop .next').trigger('click');
						break;
					default:
						break;
				}
			}
		},
	false);

});