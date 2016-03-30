/*获取输入框内的值,并转换后用数组存储*/
function getInput(input) {
	var value = input.value;
	if(checkInput(value)) {
		return  value.split(/,|，|`|、| |　|\t|\r|\n/);
	}
	else {
		alert('请输入合法的数字、英文或中文');
		return false;
	}
}

/*判断输入是否为数字、中文、英文，回车，逗号（全角半角均可），顿号，空格（全角半角、Tab等均可）等符号*/
function checkInput(input) {
	var reg = /^[A-Za-z0-9\u4e00-\u9fa5,，、  \t\r\n]+$/;
	if(reg.test(input)) {
		return true;
	}
	return false;
}
/*点击对应按键的处理函数*/
function btnsOption(btns,queue) {
	for(var i=0;i<btns.length;i++) {
		btns[i].onclick = (function(index) {
			return function() {
				var input = document.getElementById('txtArea');
				switch (index) {
				case 0:
					if(getInput(input)) {
						var arr = getInput(input);
						arr.forEach(function(ele,index,array){
							queue.insertBefore(drawNum(ele),queue.firstChild);
						});
					}
					break;
				case 1:
					if(getInput(input)) {
						var arr = getInput(input);
						arr.forEach(function(ele,index,array){
							queue.appendChild(drawNum(ele));
						});
					}
					break;
				case 2:
					if(queue.firstChild == null) {
						alert('没有元素，不能再删除了');
					}
					else {
						alert('将删除头元素 '+queue.firstChild.innerHTML);
						queue.removeChild(queue.firstChild);
					}
					break;
				case 3:
					if(queue.firstChild == null) {
						alert('没有元素，不能再删除了');
					}
					else {
						alert('将删除尾元素 '+queue.lastChild.innerHTML);
						queue.removeChild(queue.lastChild);
					}
					break;
				case 4:
					if(queue.firstChild == null) {
						alert('队列中没有元素，不能查询');
					}
					else {
						var childs = queue.childNodes;
						var len = childs.length;
						var search = document.getElementById('search').value;
						var anyMatch = false;
						if(search != '') {
							for(var i=0;i<len;i++) {
								if(childs[i].innerHTML.indexOf(search) != -1) {
									childs[i].style.backgroundColor = 'lightgreen';
									anyMatch = true;
								}
								else {
									childs[i].style.backgroundColor = 'pink';
								}
							}
							if(!anyMatch) {
								alert('没有查到您想查询的内容');
							}
							else {
								alert('匹配的内容已背景已被标记为绿色');
							}
						}
						else {
							alert('输入您想查询的内容');
						}
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
	div.innerHTML = num;
	return div;
}
/*点击删除对应元素的函数*/
function deleteClick() {
	var parent = this;
	var divs = parent.getElementsByTagName('div');
	for(var i=0;i<divs.length;i++) {
		divs[i].onclick = (function(index) {
			return function() {
				alert('将删除您选择的元素 '+divs[index].innerHTML);
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
			return handler.call(target,window.event);
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