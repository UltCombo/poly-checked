// NOTE: This script is meant for IE<=8 ONLY. Make sure to include it using conditional comments if you don't want errors in modern browsers.
// Requires jQuery 1.x (compatible with IE7-8) version >= 1.7 (tested up to 1.10.2)
// Avoid loading this script asynchronously, unrecognized selectors in inline style elements are lost after DOM ready
(function($) {

	var CHECKED_CLASS = 'poly-checked',
		JUST_CHANGED_PARENT_CLASS = 'poly-just-changed',
		PATCHED_DATA_PROP = 'isPolyChecked',
		inputsLiveNodeList = document.getElementsByTagName('input');

	function patchStylesheet(elem, text) {
		// A global replace here is a bit hackish, but works for the great majority of use cases.
		// Issue: may have unintended effects on CSS strings (URLs, content property value) containing the ":checked" substring.
		// Workaround: Use an escape sequence: "\00003Achecked" and "\3A checked" will both print ":checked"
		//(U+0020 space characters immediately following a hexadecimal escape sequence are automatically consumed by the escape sequence)
		elem.styleSheet.cssText = text.replace(/:checked/g, '.' + CHECKED_CLASS);
	}

	$('style').each(function() {
		// Retrieving the style element's innerHTML only works before DOM ready,
		// after DOM ready the rules with invalid selectors are simply removed from the style's innerHTML. (dafaq microsoft??)
		patchStylesheet(this, this.innerHTML);
	});

	$('link[rel=stylesheet]').each(function() {
		var elem = this;
		// There's apparently no other way to retrieve an external stylesheet's text content other than XHR.
		// Issue: can't polyfill stylesheets from other domains due to same-origin policy.
		// Workaround: host all stylesheets that need polyfilling in the same domain from where they're being <link>ed to.
		$.get(this.href, function(rawCSSText) {
			patchStylesheet(elem, rawCSSText);
		});
	});

	function patchInput(elem) {
		// Every input has unchecked styling until patched, so we only need to refresh the checked ones' styling.
		if (elem.checked) refreshStyling(elem);

		// propertychange fires due to both user action and JS code, which is ideal for our use case.
		// Too bad it doesn't bubble though, hence we need to patch each input manually. See patchNonPatchedInputs below.
		$(elem).on('propertychange._polychecked', function(e) {
			if (e.originalEvent.propertyName === 'checked') {
				refreshStyling(this);
			}
		}).data(PATCHED_DATA_PROP, 1);
	}

	function refreshStyling(elem) {
		$(elem).toggleClass(CHECKED_CLASS, elem.checked)
			//and now we force IE to execute selectors matching again so that sibling selectors work
			.parent().addClass(JUST_CHANGED_PARENT_CLASS).removeClass(JUST_CHANGED_PARENT_CLASS);
	}

	function patchNonPatchedInputs() {
		// As this will be used for polling, using as much native JS as possible should provide better performance.
		for (var i = 0; i < inputsLiveNodeList.length; i++) {
			var input = inputsLiveNodeList[i];
			if ((input.type === 'checkbox' || input.type === 'radio') && !$.data(input, PATCHED_DATA_PROP)) {
				patchInput(input);
			}
		}
	}

	$(function() {
		// After refresh, MSIE7-8 restores the checked state of checkboxes on DOM ready without triggering change events,
		// hence we do it here.
		patchNonPatchedInputs();

		// Okay, this is far from ideal, I'd very much prefer an evented or delegated way to do this but it is IMPOSSIBRU.
		// - IE<9 does not support Mutation Events (which would also have terrible performance anyway);
		// - NodeLists don't have any event or method to handle newly added elements (why is it even a live NodeList?);
		setInterval(patchNonPatchedInputs, 200);
	});

}(jQuery));
