var SeenthisParser = {
	parse: function(xml) {
		var threads = xml.getElementsByTagName('thread');
		var list = [];
		for (var i = 0, len = threads.length; i < len; i++) {
			var bookmark = {};
			var thread = threads[i];
			bookmark.id = i;
			bookmark.url = thread.getAttribute('href');
			var message = thread.getElementsByTagName('message')[0];
			bookmark.title = message.getElementsByTagName('text')[0].childNodes[0].nodeValue.split('\n')[0];
			if (message.getElementsByTagName('text')[0].childNodes[0].nodeValue.split('\n').length > 1) {
				bookmark.info = message.getElementsByTagName('text')[0].childNodes[0].nodeValue;
			}
			bookmark.time = message.getElementsByTagName('date')[0].childNodes[0].nodeValue;
			var tags = message.getElementsByTagName('tag');
			bookmark.tags = '';
			for (var j = 0, k = tags.length; j < k; j++) {
				bookmark.tags += '<a href="https://seenthis.net/tag/'+ tags[j].childNodes[0].nodeValue +'" target="_blank" rel="external noopener noreferrer">#' + tags[j].childNodes[0].nodeValue  + '</a>' + (j < (k -1) ? ' ' : '');
			}
			list.push(bookmark);
		}
		return list;
	},
	getUserId: function(xml) {
		var user = xml.evaluate('/messages/@href', xml, null, XPathResult.STRING_TYPE, null).stringValue;
		return user.substr(user.lastIndexOf('/') + 1);
	}
}