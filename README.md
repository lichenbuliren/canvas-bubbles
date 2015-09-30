## Canvas Bubbles 碰撞检测

### 特性

- 小球分左右两半部分，分别进入画布
- 初始位置随机，初始X轴Y轴加速度随机


### API

``` javascript
    var canvasPanel = new BubblesPanel({
        canvasElement: '.my-canvas',
        bubblesCount: 30,
        width: 1240,
        height: 800,
        color: ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900']
    });
```

- `canvasElement` 画布容器选择器
- `bubblesCount` 小球数量
- `width` 画布宽度
- `height` 画布高度
- `color` 小球颜色随机数组，可自定义




### 后续

- 小球如果碰撞到手机图片，需要实现一个吸附效果，看起来像是被手机吸进去的
- 当手机吸取的同一个颜色小球达到一个指定的数量之后，需要切换手机图片为不同底色的图片




















参考文章：[http://www.cnblogs.com/index-html/archive/2011/11/08/2240946.html](http://www.cnblogs.com/index-html/archive/2011/11/08/2240946.html)