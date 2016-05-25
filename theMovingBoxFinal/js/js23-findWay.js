function Way(ele) {
    this.ele = ele;//为了使用它的判断是否有墙的方法
    this.border = ele.scale;//传入方块的边界，1,10
    //this.src = ele.srcPosition;//
    //this.des = ele.desPosition;//
    this.src = [];//源节点
    this.des = [];//目的节点
    this.stateRecord;//[[],[],[],[],[],[],[],[],[],[]],undefined：待检查;1:检查过一次;2：已经检查完毕
    this.mapRecord;//记录所有更新过的节点，mapRecord[0] = {"G":3,"H":1,"F":4,"P":[1,2],"N":[2,2]}表示0位置处距离源节点的代价G，H曼哈顿距离，F最终距离，跟他的parent,及本身node的坐标
    this.pathRes;//记录最终路径上的节点
}

Way.prototype = {
    constructor : Way,
    init : function () {
        this.srcParent = {"G":0,"H":0,"F":this.getManhattanDis(this.src,this.des),"P":{},"N":this.src};
        //console.log("in init");
        this.stateRecord = [[],[],[],[],[],[],[],[],[],[],[]];
        this.mapRecord = [];
        this.pathRes = [];
        //console.log(this.src,this.des);
        this.checkNode(this.src,this.srcParent);
        this.excuteFindWay(this.des);
    },
    updateMapRecord : function (node,parent) {
        for(var i = 0, length1 = this.mapRecord.length; i < length1; i++){
            if(this.mapRecord[i].N.x === node[0] && this.mapRecord[i].N.y === node[1]) {
                if(this.mapRecord[i].G > parent.G+1) {
                    this.mapRecord[i].G = parent.G+1;
                    this.mapRecord[i].F = this.mapRecord[i].G+this.mapRecord[i].H;
                    this.mapRecord[i].P = parent;
                    break;
                }
            }
        }
    },
    getManhattanDis : function(src,des) {
        return (Math.abs(src[0]-des[0]))+(Math.abs(src[1]-des[1]));
    },
    addToMapRecord : function(surrounds,parent) {
        for(var i = 0, length1 = surrounds.length; i < length1; i++){
            if(this.ele.isPosHasNoWall(surrounds[i])) {
                var state = this.stateRecord[surrounds[i][0]] && this.stateRecord[surrounds[i][0]][surrounds[i][1]];
                if(state === 1) {//没有墙壁阻挡且之前有记录的
                    this.updateMapRecord(surrounds,parent);
                }
                else if(!state) {
                   // console.log(parent);
                    var g= parent.G+1;
                    var h = this.getManhattanDis(surrounds[i],this.des);
                    var f = g+h;
                    var newNode = {"G":g,"H":h,"F":f,"P":parent,"N":surrounds[i]};
                    //console.log(surrounds[i],surrounds[i][0],surrounds[i][1]);
                    if(surrounds[i][0] === this.des[0] && surrounds[i][1] === this.des[1]) {
                        this.stateRecord[surrounds[i][0]][surrounds[i][1]] = 2;
                        this.mapRecord.splice(0,0,newNode);
                       // console.log(this.mapRecord);
                        return;
                    }
                    else {
                        this.mapRecord.push(newNode);
                        this.stateRecord[surrounds[i][0]][surrounds[i][1]] = 1;
                    }
                }
            }
            else {//碰到墙壁直接设为已完成检查
                this.stateRecord[surrounds[i][0]][surrounds[i][1]] = 2;
            }
        }
        this.mapRecord.sort(function(a,b) {
            return a.F - b.F;
        });
    },
    checkNode : function (cur,curObj) {
        /*var top = {"x":cur.x-1,"y":cur.y};
        var bottom = {"x":cur.x+1,"y":cur.y};
        var left = {"x":cur.x,"y":cur.y-1};
        var right = {"x":cur.x,"y":cur.y+1};*/
       /* var top = [cur.x-1,cur.y];
        var bottom = [cur.x+1,cur.y];
        var left = [cur.x,cur.y-1];
        var right =[cur.x,cur.y+1];*/
        var surrounds;
        //上边界
        if (cur[0] === this.border[0]) {
            // statement
            if(cur[1] === this.border[0]) {
                 surrounds = [[cur[0]+1,cur[1]],[cur[0],cur[1]+1]];
            }
            else if(cur[1] === this.border[1]) {
                surrounds = [[cur[0]+1,cur[1]],[cur[0],cur[1]-1]];
            }
            else {
                surrounds = [[cur[0]+1,cur[1]],[cur[0],cur[1]-1],[cur[0],cur[1]+1]];
            }
        }
        //下边界
        else if(cur[0] === this.border[1]) {
            if(cur[1] === this.border[0]) {
                 surrounds = [[cur[0]-1,cur[1]],[cur[0],cur[1]+1]];
            }
            else if(cur[1] === this.border[1]) {
                surrounds = [[cur[0]-1,cur[1]],[cur[0],cur[1]-1]];
            }
            else {
                surrounds = [[cur[0]-1,cur[1]],[cur[0],cur[1]-1],[cur[0],cur[1]+1]];
            }
        }
        //左边界
        else if(cur[1] === this.border[0]) {
            surrounds = [[cur[0]-1,cur[1]],[cur[0]+1,cur[1]],[cur[0],cur[1]+1]];
        }
        //右边界
        else if(cur[1] === this.border[1]) {
            surrounds = [[cur[0]-1,cur[1]],[cur[0]+1,cur[1]],[cur[0],cur[1]-1]];
        }
        //非边界
        else {
            surrounds = [[cur[0]-1,cur[1]],[cur[0]+1,cur[1]],[cur[0],cur[1]-1],[cur[0],cur[1]+1]];
        }
        this.addToMapRecord(surrounds,curObj);
        this.stateRecord[cur[0]][cur[1]] = 2;
       // console.log(surrounds);
    },
    excuteFindWay : function(des) {
        if(this.ele.isPosHasNoWall(des)) {
            while(this.stateRecord[this.des[0]][this.des[1]] !== 2 && this.mapRecord.length !== 0) {
                var curNode = this.mapRecord.shift();
                var postion = curNode.N;
                this.checkNode(postion,curNode);
                //console.log(this.stateRecord,this.mapRecord);
            }
            if(this.stateRecord[this.des[0]][this.des[1]] === 2) {
                console.log("源节点与目的节点之间存在路径");
                var finalNode = this.mapRecord.shift();
               // console.log(finalNode);
                this.pathRes.push(finalNode.N);
                var parent = finalNode.P;
                while (!_isEmptyObj(parent)) {
                  //  console.log(_isEmptyObj(parent));
                    this.pathRes.push(parent.N);
                    parent = parent.P;

                }
               // console.log(this.pathRes);
            }
            else {
                console.log("源节点与目的节点之间不存在路径");
            }
            function _isEmptyObj (obj) {
                 for(var key in obj) {
                        return false;
                 }
                 return true;
            }
        }
        else {
            console.log("源节点与目的节点之间不存在路径");
        }
    }
};

