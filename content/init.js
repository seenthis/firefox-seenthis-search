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
					ListPagination({ outerWindow: 1 })
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
		});
	};

	localforage.getItem('database').then(function(value) {
		if (!value) {
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
		list.clear();
		loadXml();
	});

});