function Sprite(x, y, img, width, height) {
    this.x = x;
    this.y = y;
    this.img = document.getElementById(img);
    this.width = width;
    this.height = height;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.angle = 0;
    //角度
    this.scaleX = 1; //水平缩放
    this.scaleY = 1; //竖直缩放
    this.alpha = 1; //透明度
    this.isDrug = false; //是否拖到
}

Sprite.prototype.draw = function() {
    context.save();
    context.translate(this.x + this.halfWidth, this.y + this.halfHeight);
    context.globalAlpha = this.alpha; //修改透明度
    context.rotate(this.angle); //旋转角度
    context.scale(this.scaleX, this.scaleY); //缩放
    context.drawImage(this.img, -this.halfWidth, -this.halfHeight);
    context.restore();
}

Sprite.prototype.hitTest = function(sprite) {
    var minx = this.x > sprite.x ? this.x : sprite.x;
    var maxx = this.x + this.width < sprite.x + sprite.width ? this.x + this.width : sprite.x + sprite.width;
    var miny = this.y > sprite.y ? this.y : sprite.y;
    var maxy = this.y + this.width < sprite.y + sprite.width ? this.y + this.width : sprite.y + sprite.width;

    if (minx >= maxx || miny >= maxy) {
        return false;
    }

    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', 550);
    canvas.setAttribute('height', 400);
    var context = canvas.getContext('2d');


    /*第一种方法*/
    context.drawImage(this.img, this.x, this.y);
    var data1 = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;
    context.clearRect(0, 0, 550, 400);
    context.drawImage(sprite.img, sprite.x, sprite.y);
    var data2 = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;

    for (var i = 3; i < data1.length; i += 4) {
        if (data1[i] > 0 && data2[i] > 0) return true;
    }
    return false;

    /*第二种方法
    context.drawImage(this.img, this.x, this.y);
    context.globalCompositeOperation = 'xor';
    context.drawImage(sprite.img, sprite.x, sprite.y);
    var data = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;
    context.globalCompositeOperation = 'source-over';

    for(var i = 3; i < data.length; i += 4)
    {

            if(data[i] == 0 ) return true;
    }
    return false;*/
}