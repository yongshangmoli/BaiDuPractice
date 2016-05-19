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
    directive : '',// 向方块发送的指令
    excute : $("btn"),// 按键区域
    box : $("box"),// 小方块
    direction : "top",// 方块头部的方向
    rotateDeg : 0,// 用于标识向哪个方向
    boxHeadDir : 0,// 小方块应该向哪个方向前进,0,1,2,3对应于上，右，下，左
    commend : $("commend"),// 显示面板
    cmdNum : $("cmd_list_num"),// 显示面板的数字区域
    inputCmds : [],// 输入的指令
    finalCmds : [],// 解析后传递给执行动画函数的指令
    invalidCmdIndex : [],// 有误的指令标号
    lis : $("cmd_list_num").getElementsByTagName('li'),// 面板数字区域的条目
    cmdCheckReg : [/^GO(\s\d+)?$/,/^TUN\s(LEF|BAC|RIG)$/,/^(TRA|MOV)\s(LEF|RIG|TOP|BOT)(\s\d+)?$/]// 检查指令的正则表达式
};

//小方块，封装了对它的操作方法
function Box() {}
function Cmdpanel() {}
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
            default:
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
    }
};
Cmdpanel.prototype = {
    constructor : Cmdpanel,
    init : function() {
        ele.invalidCmdIndex = [];
        ele.finalCmds = [];
    },
    getCmds : function() {
        ele.inputCmds = ele.commend.value.split("\n");
    },
    cmdsCheckValidate : function() {
        ele.inputCmds.forEach(function(element, index,arr) {
            for(var i=0,len1=ele.cmdCheckReg.length;i<len1;i++) {
                if(ele.cmdCheckReg[i].test(element)) {
                    if(!(i === 1)) {
                        var parts = element.split(" ");
                        var partsLen = parts.length;
                        var count = parseInt(parts[partsLen-1],10);
                        if(/^\d$/.test(count)) {
                            for(var j=0;j<count;j++) {
                                ele.finalCmds.push(element.substring(0,element.lastIndexOf(" ")));
                            }
                        }
                        else {
                            ele.finalCmds.push(element);
                        }
                    }
                    else {
                        ele.finalCmds.push(element);
                    }
                    break;
                }
                else {
                    if(i === len1-1) {
                        ele.invalidCmdIndex.push(index);
                    }
                }
            }
        });
       /* console.log(ele.invalidCmdIndex);
        console.log(ele.inputCmds);
        console.log(ele.invalidCmdIndex.length === 0?true:false);*/
        return ele.invalidCmdIndex.length === 0?true:false;
    },
    addNumList : function() {
        var lastNum = ele.cmdNum.lastElementChild.innerHTML;
        var li = document.createElement("li");
        li.innerHTML = parseInt(lastNum)+1;
        ele.cmdNum.appendChild(li);
    },
    markWrongCmd : function() {
        var indexLi = 0;
        for(var i=0,len=ele.lis.length;i<len;i++) {
            if(i === ele.invalidCmdIndex[indexLi]) {
                indexLi ++;
                ele.lis[i].className = "wrong";
            }
        }
    },
    rePaint : function() {
        for(var i=0,len=ele.lis.length;i<len;i++) {
            if(ele.lis[i].className) {
                ele.lis[i].className = "";
            }
        }
    },
    excuteMove : function() {
        var i=0,len=ele.finalCmds.length;
        var render = setInterval(function() {
            if(i<len) {
                box.excuteAction(ele.finalCmds[i]);
                i++;
            }
            else {
                clearInterval(render);
            }
        },1000);
    },
    updataCmdIndex : function() {
        var lineCountBefore = ele.lis.length;
        cmdPanel.getCmds();
        var lineCountNow = ele.inputCmds.length;
        var sub = lineCountNow-lineCountBefore;
        if(sub < 0) {
            for(var i=0,len=Math.abs(sub);i<len;i++) {
                ele.cmdNum.removeChild(ele.cmdNum.lastChild);
            }
        }
        else if(sub > 0) {
            var text = "";
            for(var i=0,len=sub;i<len;i++) {
                this.addNumList();
            }
        }
    }
};
var box = new Box()
    cmdPanel = new Cmdpanel();

box.init();

//为指令区域绑定点击监听事件
addEvent(ele.excute,'click',function(e) {
    var tagt = e.target;
    if(tagt.id === 'excute') {
        cmdPanel.init();
        cmdPanel.getCmds();
        if(cmdPanel.cmdsCheckValidate()) {
           cmdPanel.excuteMove();
           cmdPanel.rePaint();
        }
        else {
            cmdPanel.markWrongCmd();
        }
    }
    else if(tagt.id === 'refresh') {
        ele.commend.value = '';
        ele.cmdNum.innerHTML = '<li>1</li>';
    }
});

addEvent(ele.commend,'keyup',function(e) {
    cmdPanel.updataCmdIndex();
});

addEvent(ele.commend,'scroll',function() {
    ele.cmdNum.scrollTop = ele.commend.scrollTop;
});