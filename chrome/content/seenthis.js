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
				bookmark.info = message.getElementsByTagName('text')[0].childNodes[0].nodeValue.substring(0,350);
			}
			bookmark.time = message.getElementsByTagName('date')[0].childNodes[0].nodeValue;
			var tags = message.getElementsByTagName('tag');
			bookmark.tags = '';
			for (var j = 0, k = tags.length; j < k; j++) {
				bookmark.tags += '[' + tags[j].childNodes[0].nodeValue  + ']' + (j < (k -1) ? ' ' : '');
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


var SeenthisLoader = function(statusElement, loadingElement, database, callback) {
  this.init(statusElement, loadingElement, database, callback);
};

for (var prop in LoaderBase.prototype) {
  SeenthisLoader.prototype[prop] = LoaderBase.prototype[prop];
}

SeenthisLoader.prototype.url = 'http://seenthis.net/?page=xml_export';

SeenthisLoader.prototype._load = function() {

  var self = this;
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      try {
        request.status
      } catch(e) {
        // error
        self.error('error :connect error :' + self.url);
      }

      if (request.status == 200) {
        // success

        var xml = request.responseXML;

        var userId = SeenthisParser.getUserId(xml);

        prefBranch.setCharPref('userId', userId);
        incsearch.userId = userId;

        var bookmarks = SeenthisParser.parse(xml);

        self.total = bookmarks.length;

        var generator = self.update(bookmarks);

        var executer = new Executer(
          generator,
          100,
          function(count) {
            self.dispLoading(count);
          },
          function() {
            self.dispEnd(bookmarks.length);
            self.callback();
          }
        );

        executer.run();
      } else {
        // error
        var errMsg = 'error: ' + request.status + ': ' + request.statusText + ': ' + self.url;
        self.error(errMsg);
      }
    }
  };
  request.open("POST", this.url, true);
  request.send(null);
};


var EXTENSION_NAME = 'seenthis_search';
var BookmarkLoader = SeenthisLoader;
