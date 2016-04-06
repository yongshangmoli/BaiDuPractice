(function() {
	/*广度优先遍历*/
	function BFS(node) {
		if(node) {
			var queue = [];
			queue.push(node);
			while(queue.length) {
				var item = queue.shift();
				if(item.localName == 'p') {
					if(item.innerHTML == search[0].value) {
						item.style.background = 'pink';
						/*notice:这里是把隐藏的元素显示出来*/
						 var parent=item.parentNode;
						 while(parent.id !="tree"){
		                    parent.style.display="";
		                    parent.className = '';
		                    parent=parent.parentNode;
		                }
						 alert('已经找到匹配元素啦');
					}
				}
				var child = item.firstElementChild;
				while(child) {
					queue.push(child);
					child=child.nextElementSibling;
				}
			}
		}
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
	    var p = document.getElementsByTagName('p');
	    for (var i = p.length - 1; i >= 0; i--) {
	        p[i].style.background = 'white';
	    }
	};
	
	var search = document.getElementById('search').getElementsByTagName('input');
	var root = document.getElementById('tree');
	var mouseRight = document.getElementById('mouseRight');
	var choice,clickObj,nullTree=false;
	
	/*给按键绑定处理函数*/
	addEvent(search[1], 'click', function() {
		if(!nullTree) {
			if(search[0].value) {
				reset();
				BFS(root);
			}
			else {
				alert('请输入你要查找的节点');
			}
		}
		else {
			alert('木有目录，不用找也知道没有你要找的东西啦');
		}
	})
	
	/*为div添加事件处理函数，choice用于记录上次高亮的元素*/	
	root.oncontextmenu=function(event){
        event.preventDefault();//阻止鼠标默认事件
    };
    
	addEvent(root, 'mouseup', function(e) {
		reset();
		if(choice) {
			choice.style.backgroundColor = '';
		}
		e.preventDefault();
		clickObj = e.target;
		if(clickObj.localName == 'p') {
			clickObj.style.backgroundColor = 'lightblue';
			choice = clickObj;
			if(e.which === 1) {
				mouseRight.style.display = 'none';
				if(clickObj.nextElementSibling) {
					if(clickObj.nextElementSibling.style.display == 'none') {
						clickObj.nextElementSibling.style.display = '';
						clickObj.parentNode.className = '';
					}
					else {
						clickObj.nextElementSibling.style.display = 'none';
						clickObj.parentNode.className = 'close-style';
					}
				}
			}
			else if(e.which === 3) {
				mouseRight.style.left = ''+(e.clientX+20)+'px';
				mouseRight.style.top = ''+(e.clientY+10)+'px';
				mouseRight.style.display = '';
			}
			/*console.log();*/
		}
	})
	
/*	对鼠标右键单击弹出的事件绑定函数*/
	addEvent(mouseRight, 'click', function(e) {
		e.preventDefault();
		var option = e.target.innerHTML;
		if(option == '删除') {
			if(choice.innerHTML == '计算机书目') {
				nullTree = true;
			}
			choice.parentNode.parentNode.removeChild(choice.parentNode);
		}
		else if(option == '新建') {
			var name = prompt("请输入节点名称","信息安全类");
			if(name) {
				var li = document.createElement('li');
				var p = document.createElement('p');
				li.appendChild(p);
				p.innerHTML = name;
				/*区分两类：一类是已经有孩子了，另一类是孩子暂时为空*/
				if(clickObj.nextElementSibling) {
					clickObj.nextElementSibling.appendChild(li);
				}
				else {
					var ul = document.createElement('ul');
					ul.appendChild(li);
					choice.parentNode.appendChild(ul);
				}
			}
		}
		else if(option == '重命名') {
			var name = prompt("请输入新名字","信息安全类");
			console.log(e);
			if(name) {
				choice.innerHTML = name;
			}
		}
		mouseRight.style.display = 'none';
	});
}())