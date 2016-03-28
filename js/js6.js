/*获取输入框内的值*/
function getInput() {
	var value = document.getElementById('inputNum').value;
	if(checkNum(value)) {
		return value;
	}
	else {
		alert('请输入合法的数字');
		return false;
	}
}

/*判断输入是否为数字，正，负，0都可以*/
function checkNum(num) {
	var reg = /^[-]?[1-9]+$|0/;
	if(reg.test(num)) {
		return true;
	}
	return false;
}
/*点击对应按键的处理函数*/
function btnsOption(btns,queue) {
	for(var i=0;i<btns.length;i++) {
		btns[i].onclick = (function(index) {
			return function() {
				switch (index) {
				case 0:
					if(getInput()) {
						queue.insertBefore(drawNum(getInput()),queue.firstChild);
					}
					break;
				case 1:
					if(getInput()) {
						queue.appendChild(drawNum(getInput()));
					}
					break;
				case 2:
					if(queue.firstChild == null) {
						alert('没有元素，不能再删除了');
					}
					else {
						alert('将删除头元素'+queue.firstChild.innerHTML);
						queue.removeChild(queue.firstChild);
					}
					break;
				case 3:
					if(queue.firstChild == null) {
						alert('没有元素，不能再删除了');
					}
					else {
						alert('将删除尾元素'+queue.lastChild.innerHTML);
						queue.removeChild(queue.lastChild);
					}
					break;
				default:
					break;
				}
				queue.click();
			}
		}(i));
	}
}
/*添加小方块包裹的数字添加进队列的函数*/
function drawNum(num) {
	var div = document.createElement('div');
	div.setAttribute('class','num');
	div.innerHTML = ''+num;
	return div;
}
/*点击删除对应元素的函数*/
function deleteClick() {
	var parent = this;
	var divs = parent.getElementsByTagName('div');
	for(var i=0;i<divs.length;i++) {
		divs[i].onclick = (function(index) {
			return function() {
				alert('将删除您选择的元素元素'+divs[index].innerHTML);
				parent.removeChild(divs[index]);
			}
		}(i));
	}
}
/*事件绑定函数*/
function addEvent(target,type,handler) {
	if(target.addEventListener) {
		target.addEventListener(type,handler,false);
	}
	else if(target.attachEvent) {
		target.attachEvent('on'+type,function(event) {
			return handler.call(target,event);
		});
	}
	else {
		target['on'+type] = function() {
			return handler.call(target);
		}
	}
}

/*初始化操作，绑定监听器等*/
function init() {
	var btns = document.getElementById('btns').getElementsByTagName('button');
	var queue = document.getElementById('queue');
	btnsOption(btns, queue);
	addEvent(queue, 'click', deleteClick);
}

init();