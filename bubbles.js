(function(W, D) {

    var canavs,
        context,
        RADIUS = 30, //气泡半径
        bubblesArr = [],
        colorArr = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900'],
        count = 0,
        phoneImage;

    var de = D.documentElement;

    //
    // 常量
    //
    var K = 0.999;

    var POW_RATE = 0.001; //补偿概率
    var POW_RANGE = 0.8; //补偿范围(基于诞生速度)

    function SPEED_X() {
        return 2 + RND() * 4
    }

    function SPEED_Y() {
        return 1 + RND() * 2
    }

    var SQRT = Math.sqrt;
    var ATAN2 = Math.atan2;
    var SIN = Math.sin;
    var COS = Math.cos;
    var ABS = Math.abs;
    var RND = Math.random;
    var ROUND = Math.round;
    var iRight, iBottom;



    function BubblesPanel(options) {
        this.options = {
            canvasElement: '.bubblesCanvas',
            bubblesCount: 10,
            width: D.documentElement.clientWidth,
            height: D.documentElement.clientHeight
        }

        this.init(options);
    };

    BubblesPanel.prototype = {
        _extend: function(options) {
            if (options) {
                for (var key in options) {
                    this.options[key] = options[key];
                }
            }
        },

        init: function(options) {
            this._extend(options);

            // 初始化面板
            canvas = D.querySelector(options.canvasElement);
            context = canvas && canvas.getContext('2d');
            canvas.width = options.width;
            canvas.height = options.height;
            iRight = canvas.width - RADIUS;
            iBottom = canvas.height - RADIUS;

            //初始化小球数组
            this.initBubbles();
            this.render();
            var that = this;
            var animate = function() {
                that.render();
                that.update();
                requestAnimationFrame(animate, 80);
            }

            animate();
        },

        initBubbles: function() {
            // 计算小球数量
            // 动态添加
            for (var i = 0; i < this.options.bubblesCount; i++) {
                var x, y, vx, vy;
                y = RND() * (canvas.height - 2 * RADIUS);

                if (i % 2 == 0) {
                    x = canvas.width + RADIUS * i;
                    vx = -SPEED_X();
                    vy = -SPEED_Y();
                } else {
                    x = -2 * RADIUS * i;
                    vx = SPEED_X();
                    vy = SPEED_Y();
                }
                var bubble = {
                    x: x,
                    y: y,
                    vx: vx,
                    vy: vy,
                    r: RADIUS,
                    color: colorArr[Math.floor(RND() * 6)]
                }
                bubblesArr.push(bubble);
            }
        },

        render: function() {
            context.clearRect(0, 0, this.options.width, this.options.height);

            // 重绘手机图
            drawImage(context, 'p8.png', 600, 200);


            // 绘制小球
            this.drawBubbles();
        },
        drawBubbles: function() {
            var bubbles = bubblesArr,
                len = bubbles.length;
            for (var i = 0; i < len; i++) {
                var curBubble = bubbles[i];
                context.fillStyle = curBubble.color;
                context.beginPath();
                context.arc(curBubble.x, curBubble.y, RADIUS, 0, 2 * Math.PI, true);
                context.closePath();
                context.fill();
            }

        },
        update: function() {
            var bubbles = bubblesArr,
                len = bubbles.length;
            var bub, bub2;
            var i, j;

            for (i = 0; i < len; i++) {
                bub = bubbles[i];
                bub.vx *= K;
                bub.vy *= K;

                if (RND() < POW_RATE) {
                    bub.vx = SPEED_X() * (1 + RND() * POW_RANGE);
                    bub.vy = SPEED_Y() * (1 + RND() * POW_RANGE);
                }
                bub.x = bub.x + bub.vx;
                bub.y = bub.y + bub.vy;
                checkWalls(bub);
            }

            for (i = 0; i < len - 1; i++) {
                bub = bubblesArr[i];

                for (j = i + 1; j < len; j++) {
                    bub2 = bubblesArr[j];
                    checkCollision(bub, bub2);
                }
            }
        }
    }

    function checkWalls(bub) {
        if (bub.x < RADIUS && bub.vx < 0) {
            bub.x = RADIUS;
            bub.vx *= -1;
        } else if (bub.x > iRight && bub.vx > 0) {
            bub.x = iRight;
            bub.vx *= -1;
        }

        if (bub.y < RADIUS) {
            bub.y = RADIUS;
            bub.vy *= -1;
        } else if (bub.y > iBottom) {
            bub.y = iBottom;
            bub.vy *= -1;
        }
    }



    /**
     * 绘制图片
     * @param  {[type]} ctx  [description]
     * @param  {[type]} path 图片地址
     * @param  {[type]} x    [description]
     * @param  {[type]} y    [description]
     * @return {[type]}      [description]
     */
    function drawImage(ctx, path, x, y) {
        var img = createImage(path);
        img.addEventListener('load', function() {
            ctx.drawImage(img, x, y);
        }, false);
        ctx.drawImage(img, x, y);
    }

    function createImage(path) {
        if (!phoneImage) {
            phoneImage = new Image();
            phoneImage.src = path;
        }
        return phoneImage;
    }


    function checkCollision(bub0, bub1) {
        var dx = bub1.x - bub0.x;
        var dy = bub1.y - bub0.y;
        var dist = SQRT(dx * dx + dy * dy);

        if (dist < RADIUS * 2) {
            // 计算角度和正余弦值
            var angle = ATAN2(dy, dx);
            var sin = SIN(angle);
            var cos = COS(angle);

            // 旋转 bub0 的位置
            var pos0 = {
                x: 0,
                y: 0
            };

            // 旋转 bub1 的速度
            var pos1 = rotate(dx, dy, sin, cos, true);

            // 旋转 bub0 的速度
            var vel0 = rotate(bub0.vx, bub0.vy, sin, cos, true);

            // 旋转 bub1 的速度
            var vel1 = rotate(bub1.vx, bub1.vy, sin, cos, true);

            // 碰撞的作用力
            var vxTotal = vel0.x - vel1.x;
            vel0.x = vel1.x;
            vel1.x = vxTotal + vel0.x;

            // 更新位置
            var absV = ABS(vel0.x) + ABS(vel1.x);
            var overlap = RADIUS * 2 - ABS(pos0.x - pos1.x);

            pos0.x += vel0.x / absV * overlap;
            pos1.x += vel1.x / absV * overlap;

            // 将位置旋转回来
            var pos0F = rotate(pos0.x, pos0.y, sin, cos, false);
            var pos1F = rotate(pos1.x, pos1.y, sin, cos, false);

            // 将位置调整为屏幕的实际位置
            bub1.x = bub0.x + pos1F.x;
            bub1.y = bub0.y + pos1F.y;
            bub0.x = bub0.x + pos0F.x;
            bub0.y = bub0.y + pos0F.y;

            // 将速度旋转回来
            var vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
            var vel1F = rotate(vel1.x, vel1.y, sin, cos, false);

            bub0.vx = vel0F.x;
            bub0.vy = vel0F.y;
            bub1.vx = vel1F.x;
            bub1.vy = vel1F.y;
        }
    }

    function rotate(x, y, sin, cos, reverse) {
        if (reverse)
            return {
                x: x * cos + y * sin,
                y: y * cos - x * sin
            };
        else
            return {
                x: x * cos - y * sin,
                y: y * cos + x * sin
            };
    }


    W.BubblesPanel = BubblesPanel;
})(window, document);