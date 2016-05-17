//需要创建选项的，比如单选多选下拉等，需要输入条目，该条目的操作放在这里
function objList(container) {
	this.queue = [];
	this.paint = function() {
		var str = this.queue.reduce(function(s,v) {
			return s+'<div class="tag">'+v+'</div>';
		},'');
		container.innerHTML = str;
		this.deleteClick(container,this);
	};
	//this.init();
}
objList.prototype.del = function(str) {
	this.queue.splice(str,1);
	this.paint();
}
objList.prototype.push = function(str) {
	this.queue.push(str);
}
objList.prototype.pop = function(str) {
	this.queue.pop(str);
}
objList.prototype.shift = function(str) {
	this.queue.shift(str);
}
objList.prototype.unshift = function(str) {
	this.queue.unshift(str);
}
objList.prototype.deleteClick = function(container,list) {
	var divs = container.getElementsByTagName('div');
	for(var i=0;i<divs.length;i++) {
		divs[i].onclick = function(index) {
			return function() {
				return list.del(index);
			}
		}(i)
	}
}

var tagAbout = {
	tagList : new objList(document.getElementById("box_item_show")),
	tagInput : document.getElementById("box_item_input")
};