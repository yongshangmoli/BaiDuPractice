/**
 * 用于存储小方块对象，考虑到全局要用，所以使用一个全局变量存储
 * @type {null}
 */
var square = null;
/**
 * 一些基础功能
 * @type {{craetTable, $, addEvent}}
 */
var func = (function () {
    return {
        /**
         * 接收参数，创建表格
         * @param tbody
         * @param row
         * @param col
         */
        craetTable: function (tbody, row, col) {
            var bg_tr = [];
            for(var i = 0; i < row; i++) {
                bg_tr[i] = document.createElement("tr");	// 创建11行tr
                tbody.appendChild(bg_tr[i]);
                var bg_td = [];
                for(var j = 0; j < col; j++) {
                    bg_td[j] = document.createElement("td");	// 创建11列td
                    if(i === 0 && j > 0) {
                        bg_td[j].innerHTML = j;	// 标注列数
                    }
                    if(i > 0 && j === 0) {
                        bg_td[j].innerHTML = i;	// 标注行数
                    }
                    bg_tr[i].appendChild(bg_td[j]);
                }
            }
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
        addEvent: function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        }
    }
})();
/**
 * 生成表格
 * @type {*|Element|HTMLElement}
 */
var bg = func.$("background");
func.craetTable(bg, 11, 11);
/**
 * 小方块构造器
 * @param x
 * @param y
 * @param deg
 * @constructor
 */
function Square(x, y, f) {
    this.x = x;
    this.y = y;
    this.f = f;
    this.block = this.getBlock(this.x, this.y);
}
/**
 * 获取当前方块所在单元格
 * @param x
 * @param y
 * @returns {Element}
 */
Square.prototype.getBlock = function (x, y) {
    return bg.rows[x].cells[y];
};
/**
 * 翻译器，上右下左分别对应0123
 * @type {string[]}
 */
Square.prototype.change = ["Top", "Right", "Bottom", "Left"];
/**
 * 重置功能
 */
Square.prototype.reset = function () {
    this.block.className = "";
    this.block.innerHTML = "";
};
/**
 * 设置方向
 * @param block
 * @param D
 */
Square.prototype.setDirection = function (block, D) {
    block.className = D;
};
/**
 * 设置div
 * @param block
 */
Square.prototype.setDiv = function (block) {
    block.innerHTML="<div></div>";
};
/**
 * 往前走
 */
Square.prototype.go = function () {
    switch (this.block.className) {
        case "Top":
            if(this.x > 1){
                this.x--;
                var newBlock = this.getBlock(this.x, this.y);
                this.setDiv(newBlock);
                this.setDirection(newBlock, this.change[this.f]);
                this.reset();
                this.block = newBlock;
            }
            break;
        case "Left":
            if(this.y > 1){
                this.y--;
                var newBlock = this.getBlock(this.x, this.y);
                this.setDiv(newBlock);
                this.setDirection(newBlock, this.change[this.f]);
                this.reset();
                this.block = newBlock;
            }
            break;
        case "Bottom":
            if(this.x < 10){
                this.x++;
                var newBlock = this.getBlock(this.x, this.y);
                this.setDiv(newBlock);
                this.setDirection(newBlock, this.change[this.f]);
                this.reset();
                this.block = newBlock;
            }
            break;
        case "Right":
            if(this.y < 10){
                this.y++;
                var newBlock = this.getBlock(this.x, this.y);
                this.setDiv(newBlock);
                this.setDirection(newBlock, this.change[this.f]);
                this.reset();
                this.block = newBlock;
            }
            break;
    }
};
/**
 * 改变方向
 * @param para
 */
Square.prototype.changeDirection = function (para) {
    var result = this.f + para;
    if (result === 4) {
        this.f = 0;
    } else if (result === -1) {
        this.f = 3;
    } else if (result === 5) {
        this.f = 1;
    } else {
        this.f = result;
    }
    this.block.className = this.change[this.f];
};
/**
 * 根据用户输入起始位置创建小方块
 * @type {*|Element|HTMLElement}
 */
var btn = func.$("collect");
var startX = func.$("startX");
var startY = func.$("startY");
var startFace = func.$("startFace");
func.addEvent(btn, "click", createSquare);
function createSquare() {
    /**
     * 如果用户多次按生成按钮，将清楚原来的小方块实例对象
     */
    if (square) {
        square.reset();
        square = null;
    }
    var x = parseInt(startX.value);
    var y = parseInt(startY.value);
    var f = parseInt(startFace.value);
    if (x >= 1 && x <= 11 && y >= 1 && y <= 11 && f >= 0 && f <= 3) {
        square = new Square(x, y, f);
        var div = document.createElement("div");
        var cellTd = square.getBlock(square.x, square.y);
        cellTd.className = square.change[square.f];
        cellTd.appendChild(div);
    } else {
        alert("Please input legal number!");
    }
}
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
            square.changeDirection(-1);
            break;
        case "TUN RIG":
            square.changeDirection(1);
            break;
        case "TUN BAC":
            square.changeDirection(2);
            break;
    }
}




