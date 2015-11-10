'use strict';

export default class Bullet {
        constructor (center, velocity, color) {
        this.size = { x: 3, y: 3 };
        this.center = center;
        this.velocity = velocity;
        this.color = color;
    }

    update () {
        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
    }
};
