function Wall(x,y) {
    this.x = x;
    this.y = y;
}
Wall.prototype = {
    constructor : Wall,
    displayWall : function() {
        //console.log(this.getYcoordiate(ele.trs[this.x])[this.y]);
        this.getYcoordiate(ele.trs[this.x])[this.y].className = "wall";
    },
    clearWall : function() {
        var td = this.getYcoordiate(ele.trs[this.x])[this.y];
        td.className = "";
        td.style.backgroundColor = "";
    },
    getYcoordiate : function(tr) {
        return tr.getElementsByTagName('td');
    },
    changeColor : function(color) {
        console.log(color);
        ele.trs[this.x].getElementsByTagName('td')[this.y].style.backgroundColor = color;
    }
}

