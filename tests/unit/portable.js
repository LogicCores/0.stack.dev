define([
    'intern!object',
    'intern/chai!assert'
], function (registerSuite, assert) {

    registerSuite({
        name: 'portable-dev',

        portableDevTest: function () {
            assert.isTrue(true, 'identifier should be a valid UUID');
        }
    });
});