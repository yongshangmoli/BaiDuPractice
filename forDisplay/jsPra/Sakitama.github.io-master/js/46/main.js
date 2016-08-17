var main = (function () {
    var wrapper, canvas, ctx, // 变量--html结构
        canWidth, canHeight, // 变量--画布宽高，地图单元格大小
        deltaTime, lateTime, loop, // 变量--两次绘制的时间差，动画名
        block, // 变量--blockObj类的对象实例
        hero, // 变量--heroObj类的对象实例
        target, // 变量--targetObj类的对象实例
        map = [], // 变量--二维数组记录虚拟地图
        Level = 1, // 变量--设定关卡难度
        canRow,
        canCol,
        cellWidth,
        cellHeight;
    
    wrapper = document.getElementById('wrapper'); // 各变量初始化
    canWidth = wrapper.clientWidth;
    canHeight = wrapper.clientHeight;
    canvas = document.createElement('canvas');
    canvas.width = canWidth;
    canvas.height = canHeight;
    wrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    canRow = 30;
    canCol = 25;
    cellWidth = canWidth / canCol;
    cellHeight = canHeight / canRow;

    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    var init = function () {
        block = new blockObj();
        hero = new heroObj();
        target = new targetObj();
        addEvent(canvas, 'click', function (event) {
            event = event || window.event;
            var bbox = canvas.getBoundingClientRect(),
                coordinates = {
                    x: event.clientX - bbox.left * (canvas.width / bbox.width),
                    y: event.clientY - bbox.top * (canvas.height / bbox.height)
                },
                cell = {
                    row: Math.floor(coordinates.y / cellHeight),
                    col: Math.floor(coordinates.x / cellWidth)
                },
                path,
                timer;
            path = findway(map, map[hero.coordinates.row][hero.coordinates.col], map[cell.row][cell.col]);
            if (path) {
                var i = 0;
                timer = setInterval(function(){
                    hero.move(path[i].row, path[i].col);
                    if (path[i].row == target.coordinates.row && path[i].col == target.coordinates.col) {
                        path = [];
                        reset();
                        clearInterval(timer);
                    }
                    i++;
                    if(i >= path.length){
                        path = [];
                        clearInterval(timer);
                    }
                }, deltaTime);
            }
        });
        initObj();
    };

    var initObj = function () {
        lateTime = Date.now();
        deltaTime = 0;
        block.buildMap();
        hero.init();
        target.init();
    };

    var addEvent = function (elem, type, handler) {
        if (window.addEventListener) {
            addEvent = function (elem, type, handler) {
                elem.addEventListener(type, handler, false);
            };
        } else if (window.attachEvent) {
            addEvent = function (elem, type, handler) {
                elem.attachEvent('on' + type, handler);
            };
        } else {
            addEvent = function (elem, type, handler) {
                elem['on' + type] = handler;
            };
        }
        addEvent(elem, type, handler);
    };

    var gameLoop = function () { // 画布循环绘制函数
        deltaTime = Date.now() - lateTime;
        lateTime = Date.now();
        ctx.clearRect(0, 0, canWidth, canHeight);
        block.draw();
        hero.draw();
        target.draw();
        loop = window.requestAnimationFrame(gameLoop);
    };

    var startGame = function () { // 调用函数
        init();
        gameLoop();
    };

    var reset = function () { // 重置函数
        cancelAnimationFrame(loop);
        Level++;
        initObj();
        gameLoop();
    };

    return {
        wrapper: wrapper,
        canvas: canvas,
        ctx: ctx,
        canWidth: canWidth,
        canHeight: canHeight,
        canRow: canRow, 
        canCol: canCol,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        deltaTime: deltaTime,
        lateTime: lateTime,
        loop: loop,
        block: block,
        hero: hero,
        target: target,
        map: map,
        Level: Level,
        init: init,
        gameLoop: gameLoop,
        startGame: startGame,
        reset: reset
    };
})();