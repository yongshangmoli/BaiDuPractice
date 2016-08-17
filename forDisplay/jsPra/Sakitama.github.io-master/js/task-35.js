/**
 * 用于存储小方块对象，考虑到全局要用，所以使用一个全局变量存储
 * @type {null}
 */
var square = null;
/**
 * 定义常量
 */
var WIDTH = 42;//小方块的宽
var HEIGHT = 42;//小方块的高
var ROW = 18;//地图行数
var COL = 18;//地图列数
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
         * 生成索引
         * @param topList
         * @param leftList
         * @param config
         */
        createList: function (topList, leftList, config) {
            var str = "";
            for (var i = 0; i < config.x; i++) {
                str += "<li>" + i + "</li>";
            }
            leftList.innerHTML = str;
            str = "";
            for (i = 0; i < config.y; i++) {
                str += "<li>" + i + "</li>";
            }
            topList.innerHTML = str;
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
        },
        /**
         * 对代码编号框进行渲染
         * @param inputArea
         * @param index
         */
        renderCmd: function (inputArea, index, isCheck) {//isCheck为false表示不检查，true表示进行检查
            var error = false;//每次渲染都新建这个变量，代表所有输入的指令是否合法，false表示所有指令都合法，反之表示有不合法的指令存在
            var arrData = inputArea.value.split("\n");//用换行符分割
            var str = "";
            for (var i = 0; i < arrData.length; i++) {
                if (isCheck && func.checkCmd(arrData[i])) {
                    str += "<li class='error'>" + (i + 1) + "</li>";
                    error = true;//如果有不合法的指令则变为true
                } else {
                    str += "<li>" + (i + 1) + "</li>";
                }
            }
            index.innerHTML = str;
            /**
             * 返回一个对象，包含代表所有指令是否合法的布尔值和分割好的初始指令序列
             */
            return {
                haveError: error,
                commandArray: arrData
            };
        },
        /**
         * 对每条指令进行检查，允许的指令格式为
         * GO，GO n
         * TUN LEF，TUN RIG，TUN BAC
         * TRA LEF n，TRA RIG n，TRA TOP n，TRA BOT n，TRA LEF，TRA RIG，TRA TOP，TRA BOT
         * MOV LEF n，MOV RIG n，MOV TOP n，MOV BOT n，MOV LEF，MOV RIG，MOV TOP，MOV BOT
         * @param data
         * @returns {boolean}
         */
        checkCmd: function (data) {
            var regGO = /^GO(\s\d+)?$/;
            var regTUN = /^TUN\s(LEF|BAC|RIG)$/; //检测TUN指令
            var regTRAMOV = /^(TRA|MOV)\s(LEF|RIG|TOP|BOT)(\s\d+)?$/; //检测TRA指令跟MOV指令
            return !regGO.test(data) && !regTUN.test(data) && !regTRAMOV.test(data);//返回检测结果
        }
    }
})();
/**
 * 生成地图和小方块对象
 * @type {*|Element|HTMLElement}
 */
var container = func.$("container");
square = func.createMap(container, {
    x: ROW,
    y: COL
});
/**
 * 生成顶部和左边的索引
 */
var topList = func.$("list_top");
var leftList = func.$("list_left");
func.createList(topList, leftList, {
    x: ROW,
    y: COL
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
        this.y < COL - 1 && this.y++;
    } else if (this.direction === 2) {//往下走
        this.x < ROW - 1 && this.x++;
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
        this.y < COL - 1 && this.y++;
    } else if (value === "bottom") {//往下平移一格
        this.x < ROW - 1 && this.x++;
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
 * 分析、运行指令
 * @param value
 */
Square.prototype.analyseCommand = function (value) {
    switch (value) {
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
};
/**
 * 输入命令并运行
 * @type {*|Element|HTMLElement}
 */
var command = func.$("command");//获取输入区域
var sure = func.$("sure");//获取执行按钮
var index = func.$("index");//获取左侧代码编号框
func.addEvent(sure, "click", startMove);
/**
 * 点击执行按钮运行的事件处理函数
 */
function startMove() {
    var result = func.renderCmd(command, index, true);//再次渲染代码编号框并进行检查
    var i = 0;
    if (!result.haveError) {//如果所有指令都输入正确
        runCommand(getCommandNumber(result.commandArray));//开始执行指令
    }
}
/**
 * 接收分割好的初始指令序列作为参数
 * 解析初始指令序列，分离出指令和执行次数，比如GO 4，那么返回的数组中这样出现：GO, GO, GO, GO
 * @param originCommandArray
 */
function getCommandNumber(originCommandArray) {
    var newCommandArray = [];
    for (var i in originCommandArray) {
        if (/\d/.test(originCommandArray[i])) {//如果数据包含数字
            var lastSpace = originCommandArray[i].lastIndexOf(" ");//找最后出现的空格
            for (var j = 0; j < parseInt(originCommandArray[i].substring(lastSpace + 1, originCommandArray[i].length)); j++) {
                newCommandArray.push(originCommandArray[i].substring(0, lastSpace));
            }
        } else {
            newCommandArray.push(originCommandArray[i]);
        }
    }
    return newCommandArray;
}
/**
 * 接收来自getCommandNumber返回的处理好的单指令序列
 * 延时递归调用runCommand，每一秒执行一条指令
 * @param commandArray
 */
function runCommand(commandArray) {
    var command = commandArray.shift();//从队首弹出一个指令并执行
    if (command) {//指令存在的话才执行
        square.analyseCommand(command);
        setTimeout(function () {
            runCommand(commandArray);
        }, 1000);
    }
}
/**
 * 给输入区域添加输入事件，每次输入都动态刷新代码行编号框
 */
func.addEvent(command, "input", renderConsole);
func.addEvent(command, "propertychange", renderConsole);//兼容IE8及以下
function renderConsole() {
    func.renderCmd(command, index, false);
}
/**
 * 给输入区域添加滚动事件，让左侧的代码编号框也一起滚动
 */
func.addEvent(command, "scroll", checkScroll);
function checkScroll() {
    index.scrollTop = command.scrollTop;
}
/**
 * 清空命令输入框
 */
var refresh = func.$("refresh");
func.addEvent(refresh, "click", clear);
function clear() {
    command.value = "";
    index.innerHTML = "<li>1</li>";
}