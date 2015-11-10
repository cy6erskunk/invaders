'use strict';

require('../game.css');

var Game = require('./Game'),
    Player = require('./Player'),
    Keyboarder = require('./Keyboarder'),
    Invader = require('./Invader');

Keyboarder.init();

var $threshold = document.getElementById('threshold');
var $cooldown = document.getElementById('cooldown');

$threshold.value = Invader.prototype.THRESHOLD;
$cooldown.value = Player.prototype.COOLDOWN;

$threshold.addEventListener('input', function () {
    this.style.color = 'black';
    var _value = this.value;

    if (_value > 0 && _value <= 1) {
        Invader.prototype.THRESHOLD = _value;
        this.style.color = 'green';
    }
});

$cooldown.addEventListener('input', function () {
    this.style.color = 'black';
    var _value = this.value;

    if (_value > 0) {
        Player.prototype.COOLDOWN = _value;
        this.style.color = 'green';
    }
});

var game;

document.getElementById('start').onclick = function () {
    game = new Game('screen', isSoundDisabled);
    this.blur();
};

var isSoundDisabled = false;
var soundButton = document.getElementById('mute');
var toggleSound = function () {
    if (game) {
        isSoundDisabled = game.toggleSound();
    } else {
        isSoundDisabled = !isSoundDisabled;
    }

    soundButton.textContent = isSoundDisabled ? 'unmute' : 'mute';

    this.blur();
};
soundButton.onclick = toggleSound;
