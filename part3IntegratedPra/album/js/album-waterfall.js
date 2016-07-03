(function(window){
	/**
	 * [WaterFallAlbum description]
	 * @param {string} wrapper [放置相册的地方]
	 * @param {number} column  [几列]
	 * @param {number} gap     [列间缝隙]
	 * @param {number} width   [相册的宽度，默认80%宽,可输入px或者百分比]
	 */
	var WaterFallAlbum = function(wrapper,column,gap,width) {
		this.wrapper = wrapper;
		this.column = column;
		this.columnDiv = [];
		this.gap = gap;
		this.width = width ? width:1000;
	};

	WaterFallAlbum.prototype = {
		constructor : WaterFallAlbum,
		imgBgc : [ 'E97452', '4C6EB4', '449F93', 'D25064', 'E59649' ],
		imgSize : ['600x250', '300x400', '350x500', '200x320', '300x300'],
		imgCount : 1,
		init : function() {
			this.wrapperSet();
			this.columnSet();
			this.addImg(this,0,200);
			this.loadMore();
		},
		wrapperSet : function() {
			this.wrapper = document.getElementById(this.wrapper);
			this.wrapper.className += " img-wrp clear-fix";
			this.wrapper.style.width = this.width+"px";
			this.wrapper.style.padding = this.gap+"px";
		},
		columnSet : function() {
			this.columnWidth = (this.width - 2*this.gap-(this.column-2)*this.gap)/this.column;
			for (var i = 0,len = this.column; i < len; i++) {
				var column = document.createElement("div");
				this.columnDiv.push(column);
				column.className = "column";
				column.id = "column"+i;
				column.style.width = this.columnWidth + "px";
				column.style.padding = this.gap/2+"px";
				this.wrapper.appendChild(column);
			}
		},
		addImg : function(_this, num, len) {
			var img = document.createElement("img");
			var index = this.rdmNumber()+1;
			// img.src = "http://placehold.it/"+this.imgSize[index]+"/"+this.imgBgc[index]+"/fff";
			img.src = "images/"+index+".jpg";
			img.title = "图片"+this.imgCount;
			img.alt = "占位图片"+this.imgCount;
			this.imgCount += 1;
			img.onerror = function () {
			if (num >= len) {
				return;
			}
				_this.addImg(_this, num, len);
			}
			img.onload = function () {
				_this.columnDiv[_this.getMinClm()].appendChild(img);
				if (++num >= len) {
					return;
				}
				_this.addImg(_this, num, len);
			};
		},
		getMinClm : function() {
			var min = this.columnDiv[0].offsetHeight,index = 0;
			for (var i = 0,len = this.columnDiv.length; i < len; i++) {
				var curH = this.columnDiv[i].offsetHeight;
				if(curH < min) {
					min = curH;
					index = i;
				}
			}
			return index;
		},
		loadMore : function() {
			var that = this;
			window.onscroll = function() {
				var screenHeight = (document.documentElement.scrollTop || document.body.scrollTop) +(document.documentElement.clientHeight || document.body.clientHeight);
				var container = that.columnDiv[that.getMinClm()];
				var containerHeight = container.offsetTop  + container.offsetHeight;
				if (containerHeight < screenHeight) {
					that.addImg(that,0,4);
				}
			};
		},
		rdmNumber : function() {
			return Math.floor(Math.random()*5);
		},
		getEle : function(id) {
			return document.getElementById(id);
		}
	};

	window.WaterFallAlbum = WaterFallAlbum;
})(window);