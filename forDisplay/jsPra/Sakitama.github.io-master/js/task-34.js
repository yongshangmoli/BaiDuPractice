/**
 * 用于存储小方块对象，考虑到全局要用，所以使用一个全局变量存储
 * @type {null}
 */
var square = null;
/**
 * 定义常量
 */
var WIDTH = 42;
var HEIGHT = 42;
/**
 * 一些基础功能
 * @type {{craetTable, $, addEvent}}
 */
var func = (function () {
    /**
     * 返回模块
     */
    return {
        /**
         * 接收参数，创建地图
         * @param tbody
         * @param row
         * @param col
         */
        createMap: function (container, config) {
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < config.x; i++) {
                for (var j = 0; j < config.y; j++) {
                    fragment.appendChild(func.createDiv({
                        x: config.x,
                        y: config.y,
                        i: i,
                        j: j
                    }));
                }
            }
            container.style.width = config.y * WIDTH + config.y - 1 + "px";
            container.appendChild(fragment);
            return func.mkAction(container, config);
        },
        createDiv: function (obj) {
            var oDiv = document.createElement("div");
            oDiv.className = "maze-block";
            /**
             * 如果是最后一行的单元格，没有下边框
             */
            if (obj.i === obj.x - 1) {
                oDiv.className += " bottom-maze-block";
            }
            /**
             * 如果是最后一列的单元格，没有右边框
             */
            if (obj.j === obj.y - 1) {
                oDiv.className += " right-maze-block";
            }
            return oDiv;
        },
        mkAction: function (container, obj) {
            var ox = Math.floor(Math.random() * obj.x + 0);
            var oy = Math.floor(Math.random() * obj.y + 0);
            var action = func.createAction(ox, oy);
            container.appendChild(action);
            return new Square(ox, oy, 0, 0, action);
        },
        createAction: function (ox, oy) {
            var oAction = document.createElement('div');
            oAction.className = "Action";
            oAction.style.position = "absolute";
            oAction.style.left = oy * (WIDTH + 1) + 'px';
            oAction.style.top = ox * (HEIGHT + 1) + 'px';
            return oAction;
        },
        /**
         * 获取元素
         * @param id
         * @returns {Element|HTMLElement}
         */
        $: function (id) {
            return document.getElementById(id);
        },
        /**
         * 添加事件
         * @param element
         * @param event
         * @param listener
         */
        addEvent: function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        }
    }
})();
/**
 * 生成地图和小方块对象
 * @type {*|Element|HTMLElement}
 */
var container = func.$("container");
square = func.createMap(container, {
    x: 10,
    y: 10
});
/**
 * 小方块构造器
 * @param x：行号
 * @param y：列号
 * @param deg：旋转角度
 * @param direction：方向，0：上，1：右，2：下，3：左
 * @param domSquare：DOM中的小方块
 * @constructor
 */
function Square(x, y, deg, direction, domSquare) {
    this.x = x;
    this.y = y;
    this.deg = deg;
    this.direction = direction;
    this.domSquare = domSquare;
}
/**
 * 前进
 */
Square.prototype.go = function () {
    if (this.direction === 0) {//往上走
        this.x > 0 && this.x--;
    } else if (this.direction === 1) {//往右走
        this.y < 9 && this.y++;
    } else if (this.direction === 2) {//往下走
        this.x < 9 && this.x++;
    } else if (this.direction === 3) {//往左走
        this.y > 0 && this.y--;
    }
    this.domSquare.style.left = this.y * (WIDTH + 1) + "px";
    this.domSquare.style.top = this.x * (HEIGHT + 1) + "px";
};
/**
 * 左右和反向旋转，反向旋转默认是顺时针方向
 * @param value
 */
