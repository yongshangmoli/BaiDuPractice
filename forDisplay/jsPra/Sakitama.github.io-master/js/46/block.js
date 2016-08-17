var blockObj = function () {};
blockObj.prototype.num = 100; // 随机生成100个障碍物
blockObj.prototype.draw = function () { // 成员函数--绘制
    var i,
        j;
    main.ctx.save();
    main.ctx.fillStyle = '#2E1E1E';
    for(i = 0; i < main.canRow; i++){
        for (j = 0; j < main.canCol; j++) {
            if (main.map[i][j].empty == false) {
                main.ctx.fillRect(j * main.cellWidth, i * main.cellHeight, main.cellWidth, main.cellHeight);
            }
        }
    }
    main.ctx.restore();
};
blockObj.prototype.buildMap = function () { // 成员函数--生成虚拟地图
    var i,
        j,
        row,
        col;
    for(i = 0; i < main.canRow; i++){
        main.map[i] = [];
        for (j = 0; j < main.canCol; j++) {
            main.map[i][j] = {
                row: i,
                col: j,
                empty: true
            };
        }
    }
    i = 0;
    while (i < this.num) {
        row = Math.floor(Math.random() * (main.canRow - 4) + 2);
        col = Math.floor(Math.random() * main.canCol);
        if (main.map[row][col].empty == true) {
            main.map[row][col].empty = false;
            i++;
        }
    }
};