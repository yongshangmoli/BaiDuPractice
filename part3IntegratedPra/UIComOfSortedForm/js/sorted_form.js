(function() {
	/*var table = _$('#my_form_sort');
	var util = {
		trs : _$('tr',table),
		titles : _$('td',table),
	};*/

	function SortTable(selector) {
		this.table = _$(selector);
		this.trs = _$('tr',this.table);
	};
	SortTable.prototype = {
		constructor : SortTable,
		headTdHandler : function () {
			var curEle = this.trs[0].firstElementChild;
			var childIndex = 0;
			while (curEle) {
				console.log(curEle);
				 if (curEle.className.toString().indexOf("my-sort") !== -1) {
					this.addSortBtn(curEle,childIndex);
					//_addEvent(curEle,'click',_sortHandler(curEle));?为什么不行
				 }
				 curEle = curEle.nextElementSibling;
				 childIndex ++;
			};
			function _sortHandler(ele) {
				console.log(ele+'s');
			};
		},
		addSortBtn : function (td,id) {
			td.innerHTML += '<div class="my-triangle-wrapper"><div class="my-triangle my-triangle-top" id="sort_top_'+id+'"></div><div class="my-triangle my-triangle-btm" id="sort_btm_'+id+'"></div></div>';
		}
	};

	function _$(selector,/**可选参数*/parent) {
		if({}.toString.call(selector) !== '[object String]') {
			throw new TypeError("输入的选择器不是字符串");
		}
		var firstChar = selector.charAt(0);
		var parentN = parent || document;
		//console.log(parentN);
		if(!firstChar) {
			throw new TypeError("输入的选择器有误");
		}
		if (firstChar === '#') {
			return parentN.getElementById(selector.substr(1));
		}
		else if(firstChar === '.') {
			return parentN.getElementsByClassName(selector.substr(1));
		}
		else {
			return parentN.getElementsByTagName(selector);
		}
	}


	function _addEvent(target,type,handler) {
		if(target.addEventListener) {
			target.addEventListener(type, handler);
		}
		else if(target.attachEvent) {
			target.attachEvent('on'+type,function () {
				 handler.call(target,window.event);
			});
		}
		else {
			target['on'+type] = function () {
				 handler.call(target);
			}
		}
	}

	_addEvent(curEle,'click',_sortHandler(curEle));
	console.log(new SortTable('#my_form_sort').headTdHandler());
})();