Square.prototype.changeDirection = function (value) {
    if (value === "right") {
        if (this.direction === 3) {
            this.direction = 0;
        } else  {
            this.direction++;
        }
        this.deg += 90;
        this.domSquare.style.transform = "rotate(" + this.deg + "deg)";
    } else if (value === "left") {
        if (this.direction === 0) {
            this.direction = 3;
        } else {
            this.direction--;
        }
        this.deg -= 90;
        this.domSquare.style.transform = "rotate(-" + this.deg + "deg)";
    } else if (value === "back") {
        if (this.direction === 3) {
            this.direction = 1;
        } else if (this.direction === 2) {
            this.direction = 0;
        } else {
            this.direction += 2;
        }
        this.deg += 180;
    }
    this.domSquare.style.transform = "rotate(" + this.deg + "deg)";
};
/**
 * 平移
 * @param value
 */
Square.prototype.translationSquare = function (value) {
    if (value === "left") {//往左平移一格
        this.y > 0 && this.y--;
    } else if (value === "right") {//往右平移一格
        this.y < 9 && this.y++;
    } else if (value === "bottom") {//往下平移一格
        this.x < 9 && this.x++;
    } else if (value === "top") {//往上平移一格
        this.x > 0 && this.x--;
    }
    this.domSquare.style.left = this.y * (WIDTH + 1) + "px";
    this.domSquare.style.top = this.x * (HEIGHT + 1) + "px";
};
/**
 * 旋转之后前进
 * @param value
 */
Square.prototype.moveAndRotate = function (value) {
    if (value === "left") {//如果要朝向左边
        if (this.direction === 0) {//如果当前方向是朝上
            this.changeDirection("left");//往左旋转
        } else if (this.direction === 1) {//如果当前方向是朝右
            this.changeDirection("back");//反向旋转
        } else if (this.direction === 2) {//如果当前方向是朝下
            this.changeDirection("right");//往右旋转
        }
    } else if (value === "right") {//如果要朝向右边
        if (this.direction === 0) {//如果当前方向是朝上
            this.changeDirection("right");//往右旋转
        } else if (this.direction === 2) {//如果当前方向是朝下
            this.changeDirection("left");//往左旋转
        } else if (this.direction === 3) {//如果当前方向是朝左
            this.changeDirection("back");//反向旋转
        }
    } else if (value === "bottom") {//如果要朝向下边
        if (this.direction === 0) {//如果当前方向是朝上
            this.changeDirection("back");//反向旋转
        } else if (this.direction === 1) {//如果当前方向是朝右
            this.changeDirection("right");//往右旋转
        } else if (this.direction === 3) {//如果当前方向是朝左
            this.changeDirection("left");//往左旋转
        }
    } else if (value === "top") {//如果要朝向上边
        if (this.direction === 1) {//如果当前方向是朝右
            this.changeDirection("left");//往左旋转
        } else if (this.direction === 2) {//如果当前方向是朝下
            this.changeDirection("back");//反向旋转
        } else if (this.direction === 3) {//如果当前方向是朝左
            this.changeDirection("right");//往右旋转
        }
    }
    this.go();//旋转之后前进
};
/**
 * 输入命令并运行
 * @type {*|Element|HTMLElement}
 */
var command = func.$("command");
var sure = func.$("sure");
func.addEvent(sure, "click", startMove);
function startMove() {
    switch (command.value.trim()){
        case "GO":
            square.go();
            break;
        case "TUN LEF":
            square.changeDirection("left");
            break;
        case "TUN RIG":
            square.changeDirection("right");
            break;
        case "TUN BAC":
            square.changeDirection("back");
            break;
        case "TRA LEF":
            square.translationSquare("left");
            break;
        case "TRA TOP":
            square.translationSquare("top");
            break;
        case "TRA RIG":
            square.translationSquare("right");
            break;
        case "TRA BOT":
            square.translationSquare("bottom");
            break;
        case "MOV LEF":
            square.moveAndRotate("left");
            break;
        case "MOV TOP":
            square.moveAndRotate("top");
            break;
        case "MOV RIG":
            square.moveAndRotate("right");
            break;
        case "MOV BOT":
            square.moveAndRotate("bottom");
            break;
    }
}