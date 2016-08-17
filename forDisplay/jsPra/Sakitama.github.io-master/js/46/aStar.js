var findway = (function () {
    /**
     * 监测是否在列表中
     * @param list
     * @param current
     * @returns {boolean}
     */
    function inList(list, current) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (current === list[i]) {
                return true;
            }
        }
        return false;
    }
    /**
     * 重置所有P指针
     */
    function resetP(map) {
        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[0].length; j++) {
                map[i][j].P = null;
            }
        }
    }
    /**
     * 获取四周点
     * @param points
     * @param current
     * @returns {Array}
     */
    function getRounds(points, current) {
        var u = null;//上
        var l = null;//左
        var d = null;//下
        var r = null;//右
        var rounds = [];
        // 上
        if (current.row - 1 >= 0) {
            u = points[current.row - 1][current.col];
            rounds.push(u);
        }
        // 左
        if (current.col - 1 >= 0) {
            l = points[current.row][current.col - 1];
            rounds.push(l);
        }
        // 下
        if (current.row + 1 < points.length) {
            d = points[current.row + 1][current.col];
            rounds.push(d);
        }
        // 右
        if (current.col + 1 < points[0].length) {
            r = points[current.row][current.col + 1];
            rounds.push(r);
        }
        return rounds;
    }
    return function (points, start, end) {
        if (start.row == end.row && start.col == end.col) {
            return;
        } else if (end.empty == false) {
            return;
        } else {
            resetP(main.map);//每次执行MOV TO指令时先重置所有P指针
            var opens = [];  // 存放可检索的方块(开启列表)
            var closes = [];  // 存放已检索的方块（关闭列表）
            var cur = null;  // 当前指针
            var bFind = true;  // 是否检索
            // 设置开始点的F、G为0并放入opens列表（F=G+H）
            start.F = 0;
            start.G = 0;
            start.H = 0;
            // 将起点压入closes数组，并设置cur指向起始点
            closes.push(start);
            cur = start;
            // 如果起始点紧邻结束点则不计算路径直接将起始点和结束点压入closes数组
            if (Math.abs(start.row - end.row) + Math.abs(start.col - end.col) == 1) {
                end.P = start;
                closes.push(end);
                bFind = false;
            }
            // 计算路径
            while (cur && bFind) {
                //如果当前元素cur不在closes列表中，则将其压入closes列表中
                if (!inList(closes, cur)) {
                    closes.push(cur);
                }
                // 然后获取当前点四周点
                var rounds = getRounds(points, cur);
                // 当四周点不在opens数组中并且可移动，设置G、H、F和父级P，并压入opens数组
                for (var i = 0; i < rounds.length; i++) {
                    if (inList(closes, rounds[i]) || inList(opens, rounds[i]) || rounds[i].empty == false) {
                        continue;
                    } else {
                        rounds[i].G = cur.G + 10;//不算斜的，只算横竖，设每格距离为1
                        rounds[i].H = Math.abs(rounds[i].col - end.col) + Math.abs(rounds[i].row - end.row);
                        rounds[i].F = rounds[i].G + rounds[i].H;
                        rounds[i].P = cur;//cur为.P的父指针
                        opens.push(rounds[i]);
                    }
                }
                // 如果获取完四周点后opens列表为空，则代表无路可走，此时退出循环
                if (!opens.length) {
                    cur = null;
                    opens = [];
                    closes = [];
                    break;
                }
                // 按照F值由小到大将opens数组排序
                opens.sort(function (a, b) {
                    return a.F - b.F;
                });
                // 取出opens数组中F值最小的元素，即opens数组中的第一个元素
                var oMinF = opens[0];
                var aMinF = [];  // 存放opens数组中F值最小的元素集合
                // 循环opens数组，查找F值和cur的F值一样的元素，并压入aMinF数组。即找出和最小F值相同的元素有多少
                for (var i = 0; i < opens.length; i++) {
                    if (opens[i].F == oMinF.F)
                        aMinF.push(opens[i]);
                }
                // 如果最小F值有多个元素
                if (aMinF.length > 1) {
                    // 计算元素与cur的曼哈顿距离
                    for (var i = 0; i < aMinF.length; i++) {
                        aMinF[i].D = Math.abs(aMinF[i].row - cur.row) + Math.abs(aMinF[i].col - cur.col);
                    }
                    // 将aMinF按照D曼哈顿距离由小到大排序（按照数值的大小对数字进行排序）
                    aMinF.sort(function (a, b) {
                        return a.D - b.D;
                    });
                    oMinF = aMinF[0];
                }
                // 将cur指向D值最小的元素
                cur = oMinF;
                // 将cur压入closes数组
                if (!inList(closes, cur)) {
                    closes.push(cur);
                }
                // 将cur从opens数组中删除
                for (var i = 0; i < opens.length; i++) {
                    if (opens[i] == cur) {
                        opens.splice(i, 1);//将第i个值删除
                        break;
                    }
                }
                // 找到最后一点，并将结束点压入closes数组
                if (cur.H == 1) {
                    end.P = cur;
                    closes.push(end);
                    cur = null;
                }
            }
            if (closes.length) {
                // 从结尾开始往前找
                var dotCur = closes[closes.length - 1];
                var path = [];  // 存放最终路径
                var i = 0;
                while (dotCur) {
                    path.unshift(dotCur);  // 将当前点压入path数组的头部
                    dotCur = dotCur.P;  // 设置当前点指向父级
                    if (!dotCur.P) {
                        dotCur = null;
                    }
                }
                return path;
            }
            else {
                return;
            }
        }
    };
})();