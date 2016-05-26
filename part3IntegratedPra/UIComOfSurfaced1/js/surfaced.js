(function(uiCmp) {
	var commonUtil = {
		body: document.body,
		//封装简单的ID选择器
		$: function(id) {
			return document.getElementById(id);
		},
		/**
		 * 创建节点并添加到指定的父节点上
		 * @param  {[string]} name      [要添加的节点的名字]
		 * @param  {[node]} parent    [父节点]
		 * @param  {[string]} className [要创建的节点的样式]
		 * @return {[node]}           [创建好的节点]
		 */
		createEle: function(name, parent, /**optional*/ className) {
			var ele = document.createElement(name);
			if (className) {
				ele.className = className;
			}
			var parent = parent || commonUtil.body;
			parent.appendChild(ele);
			return ele;
		},
		//arr的格式：[[parent,id],[parent,id]]
		/**
		 * 将传入的数组内的节点一一删除
		 */
		removeEle: function(arr) {
			for (var i = 0, length1 = arr.length; i < length1; i++) {
				arr[i][0].removeChild(this.$(arr[i][1]));
			}
		},
		/**
		 * 绑定事件监听器
		 */
		addEvent: function(target, type, handler) {
			if (target.addEventListener) {
				target.addEventListener(type, handler);
			} else if (target.attachEvent) {
				target.attachEvent('on' + type, function() {
					return handler.call(target, window.event);
				});
			} else {
				target['on' + type] = function() {
					return handler.call(target);
				}
			}
		},
		/**
		 * 设置节点元素可拖拽
		 * @param  {[node]} dragTgt [传入要绑定拖拽事件的节点]
		 */
		dragEvent: function(dragTgt) {
			var position, start = [0, 0],
				dragging = false,
				neverMoved = false,
				dragObj = dragTgt.firstChild,
				left = dragTgt && dragTgt.style && dragTgt.style.left;
			if (!left) {
				position = [(window.innerWidth - dragTgt.offsetWidth) / 2, (window.innerHeight - dragTgt.offsetHeight) / 2];
				neverMoved = true;
				dragObj.className += " my-surfaced-title-drag";
			} else {
				position = [left.substr(0, dragTgt.style.left.length - 2) - 0, dragTgt.style.top.substr(0, dragTgt.style.left.length - 2) - 0];
			}
			this.addEvent(dragObj, 'mousedown', function(e) {
				start = [e.clientX - position[0], e.clientY - position[1]];
				dragging = true;
				commonUtil.addEvent(document, 'mousemove', function(e) {
					if (dragging) {
						position = [e.clientX - start[0], e.clientY - start[1]];
						var border = [window.innerWidth - dragTgt.offsetWidth, window.innerHeight - dragTgt.offsetHeight];
						position[0] < 0 && (position[0] = 0);
						position[1] < 0 && (position[1] = 0);
						position[0] > border[0] && (position[0] = border[0]);
						position[1] > border[1] && (position[1] = border[1]);
						if (neverMoved) {
							dragTgt.className = "my-suefaced";
							neverMoved = false;
						}
						dragTgt.style.position = "fixed";
						dragTgt.style.left = position[0] + "px";
						dragTgt.style.top = position[1] + "px";
					}
				});
				commonUtil.addEvent(document, 'mouseup', function() {
					dragging = false;
				});
			});

		},
		/**
		 * 创建半透明的覆盖层
		 */
		buildCover: function() {
			var allCover = this.createEle('div', commonUtil.body, 'my-cover');
			allCover.style.height = this.body.scrollHeight + 'px';
			allCover.setAttribute('id', 'cover');
			this.addEvent(commonUtil.$('cover'), 'click', function() {
				commonUtil.removeEle([
					[commonUtil.body, 'cover'],
					[commonUtil.body, 'surfacedEle']
				]);
			});
		},
		/**
		 * 创建浮出层
		 * @param  {[string]} title     [浮出层的标题名字]
		 * @param  {[string]} content   [浮出层的内容]
		 * @param  {[boolean]} draggable [是否可拖拽]
		 */
		buildSurfaced: function(title, content, draggable) {
			var container = this.createEle('div', this.body, 'my-center my-suefaced');
			container.setAttribute('id', 'surfacedEle');
			var surfacedTitle = this.createEle('div', container, 'my-surfaced-title');
			surfacedTitle.innerHTML = title + '<span id="close">X</span>'
			var surfacedContent = this.createEle('div', container);
			surfacedContent.innerHTML = content;
			var close = this.$('close');
			this.addEvent(close, 'click', function() {
				commonUtil.removeEle([
					[commonUtil.body, 'cover'],
					[commonUtil.body, 'surfacedEle']
				]);
			});
			if (draggable) {
				commonUtil.dragEvent(container);
			}
		}
	};
	uiCmp.commonUtil = commonUtil;
})(window.mySurfaced = window.mySurfaced || {});

var surfacedUtil = {
	display: mySurfaced.commonUtil.$("display"),
};
mySurfaced.commonUtil.addEvent(surfacedUtil.display, 'click', function() {
	mySurfaced.commonUtil.buildCover();
	mySurfaced.commonUtil.buildSurfaced("登录", "好的，朕知道了", true);
});