//控制面板
function Cmdpanel() {}
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
                    if(!(i === 2)) {
                        var parts = element.split(" ");
                        var partsLen = parts.length;
                        //区别MOV LEF N与MOV TO X,Y
                        if(parts[1] === "TO") {
                            console.log("寻路指令");
                            var coordinate = element.split(" ")[2].split(",");
                            //ele.desPosition = [coordinate[0],coordinate[1]];
                            //ele.srcPosition = [this.getTopBoxPositionNum/41,this.getLeftBoxPositionNum/41];
                            way.des = [parseInt(coordinate[0]),parseInt(coordinate[1])];
                            if(way.des[0] > ele.scale[1] || way.des[1] > ele.scale[1]) {
                                console.log("目的地超过指定范围，无法完成移动");
                            }
                            else {
                                way.src = box.getBoxCoordinate();
                                way.init();
                                var pathNodes = way.pathRes;
                                var preNode = pathNodes[pathNodes.length-1];
                                for(var length1 = pathNodes.length,i = length1-2; i >= 0; i--){
                                    var curX = pathNodes[i][0];
                                    var curY = pathNodes[i][1];
                                    var preX = preNode[0];
                                    var preY = preNode[1];
                                    if(curX-preX<0) {
                                        ele.finalCmds.push("TRA TOP");
                                    }
                                    else if(curX-preX>0) {
                                        ele.finalCmds.push("TRA BOT");
                                    }
                                    else if(curY-preY<0) {
                                        ele.finalCmds.push("TRA LEF");
                                    }
                                    else if(curY-preY>0) {
                                        ele.finalCmds.push("TRA RIG");
                                    }
                                    preNode = pathNodes[i];
                                }
                            }
                        }
                        else {
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
        /*console.log(ele.invalidCmdIndex);
        console.log(ele.inputCmds);
        console.log(ele.finalCmds);*/
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
        console.log(len);
        var render = setInterval(function() {
            if(i<len) {
                console.log(ele.finalCmds[i]+i);
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