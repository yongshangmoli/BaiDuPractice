(function(window){
	var GalryPrdcr = function(wrapper,imgs,scale) {
		this.wrapper = wrapper;
		this.imgs = imgs;
		this.len = imgs.length;
		this.scale = scale?scale : [1000,600];
	};
	GalryPrdcr.prototype = {
		constructor : GalryPrdcr,
		init : function() {
			this.wrapper = document.getElementById(this.wrapper);
			this.wrapper.style.width = this.scale[0]+"px";
			this.wrapper.style.height = this.scale[1]+"px";
			this.wrapper.className += " img-wrp";
			this.getClass();
			this.setImgs();
		},
		getClass : function() {
			switch(this.len) {
				case 1:
					break;
				case 2:
					this.class = "two";
					break;
				case 3:
					this.class = "three";
					break;
				case 4:
					this.class = "four";
					break;
				case 5:
					this.class = "five";
					break;
				case 6:
					this.class = "six";
					break;
				default:
					throw new TypeError("照片数量仅支持1-6张");
			}
		},
		/*
		全部用clip-path来做的话如下
		setImgs : function() {
			var imgs = "";
			if(this.len === 1) {
				imgs = '<img src='+this.imgs[0]+' alt="照片1">';
			}
			else {
				for (var i = 1; i <= this.len; i++) {
					imgs += '<img src='+this.imgs[i-1]+' alt="照片'+i+'" class='+(this.class+i)+'>';
				}
			}
			this.wrapper.innerHTML = imgs;
		}*/
		//挨个设置
		setImgs : function() {
			switch(this.len) {
				case 1:
					imgs = '<img src='+this.imgs[0]+' alt="照片1">';
					this.wrapper.innerHTML = imgs;
					break;
				case 2:
					this.wrapper.innerHTML = this.sameAttrSet();
					break;
				case 3:
					var img = this.gnrlAttrSet("three");
					var baseX = this.scale[0]/3,baseY = this.scale[1]/3;
					this.imgAttrSet(img[0],{width:baseX*2});
					this.imgAttrSet(img[1],{width:baseX,height:this.scale[1]/2});
					this.imgAttrSet(img[2],{width:baseX,height:this.scale[1]/2});
					break;
				case 4:
					this.gnrlAttrSet("four");
					break;
				case 5:
					var img = this.gnrlAttrSet("five");
					var baseX = this.scale[0]/3,baseY = this.scale[1]/3;
					this.imgAttrSet(img[0],{width:baseX*2,height:baseY*2});
					this.imgAttrSet(img[1],{width:baseX,height:baseX});
					this.imgAttrSet(img[2],{width:baseX,height:this.scale[1]-baseX});
					this.imgAttrSet(img[3],{width:baseX,height:baseY});
					this.imgAttrSet(img[4],{width:baseX,height:baseY});
					break;
				case 6:
					var img = this.gnrlAttrSet("six");
					var baseX = this.scale[0]/3,baseY = this.scale[1]/3;
					this.imgAttrSet(img[0],{width:baseX*2,height:baseY*2});
					for (var i = 1; i < this.len; i++) {
						this.imgAttrSet(img[i],{width:baseX,height:baseY});
					}
				default:
					break;
			}
		},
		gnrlAttrSet : function(number) {
			var img = [];
			if(number === "four") {
				var baseX = this.scale[0]/2,baseY = this.scale[1]/2;
				for (var i = 1; i <= this.len; i++) {
					var img = document.createElement("img");
					this.imgAttrSet(img,{src:this.imgs[i-1],alt:"照片"+i,width:baseX,height:baseY,class:number+i});
					this.wrapper.appendChild(img); 
				}
			}
			else {
				for (var i = 1; i <= this.len; i++) {
					img[i-1] = document.createElement("img");
					this.imgAttrSet(img[i-1],{src:this.imgs[i-1],alt:"照片"+i,class:number+i});
					this.wrapper.appendChild(img[i-1]); 
				}
			}
			return img;
		},
		sameAttrSet : function() {
			var imgs = "";
			for (var i = 1; i <= this.len; i++) {
				imgs += '<img src='+this.imgs[i-1]+' alt="照片'+i+'" class='+(this.class+i)+'>';
			}
			return imgs;
		},
		imgAttrSet : function(obj,attrs) {
			attrs.src && (obj.src = attrs.src);
			attrs.alt && (obj.alt = attrs.alt);
			attrs.width && (obj.style.width = attrs.width+"px");
			attrs.height && (obj.style.height = attrs.height+"px");
			attrs.class && (obj.className = attrs.class);
		}
	}
	window.GalryPrdcr = GalryPrdcr;
})(window);