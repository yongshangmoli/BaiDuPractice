//小方块，封装了对它的操作方法
function Box() {}
Box.prototype = {
    constructor : Box,
    //设定小方块的初始位置
    init : function() {
        ele.box.style.left = "246px";
        ele.box.style.top = "246px";
    },
    //发送go指令后向小方块发送移动指令
    move : function(direction) {
        var nodePos = this.getBoxCoordinate();
        switch (direction) {
            case 0:
                if(this.getTopBoxPositionNum() <= 41) {
                   alert('不能再往上啦');
                }
                else if(ele.isPosHasNoWall([nodePos[0]-1,nodePos[1]])) {
                    this.setBoxTopPosition(-41);
                }
                else {
                    alert('墙壁堵住了过不去');
                }
                break;
            case 2:
                if(this.getTopBoxPositionNum() >= 370) {
                   alert('不能再往下啦');
                }
                else if(ele.isPosHasNoWall([nodePos[0]+1,nodePos[1]])) {
                    this.setBoxTopPosition(41);
                }
                else {
                    alert('墙壁堵住了过不去');
                }
                break;
            case 3:
                if(this.getLeftBoxPositionNum() <= 41) {
                   alert('不能再往左啦');
                }
                else if(ele.isPosHasNoWall([nodePos[0],nodePos[1]-1])) {
                    this.setBoxLeftPosition(-41);
                }
                else {
                    alert('墙壁堵住了过不去');
                }
                break;
            case 1:
                if(this.getLeftBoxPositionNum() >= 370) {
                   alert('不能再往右啦');
                }
                else if(ele.isPosHasNoWall([nodePos[0],nodePos[1]+1])) {
                    this.setBoxLeftPosition(41);
                }
                else {
                    alert('墙壁堵住了过不去');
                }
                break;
            default:
                break;
        }
    },
    //区别不同的指令，除go以外的其他函数都只是旋转方块
    excuteAction : function(directive) {
        switch (directive) {
            case "GO":
                this.goCheck();
                this.move(ele.boxHeadDir);
                break;
            case "TUN LEF":
                ele.rotateDeg -= 90;
                ele.boxHeadDir -= 1;
                this.boxHeadDirCtrl(ele.boxHeadDir);
                this.setBoxDeg(ele.box);
                break;
            case "TUN RIG":
                ele.rotateDeg += 90;
                ele.boxHeadDir += 1;
                this.boxHeadDirCtrl(ele.boxHeadDir);
                this.setBoxDeg(ele.box);
                break;
            case "TUN BAC":
                ele.boxHeadDir += 2;
                ele.rotateDeg += 180;
                this.boxHeadDirCtrl(ele.boxHeadDir);
                this.setBoxDeg(ele.box);
                break;
            case "TRA LEF":
                ele.boxHeadDir = 3;
                this.move(ele.boxHeadDir);
                break;
            case "TRA TOP":
                ele.boxHeadDir = 0;
                this.move(ele.boxHeadDir);
                break;
            case "TRA RIG":
                ele.boxHeadDir = 1;
                this.move(ele.boxHeadDir);
                break;
            case "TRA BOT":
                ele.boxHeadDir = 2;
                this.move(ele.boxHeadDir);
                break;
            case "MOV LEF":
                if(ele.direction != 'left') {
                     ele.rotateDeg = 270;
                     ele.direction = "left";
                     ele.boxHeadDir = 3;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            case "MOV TOP":
                if(ele.direction != 'top') {
                     ele.rotateDeg = 0;
                     ele.direction = "top";
                     ele.boxHeadDir = 0;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            case "MOV RIG":
                if(ele.direction != 'right') {
                     ele.rotateDeg = 90;
                     ele.direction = "right";
                     ele.boxHeadDir = 1;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            case "MOV BOT":
                if(ele.direction != 'bottom') {
                     ele.rotateDeg = 180;
                     ele.direction = "bottom";
                     ele.boxHeadDir = 2;
                }
                this.setBoxDeg(ele.box);
                this.move(ele.boxHeadDir);
                break;
            case "BUILD":
                var boxPos = this.getBoxCoordinate();
                if(this.getPosToBuildWall(boxPos) && ele.isPosHasNoWall(boxPos)) {
                    if(!ele.wallsCoordinate[boxPos[0]]) {
                        ele.wallsCoordinate[boxPos[0]] = [];
                        ele.createWall(boxPos);
                    }
                    else {
                         if((ele.wallsCoordinate[boxPos[0]]).indexOf(boxPos[1]) === -1) {
                            ele.createWall(boxPos);
                        }
                    }
                    console.log(ele.walls);
                }
                else {
                    console.log(ele.wallFailLog);
                }
                console.log(ele.walls);
                break;
            default:
                //BRU
                var color = directive.split(" ")[1];
                var boxPos = this.getBoxCoordinate();
                console.log(ele.walls);
                if(this.getPosToBuildWall(boxPos) && !ele.isPosHasNoWall(boxPos)) {
                    ele.walls[0].changeColor.call({"x":boxPos[0],"y":boxPos[1]},color);
                }
                else {
                    console.log("方块正前方木有墙壁，无法完成粉刷操作");
                }
                break;
        }
       /* console.log("deg: "+ele.rotateDeg);
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
    },
    goCheck : function() {
        switch (ele.direction) {
            case "top":
                ele.boxHeadDir = 0;
                break;
            case "right":
                ele.boxHeadDir = 1;
                break;
            case "bottom":
                ele.boxHeadDir = 2;
                break;
            case "left":
                ele.boxHeadDir = 3;
                break;
            default:
                break;
        }
    },
    getBoxCoordinate : function() {
        var y = this.getLeftBoxPositionNum()/41;
        var x = this.getTopBoxPositionNum()/41;
        return [x,y];
    },
    getPosToBuildWall : function (boxPos) {
        ele.wallFailLog = "";
        console.log(ele.direction);
        switch (ele.direction) {
            case "top":
                if(boxPos[0]-1 < 0) {
                    ele.wallFailLog = "错误:方块在上边界，无法在上边界之外创建墙壁;";
                    return false;
                }
                else {
                    boxPos[0] -= 1;
                    return true;
                }
            case "right":
                if(boxPos[1]+1 > 10) {
                    ele.wallFailLog = "错误:方块在右边界，无法在右边界之外创建墙壁;";
                    return false;
                }
                else {
                    boxPos[1] += 1;
                    return true;
                }
            case "bottom":
                if(boxPos[0]+1 > 10) {
                    ele.wallFailLog = "错误:方块在下边界，无法在下边界之外创建墙壁;";
                    return false;
                }
                else {
                    boxPos[0] += 1;
                    return true;
                }
                break;
            case "left":
                if(boxPos[1]-1 < 0) {
                    ele.wallFailLog = "错误:方块在左边界，无法在左边界之外创建墙壁;";
                    return false;
                }
                else {
                    boxPos[1] -= 1;
                    return true;
                }
            default:
                return false;
        }
    }
};