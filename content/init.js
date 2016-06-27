$(function() {
	
	/*
		charger le xml
	*/
	
	//var url = 'http://seenthis.net/?page=xml_export';
	var url = chrome.extension.getURL('content/dump.xml');
	var bookmarks = null;
	$.get(url, function(xml) {
		bookmarks = SeenthisParser.parse(xml);
			//console.log(bookmarks);
		var id = SeenthisParser.getUserId(xml);
		chrome.storage.local.set({userId: id});
			//chrome.storage.local.get('userId', (res) => { console.log(res); });
	}).done(function() {
		$('#total,#hits').text(bookmarks.length);
		/*
			stocker en db
		*/


		/*
			init listjs
		*/
		
		var list = new List(
			'seens', 
			{
				valueNames: [ 'title', { name: 'url', attr: 'href' } , 'info', 'tags', 'time' ],
				item: '<tr><td><a href="" class="url title" target="_blank"></a><br /><p class="info"></p></td><td class="tags"></td><td class="time"></td></tr>',
				page: 10,
				plugins: [
					ListPagination({})
				]
			},
			bookmarks
		).on('updated', function(list){
			$('#hits').text(list.matchingItems.length);
		});
	});



});