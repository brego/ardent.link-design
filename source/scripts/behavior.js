/* jshint freeze:false */
/* global Modernizr */
(function(doc, win) {
	var addEvent         = 'addEventListener',
		getByTag         = 'getElementsByTagName',
		getByClass       = 'getElementsByClassName',
		type             = 'gesturestart',
		qsa              = 'querySelectorAll',
		fix_viewport     = null,
		fix_links        = null,
		fix_footer       = null,
		load_ga          = null,
		get_script       = null,
		add_class        = null,
		debounce         = null,
		document_ready   = null,
		scales           = [1, 1],
		meta             = qsa in doc ? doc[qsa]('meta[name=viewport]') : [],
		links            = doc[getByTag]('a'),
		// font_families    = ['Lato:400,700,400italic:latin,latin-ext', 'Source+Code+Pro::latin'],
		font_families    = ['Work+Sans:400,600:latin-ext', 'Source+Code+Pro::latin'],
		// font_families    = ['Lato:400,700,400italic:latin,latin-ext'],
		html             = doc[getByTag]('html')[0],
		body             = doc[getByTag]('body')[0];

	document_ready = function (callback) {
		var readyList                   = [],
		    readyFired                  = false,
		    readyEventHandlersInstalled = false;

		function ready() {
			if (!readyFired) {
				readyFired = true;
				for (var i = 0; i < readyList.length; i++) {
						readyList[i].fn.call(win);
				}
				readyList = [];
			}
		}
		function readyStateChange() {
			if (doc.readyState === "complete") {
				ready();
			}
		}

		if (readyFired) {
			setTimeout(function() {callback();}, 1);
			return;
		} else {
			readyList.push({fn: callback});
		}
		if (doc.readyState === "complete" || (!doc.attachEvent && doc.readyState === "interactive")) {
			setTimeout(ready, 1);
		} else if (!readyEventHandlersInstalled) {
			if (doc.addEventListener) {
				doc.addEventListener("DOMContentLoaded", ready, false);
				win.addEventListener("load", ready, false);
			} else {
				doc.attachEvent("onreadystatechange", readyStateChange);
				win.attachEvent("onload", ready);
			}
			readyEventHandlersInstalled = true;
		}
	};

	get_script = function (options) {
		var script = doc.createElement('script'),
		    prior  = doc[getByTag]('script')[0];
		script.async = 1;
		prior.parentNode.insertBefore(script, prior);

		script.onload = script.onreadystatechange = function( _, isAbort ) {
			if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
					script.onload = script.onreadystatechange = null;
					script = undefined;

					if (!isAbort) {
						options.success();
					}
			}
		};

		script.src = options.url;
	};

	add_class = function (el, className) {
		if (el.classList) {
			el.classList.add(className);
		} else {
  		el.className += ' ' + className;
		}
	};

	debounce = function (func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	};

	// Google font loader
	get_script({
		dataType: 'script',
		url:      'http://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js',
		cache:    true,
		success: function() {
			win.WebFont.load({
				google: {
					families: font_families
				},
				timeout: 3000
			});
		}
	});

	// By @mathias, @cheeaun and @jdalton
	// https://gist.github.com/mathiasbynens/901295
	// iOS viewport scaling bug
	fix_viewport = function() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix_viewport, true);
	};
	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix_viewport();
		scales = [0.25, 1.6];
		doc[addEvent](type, fix_viewport, true);
	}

	// Those mailto links
	fix_links = function() {
		for (var i = 0; i < links.length; i++) {
			if (links[i].href.indexOf(' insert-at-sign-here ') !== -1) {
				links[i].href = links[i].href.replace(' insert-at-sign-here ', '@');
				links[i].href = links[i].href.replace('this-sites-address', window.location.host);
			}
		}
	};

	// Google Analytics loader
	load_ga = function (uid) {
		get_script({
			dataType: 'script',
			url:      'http://www.google-analytics.com/ga.js',
			cache:    true,
			success: function() {
				try {
					var t;
					if (!(win._gat && win._gat._getTracker)) {
						throw 'Tracker has not been defined';
					}
					t = win._gat._getTracker(uid);
					t._trackPageview();
				} catch(e) {}
			}
		});
	};

	fix_footer = function() {
		if (Modernizr.flexbox === false && Modernizr.flexboxlegacy === false && Modernizr.flexboxtweener === false) {
			add_class(html, 'no-real-flexbox');

			var fix_footer_height = function() {
				body.style.marginBottom = doc[getByClass]('site-footer')[0].offsetHeight;
			};
			fix_footer_height();
			doc[addEvent]('resize', debounce(fix_footer_height, 250));
		}
	};

	// DOCUMENT LOAD
	document_ready(function() {

		// Fix footer (in dumb browsers)
		fix_footer();

		// Fix mailto links
		fix_links();

		setTimeout(function() {
			if (!win.WebFont) {
				add_class(html, 'wf-inactive');
			}
		}, 2000);

		// Load Google Analytics
		// load_ga('UA-7594481-5');
	});
} (document, window));

/* jshint ignore:start */
