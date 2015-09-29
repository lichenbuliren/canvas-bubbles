window.onload = function() {
    var CANVAS_WIDTH = 1240,
        CANVAS_HEIGHT = 800,
        RADIUS = 50,
        COUNT = 30,
        iBottom,
        iRight;

    //
    // 常量
    var K = 0.999;
    var POW_RATE = 0.0001; //补偿概率
    var POW_RANGE = 0.8; //补偿范围(基于诞生速度)

    var arrBubs = [],
        ballColorArr = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900'],
        canvas = document.getElementById('phoneCanvas'),
        context = canvas.getContext('2d');

    var SQRT = Math.sqrt;
    var ATAN2 = Math.atan2;
    var SIN = Math.sin;
    var COS = Math.cos;
    var ABS = Math.abs;
    var RND = Math.random;
    var ROUND = Math.round;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;


    function SPEED_X() {
        return 8 + RND() * 4
    }

    function SPEED_Y() {
        return 6 + RND() * 2
    }



    var ballColor = ballColorArr[parseInt(Math.random() * 6)];

    init(ballColor);

    render(context);

    setInterval(function() {
        render(context);
        upate();
    }, 50);

    // 初始化小球数组
    function init(ballColor) {
        for (var i = 0; i < ballCount; i++) {
            var ballObj;
            if (i % 2 == 0) { //左边区域
                ballObj = {
                    x: -RADIUS,
                    y: calRange(RADIUS, CANVAS_HEIGHT - RADIUS),
                    vx: 2,
                    vy: 1,
                    color: ballColor
                }
            } else {
                ballObj = {
                    x: CANVAS_WIDTH + RADIUS,
                    y: calRange(RADIUS, CANVAS_HEIGHT - RADIUS),
                    vx: -2,
                    vy: 1,
                    color: ballColor
                }
            }
            ballArr.push(ballObj);
        }
    }

    // 获取随机数范围
    function calRange(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    }

    /**
     * 绘制矩形
     * @param  {context} cxt        图形上下文
     * @param  {number} x           矩形起点x轴坐标
     * @param  {number} y           矩形起点y轴坐标
     * @param  {number} width       矩形宽度
     * @param  {number} height      矩形高度
     * @param  {number} borderWidth 矩形边框宽度
     * @param  {string} borderColor 边框颜色
     * @param  {string} fillColor   填充色
     * @return {[type]}             [description]
     */
    function drawRect(ctx, x, y, width, height, borderWidth, borderColor, fillColor) {
        ctx.lineWidth = borderWidth;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = borderColor;

        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    /**
     * 重绘画布
     * @param  {[type]} ctx [description]
     * @return {[type]}     [description]
     */
    function render(ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawRect(context, 600, 300, 300, 500, 5, ballColor, ballColor);

        // 绘制小球
        for (var i = 0, len = ballArr.length; i < len; i++) {
            var curBall = ballArr[i];
            ctx.fillStyle = curBall.color;
            ctx.beginPath();
            ctx.arc(curBall.x, curBall.y, RADIUS, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
        }
    }


    /**
     * [update description]
     * @return {[type]} [description]
     */
    function update() {
        for (var i = 0; i < ballArr.length; i++) {
            var curBall = ballArr[i];
            curBall.x += curBall.vx;
        }

        // 性能优化，对于跑出画布的小球，删除它
        var count = 0; //记录存在于画布内的小球数量
        for (var i = 0; i < ballArr.length; i++) {
            if (ballArr[i].x + RADIUS > 0 && ballArr[i].x - RADIUS < CANVAS_WIDTH) {
                ballArr[count++] = ballArr[i];
            }
        }

        // 删除超出的小球，最多保留300个
        while (ballArr.length > Math.min(300, count)) {
            ballArr.pop();
        }
    }
}