(function (window, document, undefined) {
    // 存储所有的雪花
    var snows = [];

    // 下落的加速度
    var G = 0.01;

    var fps = 60;

    // 速度上限，避免速度过快
    var SPEED_LIMIT_X = 1;
    var SPEED_LIMIT_Y = 1;

    var W = window.innerWidth;
    var H = window.innerHeight;

    var tickCount = 150;
    var ticker = 0;
    var lastTime = Date.now();
    var deltaTime = 0;

    var canvas = null;
    var ctx = null;

    var snowImage = null;

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 1000 / fps);
            }
    })();

    init();

    function init() {
        createCanvas();
        canvas.width = W;
        canvas.height = H;
        canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none;z-index:1001';
        document.body.appendChild(canvas);
        // 小屏幕时延长添加雪花时间，避免屏幕上出现太多的雪花
        if (W < 768) {
            tickCount = 350;
        }

        snowImage = new Image();
        snowImage.src = './snow.png';

        loop();
    }

    function loop() {
        requestAnimationFrame(loop);

        ctx.clearRect(0, 0, W, H);

        var now = Date.now();
        deltaTime = now - lastTime;
        lastTime = now;
        ticker += deltaTime;

        if (ticker > tickCount) {
            snows.push(
                new Snow(Math.random() * W, 0, Math.random() * 4 + 4)
            );
            ticker %= tickCount;
        }

        var length = snows.length;
        snows.map(function (s, i) {
            s.update();
            s.draw();
            if (s.y >= H) {
                snows.splice(i, 1);
            }
        });
    }

    function Snow(x, y, radius) {
        this.x = x;
        this.y = y;
        this.sx = 0;
        this.sy = 0;
        this.deg = 0;
        this.radius = radius;
        this.ax = Math.random() < 0.5 ? 0.005 : -0.005;
    }

    Snow.prototype.update = function () {
        var deltaDeg = Math.random() * 0.6 + 0.2;

        this.sx += this.ax;
        if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
            this.ax *= -1;
        }

        if (this.sy < SPEED_LIMIT_Y) {
            this.sy += G;
        }

        this.deg += deltaDeg;
        this.x += this.sx;
        this.y += this.sy;
    };

    Snow.prototype.draw = function () {
        var radius = this.radius;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.deg * Math.PI / 180 / 1.1);
        ctx.drawImage(snowImage, -radius, -radius, radius * 2, radius * 2);
        ctx.restore();
    };

    function createCanvas() {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
    }

})(window, document);