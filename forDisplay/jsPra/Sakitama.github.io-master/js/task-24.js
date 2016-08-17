window.onload = function () {
    (function (window, undefined) {
        var list = document.getElementsByClassName("list")[0];
        var currentClick = null;
        var search = $("search");
        var traversalResult= [];
        var text = "";
        var found = false;
        var head = null;
        var timer = null;
        function $(id) {
            return document.getElementById(id);
        }
        $.addEvent = function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        };
        $.delegateEvent = function (element, tag, eventName, listener) {
            $.addEvent(element, eventName, function () {
                var event = arguments[0] || window.event,
                    target = event.target || event.srcElement;
                if (target && target.tagName === tag.toUpperCase()) {
                    listener.call(target, event);
                }
            });
        };
        /*
        增加、删除、展开和隐藏功能
         */
        $.delegateEvent(list, "span", "click", spanFunction);
        function spanFunction() {
            if (this.className === "unfold") {
                var i = 0,
                    arrLi = this.parentNode.parentNode.getElementsByTagName("li"),
                    len = arrLi.length,
                    firstLevelChildren = [];
                for (; i < len; i++) {
                    if (arrLi[i].parentNode.parentNode === this.parentNode.parentNode) {
                        firstLevelChildren.push(arrLi[i]);//只获取当前节点的儿子节点，也就是每个li下第一层li
                    }
                }
                i = 0;
                len = firstLevelChildren.length;
                if (len > 0) {//展开和隐藏按钮的改变
                    if (this.innerHTML === "v") {
                        this.innerHTML = ">";
                        for (; i < len; i++) {
                            firstLevelChildren[i].style.display = "none";
                        }
                    } else {
                        this.innerHTML = "v";
                        for (; i < len; i++) {
                            firstLevelChildren[i].style.display = "block";
                        }
                    }
                } else {
                    alert("当前目录下无内容");
                }
            } else if (this.className === "delete") {//删除功能
                var clickedElem = document.querySelector('.clicked');
                clickedElem.parentNode.parentNode.removeChild(clickedElem.parentNode);
            } else {
                var clickedElem = document.querySelector('.clicked');
                var typeName = prompt("请输入您需要添加的内容");
                if (typeName !== null && typeName !== "") {
                    var li = document.createElement("li");
                    li.innerHTML = "<p>" + typeName + "<span class='add'>+</span><span class='delete'>x</span><span class='unfold'>v</span></p>";
                    if (clickedElem.nextElementSibling) {//如果当前结点的兄弟节点ul存在，则直接插入
                        clickedElem.nextElementSibling.appendChild(li);
                    } else {//不存在则创建一个ul
                        var ul = document.createElement("ul");
                        ul.appendChild(li);
                        clickedElem.parentNode.appendChild(ul);
                    }
                }
                if (typeName === "") {
                    alert("输入不能为空");
                }
            }
        }
        /*
        控制span的消失和出现
         */
        function spanDisplay(obj, value) {
            var arrSpan = obj.getElementsByTagName("span"),
                i = 0,
                len = arrSpan.length;
            for (; i < len; i++) {
                arrSpan[i].style.display = value;
            }
        }
        /*
        这三个函数分别是判断class名是否存在、添加class和删除某个class
         */
        function hasClass(element, sClass) {
            return element.className.match(new RegExp("(\\s|^)" + sClass + "(\\s|$)"));
        }
        function addClass(element, newClassName) {
            if (!hasClass(element, newClassName)) {
                if (element.className == "") {
                    element.className = newClassName;
                } else {
                    element.className += " " + newClassName;
                }
            }
        }
        function removeClass(element, oldClassName) {
            if (hasClass(element, oldClassName)) {
                var loc = element.className.indexOf(oldClassName);
                if (loc == 0 || loc + oldClassName.length == element.className.length) {//判断该class是第一个还是最后一个
                    element.className = element.className.replace(new RegExp("(\\s|^)" + oldClassName + "(\\s|$)"), "");//两边的则用空字符串替换
                } else {
                    element.className = element.className.replace(new RegExp("(\\s|^)" + oldClassName + "(\\s|$)"), " ");//中间的则用空格替换
                }
            }
        }
        /*
         点击改变背景颜色和控制按钮的出现和消失
         */
        $.delegateEvent(list, "p", "click", changeColor);
        function changeColor() {
            var arrSpan = this.getElementsByTagName("span"),
                i = 0,
                len = arrSpan.length;
            if (currentClick) {
                if (this === currentClick) {
                    removeClass(this, "clicked");
                    spanDisplay(this, "none");
                    currentClick = null;
                } else {
                    removeClass(currentClick, "clicked");
                    spanDisplay(currentClick, "none");
                    addClass(this, "clicked");
                    spanDisplay(this, "block");
                    currentClick = this;
                }
            } else {
                addClass(this, "clicked");
                spanDisplay(this, "block");
                currentClick = this;
            }
        }
        /*
         查询功能
         */
        $.addEvent(search, "keyup", searchStart);
        function searchStart() {
            var event = arguments[0] ? arguments[0] : window.event;
            if (event.keyCode === 13) {//输入回车进行查询
                BFSResult(list, "p");
            }
        }
        function reset() {
            if (currentClick) {//查找之前如果有点击状态下的项目，则先去除掉样式
                removeClass(currentClick, "clicked");
                spanDisplay(currentClick, "none");
            }
            if (traversalResult.length > 0) { //如果队列非空即正在遍历
                found = false;
                text = "";
                head.style.backgroundColor = "#fff";//清除残留
                traversalResult = []; //清空队列
                clearTimeout(timer); //清除定时器
            }
        }
        function BFSResult(node, value) {//将特定的元素节点入栈
            reset();
            (function BFS(node) {
                var queue = [];
                var p = null;
                if(node) {
                    queue.push(node);
                }
                while (queue.length > 0) {
                    p = queue.shift();
                    if (p.tagName.toLowerCase() === value) {
                        traversalResult.push(p);
                    }
                    if (p.firstElementChild) {
                        queue.push(p.firstElementChild);
                        p = p.firstElementChild;
                        while (p.nextElementSibling) {
                            queue.push(p.nextElementSibling);
                            p = p.nextElementSibling;
                        }
                    }
                }
            })(node);
            searchShow();
        }
        function trim(str) {//去空格
            return str.replace(/^\s+|\s+$/g, "");
        }
        function searchShow() {
            if (traversalResult.length === 0 && !found) {
                alert("没有找到");
                return;
            }
            head = traversalResult.shift(); //出队
            if (head) {
                text = head.firstChild.nodeValue;
                if (trim(text) === search.value) {
                    addClass(head, "clicked");
                    spanDisplay(head, "block");
                    currentClick = head;
                    alert("Bingo！找到了");
                    found = true;
                    return;
                } else {
                    addClass(head, "clicked");
                    spanDisplay(head, "block");
                    timer = setTimeout(function () {
                        removeClass(head, "clicked");//1秒后节点的浅灰色变为白色
                        spanDisplay(head, "none");
                        searchShow(); //递归调用，使要显示的节点不停出队显示，直至为空
                    }, 800);
                }
            }
        }
        /*
        输入框获得焦点清空内容
         */
        $.addEvent(search, "focus", function () {
            this.value = "";
        });
    })(window);
};