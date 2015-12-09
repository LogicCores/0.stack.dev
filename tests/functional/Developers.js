define([
	'intern!object',
	'intern/chai!assert',
	'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (registerSuite, assert, pollUntil) {

	var url = 'http://127.0.0.1:8090/0/dev-73EFF412-420F-4906-8BF5-EA0D842B86AC/Panels/IDE-Left';

	registerSuite({
		name: 'Developers (functional)',

		'check developers': function () {
			var remote = this.remote;

			// @see https://theintern.github.io/leadfoot/Command.html

			var p = remote.get(url);

			return p.then(pollUntil('return document.querySelector("#page-content H1");', 15 * 1000))
				.findByCssSelector('#developers')
				.getVisibleText()
				.then(function (text) {
					assert.equal(text, 'Developers');
				});
		}
	});
});