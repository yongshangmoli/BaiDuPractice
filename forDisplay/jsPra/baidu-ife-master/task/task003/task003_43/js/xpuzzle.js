(function (win, xpuzzle) {
    win.xpuzzle = xpuzzle();
})(window, function () {
    'use strict';

    function XPuzzle(options) {
        options = options || {};
        var parentSelector = options.parentSelector || '.xpuzzle';
        this.container = document.querySelector(parentSelector);
        this.wraps = this.container.querySelectorAll('.xphoto');

        this.init();
    }

    XPuzzle.prototype.init = function () {
        this.container.className += ' xpuzzle-' + this.wraps.length;
    };

    return XPuzzle;
});
