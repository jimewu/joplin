module.exports = function(markdownIt) {
	// Add `file:` protocol in linkify to allow text in the format of "file://..." to translate into
	// file-URL links in html view
	markdownIt.linkify.add('file:', {
		validate: function(text, pos, self) {
			const tail = text.slice(pos);
			if (!self.re.file) {
				// matches all local file URI on Win/Unix/MacOS systems including reserved characters in some OS (i.e. no OS specific sanity check)
				self.re.file = new RegExp('^[\\/]{2,3}[\\S]+');
			}
			if (self.re.file.test(tail)) {
				return tail.match(self.re.file)[0].length;
			}
			return 0;
		},
	});

	// enable file link URLs in MarkdownIt. Keeps other URL restrictions of MarkdownIt untouched.
	// Format [link name](file://...)
	markdownIt.validateLink = function(url) {
		const BAD_PROTO_RE = /^(vbscript|javascript|data):/;
		const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

		// url should be normalized at this point, and existing entities are decoded
		const str = url.trim().toLowerCase();

		if (str.indexOf('data:image/svg+xml,') === 0) {
			return true;
		}

		return BAD_PROTO_RE.test(str) ? (GOOD_DATA_RE.test(str) ? true : false) : true;
	};

	markdownIt.linkify.set({
		'fuzzyLink': false,
		'fuzzyIP': false,
		'fuzzyEmail': false,
	});
};
