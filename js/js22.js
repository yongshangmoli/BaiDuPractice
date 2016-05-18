//封装一个id选择器
function $(id) {
    return document.getElementById(id);
}
//事件绑定函数
function addEvent(target,type,handler) {
    if(target.addEventListener) {
        target.addEventListener(type, handler);
    }
    else if(target.attachEvent) {
       target.attachEvent('on'+type,function() {
            return handler.call(target,window.event);
       });
    }
    else {
        target['on'+type] = function() {
            return handler.call(target);
        }
    }
}

var ele = {
    directive : '',//向方块发送的指令
    excute : $("excute"),//按键区域
    box : $("box"),//小方块
    direction : "top",//方块头部的方向
    rotateDeg : 0,//用于标识向哪个方向
    boxHeadDir : 0//小方块应该向哪个方向前进,0,1,2,3对应于上，右，下，左
};

//小方块，封装了对它的操作方法
function Box() {}

Box.prototype = {
    constructor : Box,
    //设定小方块的初始位置
    init : function() {
        ele.box.style.left = "245px";
        ele.box.style.top = "245px";
    },
    //发送go指令后向小方块发送移动指令
    move : function(direction) {
        switch (direction) {
            case 0:
                if(this.getTopBoxPositionNum() <= 41) {
                   alert('不能再往上啦');
                }
                else {
                    this.setBoxTopPosition(-41);
                }
                break;
            case 2:
                if(this.getTopBoxPositionNum() >= 370) {
                   alert('不能再往下啦');
                }
                else {
                    this.setBoxTopPosition(41);
                }
                break;
            case 3:
                if(this.getLeftBoxPositionNum() <= 41) {
                   alert('不能再往左啦');
                }
                else {
                    this.setBoxLeftPosition(-41);
                }
                break;
            case 1:
                if(this.getLeftBoxPositionNum() >= 370) {
                   alert('不能再往右啦');
                }
                else {
                    this.setBoxLeftPosition(41);
                }
                break;
            default:
                break;
        }
    },
    //区别不同的指令，除go以外的其他函数都只是旋转方块
    excuteAction : function(directive) {
        switch (directive) {
            case "go":
                this.move(ele.boxHeadDir);
                break;
            case "lef":
                ele.rotateDeg -= 90;
                ele.boxHeadDir -= 1;
                this.boxHeadDirCtrl(ele.boxHeadDir);
                this.setBoxDeg(ele.box);
                break;
            case "rig":
                ele.rotateDeg += 90;
                ele.boxHeadDir += 1;
                this.boxHeadDirCtrl(ele.boxHeadDir);
                this.setBoxDeg(ele.box);
                break;
            case "bac":
                ele.boxHeadDir += 2;
                ele.rotateDeg += 180;
                this.boxHeadDirCtrl(ele.boxHeadDir);
                this.setBoxDeg(ele.box);
                break;
            case "tlef":
                ele.boxHeadDir = 3;
                this.move(ele.boxHeadDir);
                break;
            case "ttop":
                ele.boxHeadDir = 0;
                this.move(ele.boxHeadDir);
                break;
            case "trig":
                ele.boxHeadDir = 1;
                this.move(ele.boxHeadDir);
                break;
            case "tbot":
                ele.boxHeadDir = 2;
                this.move(ele.boxHeadDir);
                break;
            case "mlef":
                if(ele.direction != 'left') {
                     ele.rotateDeg = 270;
                     ele.direction = "left";
                     ele.boxHeadDir = 3;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            case "mtop":
                if(ele.direction != 'top') {
                     ele.rotateDeg = 0;
                     ele.direction = "top";
                     ele.boxHeadDir = 0;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            case "mrig":
                if(ele.direction != 'right') {
                     ele.rotateDeg = 90;
                     ele.direction = "right";
                     ele.boxHeadDir = 1;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            case "mbot":
                if(ele.direction != 'bottom') {
                     ele.rotateDeg = 180;
                     ele.direction = "bottom";
                     ele.boxHeadDir = 2;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            default:
                break;
        }
        /*console.log("deg: "+ele.rotateDeg);
        console.log("dir: "+ele.direction);
        console.log("boxhead: "+ele.boxHeadDir);*/
    },
    //获取小方块当前距离上边/左边的距离
    getLeftBoxPositionNum : function() {
        return parseInt(ele.box.style.left.slice(0,-2));
    },
    getTopBoxPositionNum : function() {
        return parseInt(ele.box.style.top.slice(0,-2));
    },
    //设置小方块当前距离上边/左边的距离
    setBoxLeftPosition : function(fwdLeft) {
        ele.box.style.left = (this.getLeftBoxPositionNum()+fwdLeft)+"px";
    },
    setBoxTopPosition : function(fwdTop) {
        ele.box.style.top = (this.getTopBoxPositionNum()+fwdTop)+"px";

    },
    //让小方块旋转的函数
    setBoxDeg : function(box) {
        box.style.transform.rotate = ele.rotateDeg+'deg';
        box.style.webkitTransform = "rotate(" + ele.rotateDeg + "deg)";
        box.style.mozTransform = "rotate(" + ele.rotateDeg + "deg)";
        box.style.msTransform = "rotate(" + ele.rotateDeg + "deg)";
        box.style.oTransform = "rotate(" + ele.rotateDeg + "deg)";
        box.style.transform = "rotate(" + ele.rotateDeg + "deg)";
    },
    //控制小方块的头部的方向
    boxHeadDirCtrl : function(dirct) {
        if(dirct < 0) {
            ele.boxHeadDir = dirct+4;
        }
        else if (dirct > 3) {
            ele.boxHeadDir = dirct-4;
        }
        switch (ele.boxHeadDir) {
            case 0:
                ele.direction = 'top';
                break;
            case 1:
                ele.direction = 'right';
                break;
            case 2:
                ele.direction = 'bottom';
                break;
            case 3:
                ele.direction = 'left';
                break;
            default:
                break;
        }
    }
};

var box = new Box();
box.init();

//为指令区域绑定点击监听事件
addEvent(ele.excute,'click',function(e) {
    var tagt = e.target;
    if(tagt.type === 'submit') {
       box.excuteAction(tagt.id);
    }
});