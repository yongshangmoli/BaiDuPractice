(function() {
	/*广度优先遍历*/
	function BFS(node) {
		if(node) {
			var queue = [];
			queue.push(node);
			while(queue.length) {
				var item = queue.shift();
				arr.push(item);
				var child = item.firstElementChild;
				while(child) {
					queue.push(child);
					child=child.nextElementSibling;
				}
			}
		}
	}
	
	/*非递归方式实现DFS*/
	function DFS(node) {
		var stack = [];
		stack.push(node);
		while(stack.length) {
			var ele = stack.shift();
			arr.push(ele);
			var child = ele.firstElementChild;
			var childs = [];
			while(child) {
				childs.push(child);
				child = child.nextElementSibling;
			}
			stack = childs.concat(stack);
		}
	}
	
	/*遍历改变背景色的动画*/
	function animation(arr){
		var i=0,pre=0;
		t = setInterval(function(){
			arr[pre].style.background = 'white';
			if(i<arr.length) {
				arr[i].style.background = 'pink';
				if(search.value && arr[i].firstChild.nodeValue.trim() == search.value) {
					arr[i].style.background = 'red';
					alert('已经找到匹配元素，搜索停止啦');
					clearInterval(t);
				}
				pre = i;
			}
			else {
				if(search.value) {
					alert('并没有你想寻找的元素哦');
				}
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
	
	var traverse = document.getElementById('sortBtn').getElementsByTagName('input');
	var addOrDel = document.getElementById('addOrDel').getElementsByTagName('input');
	var root = document.getElementById('tree');
	var search = traverse[1];
	var arr,t,choice,nullTree=false;
	
	/*分别给俩个遍历按键绑定处理函数，能否把函数名存起来，然后在for循环依次绑定函数？*/
	addEvent(traverse[0], 'click', function() {
		if(!nullTree) {
			arr = [];
			BFS(root);
			reset();
			animation(arr);
		}
		else {
			alert('木有树，无法遍历啦');
		}
	})
	addEvent(traverse[2], 'click', function() {
		if(!nullTree) {
			arr = [];
			DFS(root);
			reset();
			animation(arr);
		}
		else {
			alert('木有树，无法遍历啦');
		}
	})
	/*为div添加事件处理函数，choice用于记录上次高亮的元素*/	
	addEvent(root, 'click', function(e) {
		reset();
		clearInterval(t);
		if(choice) {
			choice.style.backgroundColor = '';
		}
		e.target.style.backgroundColor = 'lightblue';
		choice = e.target;
	})
	/*获取删除或者插入节点的按键*/	
	addEvent(addOrDel[0], 'click', function() {
		if(!choice) {
			alert('你并没有选中任何元素哦');
		}
		else {
			var parent = choice.parentNode;
			if(parent) {
				parent.removeChild(choice);
				if(choice == root) {
					nullTree = true;
				}
			}
			else {
				alert('都被删光了，无法继续删除啦');
				/*console.log(parent);*/
			}
		}
	})
	
	addEvent(addOrDel[2], 'click', function() {
		if(!choice) {
			alert('你并没有选中任何元素哦');
		}
		else {
			var parent = choice.parentNode;
			if(parent) {
				var content = addOrDel[1].value;
				if(!content) {
					alert('请先输入你想插入的节点的内容哦');
				}
				else {
					var div = document.createElement('div');
					div.className = 'flex container inner-width div2';
					div.innerHTML = content;
					choice.appendChild(div);
				}
			}
			else {
				alert('都被删光了,所以木有地方插入了');
			}
		}
	})
}())