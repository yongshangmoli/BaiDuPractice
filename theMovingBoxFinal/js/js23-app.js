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
    trs : $("actionZone").getElementsByTagName('tr'),
    wallsCoordinate : {},//存储所有墙的坐标,格式为{1:[1,2],2:[],...10:[2,1]},表示第i行的哪些位置有墙，方便判断是否能在此建造墙壁（仅当该处无墙才能进行建造）
    walls : [],//方便清除墙时进行操作
    wallFailLog : '',
    scale : [1,10],//整个方格坐标的范围
    cmdCheckReg : [/^BUILD$/,/^GO(\s\d+)?$/,/^TUN\s(LEF|BAC|RIG)$/,/^(TRA|MOV)\s(LEF|RIG|TOP|BOT)(\s\d+)?$/,/^BRU\s\#([a-fA-F0-9]){6}$/,/^MOV\sTO\s(\d{1,2}\,\d{1,2})$/]// 检查指令的正则表达式
};
ele.prducWallCordntRandom = function() {
    return [Math.round(Math.random()*9+1),Math.round(Math.random()*9+1)];
};
ele.clearWalls = function() {
   /*若没有存储墙的对象就这样遍历删除墙的样式
    for(o in ele.wallsCoordinate) {
        var tdsIndex = ele.wallsCoordinate[o];
        for(var i = 0, length1 = tdsIndex.length; i < length1; i++){
            (ele.trs[o].getElementsByTagName('td'))[tdsIndex[i]].className = "";
        }
    }*/
    for(var i = 0, length1 = ele.walls.length; i < length1; i++){
        var cur = ele.walls[i];
        cur.clearWall(cur.x,cur.y);
    }
    ele.walls = [];
    ele.wallsCoordinate = {};
};
ele.isPosHasNoWall = function(wallPos) {
    /*if(!(this.x === 6 && this.y === 6)) {*/
        ele.wallFailLog = '';
        var res = !ele.wallsCoordinate[wallPos[0]] || (ele.wallsCoordinate[wallPos[0]]).indexOf(wallPos[1]) === -1;
        if(!res) {
            ele.wallFailLog = '错误：所选区域已经存在墙壁，无法重复创建墙壁';
        }
        return res;
    /*}
    else {
        return false;
    }*/
};
ele.createWall = function(coordinate) {
    var wall = new Wall(coordinate[0],coordinate[1]);
    (ele.wallsCoordinate[coordinate[0]]).push(coordinate[1]);
    ele.walls.push(wall);
    wall.displayWall();
};
var box = new Box(),
    cmdPanel = new Cmdpanel()
    way = new Way(ele);

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
           console.log(ele.finalCmds);
        }
        else {
            cmdPanel.markWrongCmd();
        }
    }
    else if(tagt.id === 'refresh') {
        ele.commend.value = '';
        ele.cmdNum.innerHTML = '<li>1</li>';
    }
    else if(tagt.id === 'bldwall') {
        var i=0;
        ele.clearWalls();
        //在方块位置不能有墙，墙的坐标不能重复
        while(i < 15){
            var coordinate = ele. prducWallCordntRandom();
            if(!(coordinate[0] === 6 && coordinate[1] === 6)) {
                if(!ele.wallsCoordinate[coordinate[0]]) {
                    ele.wallsCoordinate[coordinate[0]] = [];
                    ele.createWall(coordinate);
                    i++;
                }
                else {
                     if((ele.wallsCoordinate[coordinate[0]]).indexOf(coordinate[1]) === -1) {
                        ele.createWall(coordinate);
                        i++;
                    }
                }
            }
        }
        /*console.log(ele.wallsCoordinate);
        console.log(i);*/
    }
   /* else if (tagt.id === 'getway') {
        way.init();
    }*/
});

addEvent(ele.commend,'keyup',function(e) {
    cmdPanel.updataCmdIndex();
});

addEvent(ele.commend,'scroll',function() {
    ele.cmdNum.scrollTop = ele.commend.scrollTop;
});


/*var w1 = new Wall(1,1);
console.log(w1.prducWallCordntRandom());*/
