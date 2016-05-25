(function() {
	/*先序遍历*/
	function preOrderTraverse(node) {
		if(node != null) {
			arr.push(node);
			preOrderTraverse(node.firstElementChild);
			preOrderTraverse(node.lastElementChild);
		}
	}
	/*中序遍历*/
	function inOrderTraverse(node) {
		if(node != null) {
			inOrderTraverse(node.firstElementChild);
			arr.push(node);
			inOrderTraverse(node.lastElementChild);
		}
	}
	/*后序遍历*/
	function postOrderTraverse(node) {
		if(node != null) {
			postOrderTraverse(node.firstElementChild);
			postOrderTraverse(node.lastElementChild);
			arr.push(node);
		}
	}
	/*遍历改变背景色的动画*/
	function animation(arr){
		var i=0,pre=0;
		t = setInterval(function(){
			arr[pre].style.background = 'white';
			if(i<arr.length) {
				arr[i].style.background = 'pink';
				pre = i;
			}
			else {
				clearInterval(t);
			}
			i++;
		},600);
	}
	
	/*事件绑定函数*/
	function addEvent(target,type,handler) {
		if(target.addEventListener) {
			target.addEventListener(type,handler);
		}
		else if(target.attachEvent) {
			target.attachEvent('on'+type,function(event) {
				return handler.call(target,window.event);
			})
		}
		else {
			target['on'+type] = function() {
				return handler.call(target);
			}
		}
	}
	
	/*重置全部*/
	var reset = function () {
	    clearInterval(t);
	    var divs = document.getElementsByTagName('div');
	    for (var i = divs.length - 1; i >= 0; i--) {
	        divs[i].style.background = 'white';
	    }
	};
	
	var btns = document.getElementById('sortBtn').getElementsByTagName('input');
	var root = document.getElementById('tree');
	var arr,t;
	/*分别给三个按键绑定处理函数，能否把函数名存起来，然后在for循环依次绑定函数？*/
	addEvent(btns[0], 'click', function() {
		arr = [];
		preOrderTraverse(root);
		reset();
		animation(arr);
	})
	addEvent(btns[1], 'click', function() {
		arr = [];
		inOrderTraverse(root);
		reset();
		animation(arr);
	})
	addEvent(btns[2], 'click', function() {
		arr = [];
		postOrderTraverse(root);
		reset();
		animation(arr);
	})
}())