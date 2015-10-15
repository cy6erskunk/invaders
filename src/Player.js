'use strict';
/* eslint-env browser */
/* eslint quotes: [ 1, "single" ], no-underscore-dangle: 0 */
var Bullet = require('./Bullet'),
    Keyboarder = require('./Keyboarder');

var Player = function(game, gameSize) {
    this.game = game;
    this.gameSize = gameSize;
    this.size = { x: 15, y: 15 };
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.x };
    this.velocity = 2;
    this.color = 'blue';
    this.cooldown = 0;
    this.cooldownElem = document.createElement('progress');
    this.cooldownElem.max = this.COOLDOWN;
    this.cooldownElem.value = this.COOLDOWN;
    var _cde = document.querySelector('progress');
    if (_cde) {
        document.body.removeChild(_cde);
        _cde = null;
    }
    document.body.appendChild(this.cooldownElem);
};

Player.prototype = {
    COOLDOWN: 50, // number of ticks
    update: function () {
        if (this.cooldown > 0) {
            this.cooldown -= 1;
        } else {
            this.cooldown = 0;
        }
        this.cooldownElem.max = this.COOLDOWN; // in case it have been changed
        this.cooldownElem.value = this.COOLDOWN - this.cooldown;

        if (Keyboarder.isDown(Keyboarder.KEYS.LEFT)) {
            if (this.center.x - this.size.x / 2 - this.velocity > 0) {
                this.center.x -= this.velocity;
            }
        } else
        if (Keyboarder.isDown(Keyboarder.KEYS.RIGHT)) {
            if (this.center.x + this.size.x / 2 + this.velocity < this.gameSize.x) {
                this.center.x += this.velocity;
            }
        }

        if (Keyboarder.isDown(Keyboarder.KEYS.SPACE)) {
            if (!this.cooldown) {
                var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x / 2 }, { x: 0, y: -6}, 'green');
                this.cooldown = this.COOLDOWN;
                this.game.addBody(bullet);
                if (!this.game.isSoundDisabled()) {
                    this.game.shootSound.load();
                    this.game.shootSound.play();
                }
            }
        }
    }
};

module.exports = Player;
