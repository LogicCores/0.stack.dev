define([
    'intern!object',
    'intern/chai!assert'
], function (registerSuite, assert) {

    registerSuite({
        name: 'browser-dev',

        browserDevTest: function () {
            assert.isTrue(true, 'test 1');

            var deferred = this.async();

            setTimeout(function () {

                assert.isTrue(true, 'test 2');

                return deferred.resolve();
            }, 50);
        }
    });
});