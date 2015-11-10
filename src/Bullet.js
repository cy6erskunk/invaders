'use strict';
var Bullet = function(center, velocity, color) {
    this.size = { x: 3, y: 3 };
    this.center = center;
    this.velocity = velocity;
    this.color = color;
};

Bullet.prototype = {
    update () {
        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
    }
};

export default Bullet;
