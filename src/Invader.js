'use strict';

import Bullet from'./Bullet';

var Invader = function(game, center) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = center;
    this.color = '#ff8000';

    this.patrolX = 0;
    this.speedX = 0.3;
};

Invader.prototype = {
    THRESHOLD: 0.995,
    update: function () {
        if (this.patrolX < 0 || this.patrolX > 40) {
            this.speedX *= -1;
        }

        this.center.x += this.speedX;
        this.patrolX += this.speedX;

        if ( !this.game.invadersBelow(this) && Math.random() > this.THRESHOLD ) {
            var bullet = new Bullet({ x: this.center.x, y: this.center.y + this.size.x / 2 },
                    { x: Math.random() - 0.5, y: 2 }, 'red');
            this.game.addBody(bullet);
        }
    }
};

export default Invader;
