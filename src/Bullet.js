/* eslint-env browser */
/* eslint quotes: [ 1, "single" ], no-underscore-dangle: 0 */
'use strict';
var Bullet = function(center, velocity, color) {
    this.size = { x: 3, y: 3 };
    this.center = center;
    this.velocity = velocity;
    this.color = color;
};

Bullet.prototype = {
    update: function () {
        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
    }
};

module.exports = Bullet;
