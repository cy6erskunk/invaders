'use strict';

var Player = require('./Player'),
    Keyboarder = require('./Keyboarder'),
    Invader = require('./Invader');

var createInvaders = function (game) {
    var invaders = [];
    for (var i = 0; i < 24; i++) {
        var x = 30 + (i % 8) * 30;
        var y = 30 + (i % 3) * 30;
        invaders.push(new Invader(game, {x: x, y: y}));
    }

    return invaders;
};

var colliding = function (b1, b2) {
    return !(b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
};

var Game = function (canvasId, isSoundDisabled) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');

    this.gameSize = { x: canvas.width, y: canvas.height };
    this._isSoundDisabled = isSoundDisabled;

    this.bodies = createInvaders(this).concat([
        new Player(this, this.gameSize)
    ]);

    this.paused = false;

    var self = this;

    loadSound('shoot.wav', function (shootSound) {
        self.shootSound = shootSound;
        self.state = self.STATES.PROGRESS;

        var tick = function () {
            self.gcBodies();
            if (! self.paused) {
                self.update();
            }
            if (Keyboarder.isDown(Keyboarder.KEYS.ESC)) {
                Keyboarder.stopKey(Keyboarder.KEYS.ESC);
                self.paused = !self.paused;
                console.log('PAUSE:', self.paused);
            }
            if (self.draw(screen, self.gameSize)) {
                requestAnimationFrame(tick);
            }
        };

        tick();
    });
};

Game.prototype = {
    STATES: {
        PROGRESS: 0,
        WIN: 1,
        LOOSE: 2
    },
    update: function () {
        var bodies = this.bodies;
        var notCollidingWithAnything = function (b1) {
            return bodies.filter(function (b2) { return colliding(b1, b2); }).length === 0;
        };

        this.bodies = this.bodies.filter(notCollidingWithAnything);
        for (var i = 0; i < this.bodies.length; i++ ) {
            this.bodies[i].update();
        }

        if (this.bodies.filter(function (b) { return b instanceof Player; }).length === 0) {
            this.state = this.STATES.LOOSE;
        } else if (this.bodies.filter(function (b) { return b instanceof Invader; }).length === 0) {
            this.state = this.STATES.WIN;
        }
    },
    draw: function (screen, gameSize) {
        screen.clearRect(0, 0, gameSize.x, gameSize.y);
        if (this.state === this.STATES.PROGRESS) {
            for (var i = 0; i < this.bodies.length; i++ ) {
                drawRect(screen, this.bodies[i]);
            }
            return true;
        } else {
            screen.font = '64px Arial';
            if (this.state === this.STATES.WIN) {
                screen.fillStyle = 'green';
                screen.fillText('You Win!', 20, 150);
            } else {
                screen.fillStyle = '#F4713D';
                screen.fillText('You Loose', 5, 150);
            }
            return false;
        }
    },
    addBody: function (body) {
        this.bodies.push(body);
    },
    invadersBelow: function (invader) {
        return this.bodies.filter(function(b) { return b instanceof Invader &&
            b.center.y > invader.center.y &&
            b.center.x - invader.center.x < invader.size.x;
        }).length > 0;
    },
    gcBodies: function () {
        var self = this;

        this.bodies = this.bodies.filter(function (b) {
            return b.center.x + b.size.x / 2 < self.gameSize.x &&
                b.center.x - b.size.x / 2 > 0 &&
                b.center.y + b.size.y / 2 < self.gameSize.y &&
                b.center.y - b.size.y / 2 > 0;
        });
    },
    isSoundDisabled: function () {
        return this._isSoundDisabled;
    },
    toggleSound: function () {
        return this._isSoundDisabled = !this._isSoundDisabled;
    }
};

var drawRect = function (screen, body) {
    screen.fillStyle = body.color || 'black';
    screen.fillRect(body.center.x - body.size.x / 2,
             body.center.y - body.size.y / 2,
             body.size.x, body.size.y);
};

var loadSound = function (url, callback) {
    var loaded = function () {
        callback(sound);
        sound.removeEventListener('canplaythrough', loaded);
    };

    var sound = new Audio(url);
    sound.addEventListener('canplaythrough', loaded);
    sound.load();
};

module.exports = Game;
