/*!
* Howler.js Audio Sprite Demo
* howlerjs.com
*
* (c) 2013-2018, James Simpson of GoldFire Studios
* goldfirestudios.com
*
* MIT License
*/
var elms = ['waveform', 'sprite0', 'sprite1', 'sprite2', 'sprite3', 'sprite4', 'sprite5'];
elms.forEach(function (elm) {
    window[elm] = document.getElementById(elm);
});
var Sprite = function (options) {
    var self = this;
    self.sounds = [];
    self._width = options.width;
    self._left = options.left;
    self._spriteMap = options.spriteMap;
    self._sprite = options.sprite;
    self.setupListeners();
    self.sound = new Howl({
        src: options.src,
        sprite: options.sprite
    });
    window.addEventListener('resize', function () {
        self.resize();
    }, false);
    self.resize();
    requestAnimationFrame(self.step.bind(self));
};
Sprite.prototype = {
    setupListeners: function () {
        var self = this;
        var keys = Object.keys(self._spriteMap);
        keys.forEach(function (key) {
            window[key].addEventListener('click', function () {
                self.play(key);
            }, false);
        });
    },
    play: function (key) {
        var self = this;
        var sprite = self._spriteMap[key];
        var id = self.sound.play(sprite);
        var elm = document.createElement('div');
        elm.className = 'progress';
        elm.id = id;
        elm.dataset.sprite = sprite;
        window[key].appendChild(elm);
        self.sounds.push(elm);
        self.sound.once('end', function () {
            var index = self.sounds.indexOf(elm);
            if (index >= 0) {
                self.sounds.splice(index, 1);
                window[key].removeChild(elm);
            }
        }, id);
    },
    resize: function () {
        var self = this;
        var scale = window.innerWidth / 3600;
        var keys = Object.keys(self._spriteMap);
        for (var i = 0; i < keys.length; i++) {
            var sprite = window[keys[i]];
            sprite.style.width = Math.round(self._width[i] * scale) + 'px';
            if (self._left[i]) {
                sprite.style.left = Math.round(self._left[i] * scale) + 'px';
            }
        }
    },
    step: function () {
        var self = this;
        for (var i = 0; i < self.sounds.length; i++) {
            var id = parseInt(self.sounds[i].id, 10);
            var offset = self._sprite[self.sounds[i].dataset.sprite][0];
            var seek = (self.sound.seek(id) || 0) - (offset / 1000);
            self.sounds[i].style.width = (((seek / self.sound.duration(id)) * 100) || 0) + '%';
        }
        requestAnimationFrame(self.step.bind(self));
    }
};
var sprite = new Sprite({
    width: [78, 60, 62, 70, 62, 1895],
    left: [0, 342, 680, 1022, 1361],
    src: ['../../tests/audio/sound2.webm', '../../tests/audio/sound2.mp3'],
    sprite: {
        one: [0, 450],
        two: [2000, 250],
        three: [4000, 350],
        four: [6000, 380],
        five: [8000, 340],
        beat: [10000, 11163]
    },
    spriteMap: {
        sprite0: 'one',
        sprite1: 'two',
        sprite2: 'three',
        sprite3: 'four',
        sprite4: 'five',
        sprite5: 'beat'
    }
});
