$(function() {

	var bookmarks, list = null;

	var initList = function() {
		list = new List(
			'seens', 
			{
				valueNames: [ 'title', { name: 'url', attr: 'href' } , 'info', 'tags', 'time' ],
				item: '<tr><td><a href="" class="url title" target="_blank"></a><br /><p class="info"></p></td><td class="tags"></td><td class="time"></td></tr>',
				page: 10,
				plugins: [
					ListPagination({
						name: "paginationTop",
						paginationClass: "paginationTop",
						includeDirectionLinks: true,
						leftDirectionText: 'prev',
						rightDirectionText: 'next',
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
	};

	var loadXml = function() {
		var url = 'http://seenthis.net/?page=xml_export';
		$.get(url, function(xml) {
			bookmarks = SeenthisParser.parse(xml);
			localforage.setItem('database', bookmarks);
			localforage.setItem('userId', SeenthisParser.getUserId(xml));
			initList();
			$('html').removeClass('loading');
			alert( bookmarks.length + ' posts loaded');
		});
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
		$('html').addClass('loading');
		list.clear();
		loadXml();
	});

});