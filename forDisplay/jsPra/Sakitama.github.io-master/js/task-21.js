window.onload = function () {
    function $(id) {
        return document.getElementById(id);
    }
    /*
    添加事件，考虑兼容性
     */
    function addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
    /*
    事件代理
     */
    function delegateEvent(element, tag, eventName, listener) {
        addEvent(element, eventName, function () {
            var event = arguments[0] || window.event,
                target = event.target || event.srcElement;
            if (target && target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    }
    /*
    获取事件对象，考虑兼容性
     */
    function getEvent(ev) {
        return ev ? ev : window.event;
    }
    var tag = $("tagInput");
    var display = $("display");
    var arrLi = display.getElementsByTagName("li");
    var text = $("text");
    var reset = $("reset-left");
    var resetRight = $("reset-right");
    var hobby = $("hobby");
    var hobbyList = $("hobby-display");
    var hobbyLi = hobbyList.getElementsByTagName("li");
    var num = [];
    var hobbyNum = [];
    /*
    重置功能
     */
    addEvent(reset, "click", function () {
        tag.value="";
        display.innerHTML = "";
        num = [];
    });
    /*
     按下回车、全（半）角逗号或者空格时触发的事件
     */
    addEvent(tag, "keyup", function (ev) {
        var li = null,
            str = tag.value;
        ev = getEvent(ev);
        /*
        按键抬起的时候获取当前输入按键的keyCode值，由于全角逗号和其他非控制类字符的keyCode值都是229，所以改用正则来判断
         */
        if(/，$/.test(str) || ev.keyCode === 13 || ev.keyCode === 32 || ev.keyCode === 188){
            var newTag = str.match(/^[^,，\s]*/)[0];
            if(num.indexOf(newTag) === -1 && newTag !== ""){
                num.push(newTag);
                if(num.length >= 10){
                    num.shift();
                    display.removeChild(display.firstChild);
                }
                li = document.createElement("li");
                li.className = "current";
                li.innerHTML = newTag;
                display.appendChild(li);
            }
            tag.value="";
        }
    });
    /*
     *使用事件代理，当鼠标移入、移出和点击事件在ul上发生时，调用相应的事件处理函数
     */
    delegateEvent(display, "li", "mouseover", mouseOverTag);
    delegateEvent(display, "li", "click", removeTag);
    delegateEvent(display, "li", "mouseout", mouseOutTag);
    function mouseOverTag() {
        this.source = this.innerHTML;
        this.innerHTML = "点击删除" + this.innerHTML;
        this.className = "mouseover";
    }
    function mouseOutTag() {
        this.innerHTML = this.source;
        this.className = "";
    }
    function removeTag() {
        for (var i = 0, len = arrLi.length; i < len; i++) {
            arrLi[i].index = i;
        }
        display.removeChild(display.childNodes[parseInt(this.index)]);
        num.splice(parseInt(this.index), 1);
    }
    /*
    将所有非数字、英文字母和中文的字符全部用空格替换，之后再以空格分割成数组
    */
    function getResult(str) {
        return str.replace(/[^\d\u4e00-\u9fa5a-zA-Z]/g, " ").split(" ");
    }
    addEvent(hobby, "click", function () {
        var str = text.value;
        if (str !== "") {
            var result = getResult(str);
            for (var i = 0; i < result.length; i++) {
                if (hobbyNum.indexOf(result[i]) === -1 && result[i] !== "") {
                    if (hobbyLi.length >= 10) {
                        hobbyNum.shift();
                        hobbyList.removeChild(hobbyList.firstChild);
                    }
                    hobbyNum.push(result[i]);
                    li = document.createElement("li");
                    li.innerHTML = result[i];
                    hobbyList.appendChild(li);
                }
            }
            text.value = "";
        } else {
            alert("输入不能为空！");
        }
    });
    addEvent(resetRight, "click", function () {
        text.value = "";
        hobbyList.innerHTML = "";
        hobbyNum = [];
    });
};