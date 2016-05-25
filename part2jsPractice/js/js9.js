(function() {
	/*定义构造函数，以便代码复用，但是每删除/添加一次就要将所有东西重绘制，不知道会不会工作量有点大*/
	function objList(container) {
		this.queue = [];
		this.paint = function() {
			var str = this.queue.reduce(function(s,v) {
				return s+'<div class="tag">'+v+'</div>';
			},'');
			container.innerHTML = str;
			deleteClick(container,this);
		}
	}
	
	//共有方法和属性就放原型链上面。避免每个实例都要创造新的方法和属性。
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
	
	var tagInput = document.getElementById('tagInput');
	var tags = document.getElementById('tags');
	var tagList = new objList(tags);
	var hobbyInput = document.getElementById('interestInput');
	var hobbies = document.getElementById('interests');
	var hobbyList = new objList(hobbies);
	var assure = document.getElementById('assure');
	/*为tag的input绑定处理函数*/
	addEvent(tagInput,'keyup',function(e) {
		var str = this.value;
		if(/(,| |\，|\t|\r|\n)$/.test(str)||e.keyCode===13) {
			if(e.keyCode===13) {
				var newTag = str;
			}
			else {
				var newTag = str.slice(0,-1);
			}
			if(tagList.queue.indexOf(newTag)=== -1 && newTag!=="") {
				tagList.push(newTag);
				if(tagList.queue.length>10){
					tagList.shift();
				}
				tagList.paint();
			}
			this.value="";
		}
	});
	
	/*为确定添加按键绑定处理函数*/
	addEvent(assure,'click',function() {
		var arr = hobbyInput.value.trim()
						.split(/,|，|`|、| |　|\t|\r|\n/)
						.filter(function(a){return a})
						.forEach(function(value) {
							if(hobbyList.queue.indexOf(value)===-1){
				   		  		hobbyList.push(value);
				   		  		if(hobbyList.queue.length>10)
				   		  			hobbyList.shift();
				   		  	}
						});
		hobbyInput.value="";
		hobbyList.paint();
	});

	/*点击删除对应元素的函数*/
	function deleteClick(container,list) {
		var divs = container.getElementsByTagName('div');
		for(var i=0;i<divs.length;i++) {
			divs[i].onclick = function(index) {
				return function() {
					return list.del(index);
				}
			}(i)
		}
	}
	
	/*事件绑定函数*/
	function addEvent(target,type,handler) {
		if(target.addEventListener) {
			target.addEventListener(type,handler,false);
		}
		else if(target.attachEvent) {
			target.attachEvent('on'+type,function(event) {
				return handler.call(target,window.event);
			});
		}
		else {
			target['on'+type] = function() {
				return handler.call(target);
			}
		}
	}
	
}())