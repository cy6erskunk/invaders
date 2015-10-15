/* eslint-env browser */
/* eslint quotes: [ 1, "single" ], no-underscore-dangle: 0 */
'use strict';
var Keyboarder = {
    init: function () {
        window.onkeydown = function (e) {
            Keyboarder.keyState[e.keyCode] = true;
        };

        window.onkeyup = function (e) {
            Keyboarder.keyState[e.keyCode] = false;
        };
    },
    isDown: function (keyCode) {
        return this.keyState[keyCode] === true;
    },
    keyState: {},
    KEYS: {
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32,
        ESC: 27
    },
    stopKey: function (keyCode) {
        this.keyState[keyCode] = false;
    }
};

module.exports = Keyboarder;
