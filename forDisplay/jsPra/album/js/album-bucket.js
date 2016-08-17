(function(window) {
	/**
	 * 木桶相册,实现思路：
	 * ① 随机数产生照片尺寸（loadNum为每次加载的照片数量），用sourceImgs数组存每张照片参数（长，宽，url，颜色），
	 * ② 计算需要多少行来放，按minHeight的高度来缩小/放大照片得到他们的宽度，当宽度超过wrapper时，将当前照片放到下一行
	 * 	 并将本行的高度放大至恰好容得下之前的图片，存储当前行初始/结束img的index以及当前行的高度
	 * ③ 每行每个地渲染
	 * @param {[string]} wrapper [放照片的容器的id]
	 * @param {[number]} width   [宽度，不设置默认为1000px]
	 */
	var BuckAlbum = function(wrapper,width) {
		this.width = width ? width:1000;
		this.wrapper = wrapper;
	};
	BuckAlbum.prototype = {
		constructor : BuckAlbum,
		init : function() {
			this.loadNum = 50;
			this.minHeight = 200;
			this.sourceImgs = [];
			this.control = false;//控制是否进行绘制
			this.wrapperSet();
			this.draw();
			this.scrollListener();
		},
		scrollListener : function() {
			var that = this;
			this.addEvent(window,"scroll",function() {
				var windowHeight = that.getViewport(),
					scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
				if(that.getTop(that.lastRow) + that.lastRow.clientHeight < windowHeight + scrollHeight) {
					if(that.control) {
						that.control = false;
						that.draw();
					}
				}
			})
		},
		wrapperSet : function() {
			this.wrapper = document.getElementById(this.wrapper);
			this.wrapper.className += " img-wrp";
			this.wrapper.style.width = this.width+"px";
		},
		draw : function() {
			this.imgGet();
			this.renderRows(this.calcRow());
			this.control = true;
		},
		getViewport : function() {
			return document.compatMode == "BackCompat" ? document.body.clientHeight : document.documentElement.clientHeight;
		},
		getTop : function(ele) {
			var actualTop = ele.offsetTop,current = ele.offsetParent;
			while (!current) {
				actualTop += current.offsetTop;
				current = current.offsetParent;
			}
			return actualTop;
		},
		imgGet : function() {
			var width,height;
			for (var i = 0,len = this.loadNum; i < len; i++) {
				width = Math.floor(Math.random() * 300 + 300);
                height = Math.floor(Math.random() * 30 + 300);
				this.sourceImgs.push({
					width: width,
					height: height,
					url: "http://placehold.it/"+width+"x"+height+"/"+this.rdmColor()+"/fff",
					ratio: width / height
				});
			}
		},
		rdmColor : function() {
			var rdm = Math.floor(Math.random() * 0xffffff).toString(16);
			if(rdm.length === 6) {
				return rdm;
			} else {
				return this.rdmColor();
			}
		},
		calcRow : function() {
			var height = this.minHeight, width = 0, ratio, totalHeight, totalWidth, rows = [], startIndex = 0, endIndex = 0;
			for (var i = 0, len=this.sourceImgs.length ; i < len; i++) {
				this.sourceImgs[i].height = height;
				this.sourceImgs[i].width = height * this.sourceImgs[i].ratio;
				width += this.sourceImgs[i].width;
				endIndex = i;
				if(width > this.width) {
					totalWidth = width - this.sourceImgs[i].width;
					ratio = height / totalWidth;
					//设置的图片padding为8
					totalHeight = (this.width - (endIndex - startIndex - 1) * 8) * ratio;
					rows.push({
						start: startIndex,
						end: endIndex-1,
						height: totalHeight,
					});
					width = this.sourceImgs[i].width;
					startIndex = i;
				}
			}
			return rows;
		},
		renderRows : function(rows) {
			var rowDOM,boxDOM,img,count=0;
			// console.log(rows);
			for (var i = 0,len1 = rows.length; i < len1; i++) {
				rowDOM = document.createElement("div");
				rowDOM.className = "row-wrp";
				rowDOM.style.height = rows[i].height + "px";
				for (var j = rows[i].start,len2 = rows[i].end; j <= len2; j++) {
					count ++;
					boxDOM = document.createElement("div");
					boxDOM.className = "row-imgwrp";
					img = document.createElement("img");
					img.src = this.sourceImgs[j].url;
					img.style.height = rows[i].height + "px";
					boxDOM.appendChild(img);
					rowDOM.appendChild(boxDOM);
				}
				if(i === rows.length - 1) {
					this.lastRow = rowDOM;
				}
				this.wrapper.appendChild(rowDOM);
			}
			/*
				如果是固定数量的图片，让最后一行从前往后放，不强制占满一行
			 if(count < this.sourceImgs.length) {
				rowDOM = document.createElement("div");
				rowDOM.className = "row-wrp";
				rowDOM.style.height = this.minHeight + "px";
				for (var i = count,len=this.sourceImgs.length; i < len; i++) {
					count ++;
					boxDOM = document.createElement("div");
					boxDOM.className = "row-imgwrp";
					img = document.createElement("img");
					img.src = this.sourceImgs[i].url;
					img.style.height = this.sourceImgs[i].height + "px";
					boxDOM.appendChild(img);
					rowDOM.appendChild(boxDOM);
				}
				this.wrapper.appendChild(rowDOM);
			}*/
			//将sourceImg已经渲染的img移出，方便scroll时继续往里塞
			this.sourceImgs.splice(0,count);
		},
		addEvent : function(target,type,handler) {
			if(window.addEventListener) {
				addEvent = function(target,type,handler) {
					target.addEventListener(type,handler,false);
				}
			}
			else if(window.attachEvent) {
				addEvent = function(target,type,handler) {
					target.attachEvent('on'+type,handler);
				}
			}
			else {
				addEvent = function(target,type,handler) {
					target['on'+type] = handler;
				}
			}
			addEvent(target,type,handler);
		},
	};
	window.BuckAlbum = BuckAlbum;
})(window);