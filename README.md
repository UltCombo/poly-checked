poly-checked
============

Miraculous `:checked` pseudo-class polyfill.

## How to use

Include jQuery 1.x (compatible with old IE) >= 1.7, then the poly-checked script inside an IE conditional comment:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<!--[if lte IE 8]>
<script src="path/to/poly-checked.min.js"></script>
<![endif]-->
```

Make sure to include all stylesheets before the script and that's all!

See [**live demo**](http://jsbin.com/agAPaka/1).

## Features

- Transparent to the developer, no need to add ugly polyfill classes to your CSS.
- Works with dynamically created checkbox/radio elements.
- Full interoperability with JavaScript. Like the real `:checked` pseudo-class, changing an element's `checked` state will automatically update its style.
- Keeps the same selector specifity as your original selectors.
- Bonus: extra patch for `:checked` to work with sibling selectors. Very useful for customized CSS checkboxes/radios.

## Compatibility

Currently tested in IE 7 and 8.

## Known limitations & workarounds

- Can't polyfill stylesheets from different domains. There's no DOM API to retrieve unrecognized selectors nor raw CSS text from a `<link rel="stylesheet">` element, hence the polyfill uses XHR which is subject to the same-origin policy. The workaround is to host all stylesheets that require polyfilling in the same domain. Feel free to submit a PR or open an issue for discussion if you find a better alternative.
- Detecting dynamically added elements is done through long polling, which may cause some FOUC. jQuery's `.clone(true)` can be used on an already patched checkbox/radio to avoid the milliseconds of FOUC. It'd best if we could get rid of the polling altogether, but I haven't found any evented way to detect newly created input elements. Feel free to open a PR/issue as usual if there's any better way to handle this in old IE.
- Does not polyfill dynamically added stylesheets. This is a rare use case and I don't fill like adding more DOM polling here, but it is very possible to implement. Feel free to open a PR/issue if you have a non-polling solution.
- Does not polyfill the `:checked` pseudo-class for `option` elements (`option:checked`). Option elements are rather limited and cross-browser inconsistent for styling, hence this is not one of my priorities. You can always use one of the thousands of styled select/combobox plugins available out there.
