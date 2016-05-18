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
    direction : "top",//小方块应该向哪个方向前进
    rotateDeg : 0//用于标识向哪个方向
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
            case "top":
                if(this.getTopBoxPositionNum() <= 41) {
                   alert('不能再往上啦');
                }
                else {
                    this.setBoxTopPosition(-41);
                }
                break;
            case "bottom":
                if(this.getTopBoxPositionNum() >= 370) {
                   alert('不能再往下啦');
                }
                else {
                    this.setBoxTopPosition(41);
                }
                break;
            case "left":
                if(this.getLeftBoxPositionNum() <= 41) {
                   alert('不能再往左啦');
                }
                else {
                    this.setBoxLeftPosition(-41);
                }
                break;
            case "right":
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
                this.move(ele.direction);
                break;
            case "lef":
                this.degIsOverBorder(ele.rotateDeg);
                ele.rotateDeg -= 90;
                this.setBoxDirection(ele.rotateDeg);
                this.setBoxDeg(ele.box);
                break;
            case "rig":
                ele.rotateDeg += 90;
                this.degIsOverBorder(ele.rotateDeg);
                this.setBoxDirection(ele.rotateDeg);
                this.setBoxDeg(ele.box);
                break;
            case "bac":
                ele.rotateDeg += 180;
                this.degIsOverBorder(ele.rotateDeg);
                this.setBoxDirection(ele.rotateDeg);
                this.setBoxDeg(ele.box);
                break;
            default:
                break;
        }
      /*  console.log("deg"+ele.rotateDeg);
        console.log("dir"+ele.direction);*/
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
    //设置项方块头部当前的方向
    setBoxDirection : function(deg) {
        var dirct = deg/90;
        switch (dirct) {
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
    },
    //判断小方块是否已经到达设定区域的边界
    degIsOverBorder : function(deg) {
        if(deg <= 0) {
            ele.rotateDeg = 360;
        }
        else if(deg >= 360 ) {
            ele.rotateDeg = 0;
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