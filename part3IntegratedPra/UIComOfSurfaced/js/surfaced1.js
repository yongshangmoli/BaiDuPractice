(function() {
	var util = {
		display : $("display"),
		surfaced : $("surfaced"),
		close : $("close"),
		cover : $("cover"),
		body : document.body,
	};
	util.hideEle = function(arr) {
		for(var i = 0, length1 = arr.length; i < length1; i++){
			arr[i].style.display = 'none';
		}
	}
	util.dsplEle = function(arr) {
		for(var i = 0, length1 = arr.length; i < length1; i++){
			arr[i].style.display = '';
		}
	}

	function $(id) {
		return document.getElementById(id);
	}

	function addEvent(target,type,handler) {
		if(target.addEventListener) {
			target.addEventListener(type, handler);
		}
		else if (target.attachEvent) {
			target.attachEvent('on'+type,function() {
				 return handler.call(target,window.event);
			});
		}
		else {
			target['on'+type] = function () {
				 return handler.call(target);
			}
		}
	}

	addEvent(util.display,'click',function() {
		util.dsplEle([util.cover,util.surfaced]);
		util.cover.style.height = util.body.clientHeight+"px";
	});

	addEvent(util.close,'click',function() {
		util.hideEle([util.cover,util.surfaced]);
	});

	addEvent(util.cover,'click',function() {
		util.hideEle([util.cover,util.surfaced]);
	});
})();
