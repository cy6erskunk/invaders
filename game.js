;(function () {
    var Game = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        this.gameSize = { x: canvas.width, y: canvas.height };

        this.bodies = createInvaders(this).concat([
            new Player(this, this.gameSize)
        ]);

        var self = this;

        loadSound("shoot.wav", function (shootSound) {
            self.shootSound = shootSound;
            self.state = self.STATES.PROGRESS;

            var tick = function () {
                self.gcBodies();
                self.update();
                self.draw(screen, self.gameSize) && requestAnimationFrame(tick);
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
                screen.font = '48px serif';
                if (this.state === this.STATES.WIN) {
                    screen.fillStyle = 'green';
                    screen.fillText('Win!', 50, 100);
                } else {
                    screen.fillStyle = 'red';
                    screen.fillText('Lost', 50, 100);
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
        }
    };

    var Player = function(game, gameSize) {
        this.game = game;
        this.gameSize = gameSize;
        this.size = { x: 15, y: 15 };
        this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.x };
        this.keyboarder = new Keyboarder();
        this.velocity = 2;
        this.color = 'blue';
        this.cooldown = 0;
        this.cooldownElem = document.createElement('progress');
        this.cooldownElem.max = this.COOLDOWN;
        this.cooldownElem.value = this.COOLDOWN;
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

            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                if (this.center.x - this.size.x / 2 - this.velocity > 0) {
                    this.center.x -= this.velocity;
                }
            } else
            if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                if (this.center.x + this.size.x / 2 + this.velocity < this.gameSize.x) {
                    this.center.x += this.velocity;
                }
            }

            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
                if (!this.cooldown) {
                    var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x / 2 }, { x: 0, y: -6}, 'green');
                    this.cooldown = this.COOLDOWN;
                    this.game.addBody(bullet);
                    this.game.shootSound.load();
                    this.game.shootSound.play();
                }
            }
        }
    };

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

    var createInvaders = function (game) {
        var invaders = [];
        for (var i = 0; i < 24; i++) {
            var x = 30 + (i % 8) * 30;
            var y = 30 + (i % 3) * 30;
            invaders.push(new Invader(game, {x: x, y: y}));
        }

        return invaders;
    };

    var drawRect = function (screen, body) {
        screen.fillStyle = body.color || 'black';
        screen.fillRect(body.center.x - body.size.x / 2,
                 body.center.y - body.size.y / 2,
                 body.size.x, body.size.y);
    };

    var Keyboarder  = function () {
        var keyState = {};

        window.onkeydown = function (e) {
            keyState[e.keyCode] = true;
        };

        window.onkeyup = function (e) {
            keyState[e.keyCode] = false;
        };

        this.isDown = function (keyCode) {
            return keyState[keyCode] === true;
        };

        this.KEYS = {
            LEFT: 37,
            RIGHT: 39,
            SPACE: 32
        };
    };

    var colliding = function (b1, b2) {
        return !(b1 === b2 ||
                b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
                b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
                b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
                b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2)
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

    var $threshold = document.getElementById('threshold');
    var $cooldown = document.getElementById('cooldown');

    $threshold.value = Invader.prototype.THRESHOLD;
    $cooldown.value = Player.prototype.COOLDOWN;

    $threshold.addEventListener('input', function (e) {
        this.style.color = 'black';
        var _value = this.value;

        if (_value > 0 && _value <= 1) {
            Invader.prototype.THRESHOLD = _value;
            this.style.color = 'green';
        }
    });

    $cooldown.addEventListener('input', function (e) {
        this.style.color = 'black';
        var _value = this.value;

        if (_value > 0) {
            Player.prototype.COOLDOWN = _value;
            this.style.color = 'green';
        }
    });

    document.getElementById('start').onclick = function () {
        new Game('screen');
    };
})();
