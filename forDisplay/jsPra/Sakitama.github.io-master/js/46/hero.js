var heroObj = function () {//hero类声明
    this.x;
    this.y;
};
heroObj.prototype.init = function () { // 成员函数--初始化
    this.coordinates = {
        row: Math.floor(Math.random() * 2),
        col: Math.floor(Math.random() * main.canCol)
    };
    this.x = this.coordinates.col * main.cellWidth;
    this.y = this.coordinates.row * main.cellHeight;
};
heroObj.prototype.draw = function () { // 成员函数--绘制
    main.ctx.save();
    main.ctx.fillStyle = '#44B811';
    main.ctx.fillRect(this.x, this.y, main.cellWidth, main.cellHeight);
    main.ctx.restore();
};
heroObj.prototype.move = function (row, col) { // 成员函数--更新坐标值
    this.x = col * main.cellWidth;
    this.y = row * main.cellHeight;
    this.coordinates = {
        row: row,
        col: col
    };
};