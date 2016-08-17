window.onload = function () {
    function $(id) {
        return document.getElementById(id);
    }
    function addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
    var text = $("text");
    var leftIn = $("left-in");
    var leftOut = $("left-out");
    var rightIn = $("right-in");
    var rightOut = $("right-out");
    var display = $("display");
    var arrLi = display.getElementsByTagName("li");
    var search = $("search");
    var btn = $("search-button");
    var reset = $("reset");
    var num = [];

    function getResult(str) {
        return str.replace(/[^\d\u4e00-\u9fa5a-zA-Z]+/g, " ").split(" ");
    }
    addEvent(leftIn, "click", function () {
        if (text.value !== "") {
            var result = getResult(text.value);
            for (var i = result.length - 1; i >= 0; i--) {
                num.unshift(result[i]);
                var li = document.createElement("li");
                li.innerHTML = result[i];
                display.insertBefore(li, display.firstChild);
            }
        } else {
            alert("输入不能为空！");
        }
    });
    addEvent(leftOut, "click", function () {
        if (display.firstChild !== null) {
            num.shift();
            display.removeChild(display.firstChild);
        } else {
            alert("已经空了，没有可以移除的了！");
        }
    });
    addEvent(rightIn, "click", function () {
        if (text.value !== "") {
            var result = getResult(text.value);
            for (var i = 0; i < result.length; i++) {
                num.push(result[i]);
                var li = document.createElement("li");
                li.innerHTML = result[i];
                display.appendChild(li);
            }
        } else {
            alert("输入不能为空！");
        }
    });
    addEvent(rightOut, "click", function () {
        if (display.lastChild !== null) {
            num.pop();
            display.removeChild(display.lastChild);
        } else {
            alert("已经空了，没有可以移除的了！");
        }
    });
    addEvent(btn, "click", function () {
        var pos,
            i,
            j;
        if (search.value !== "") {
            var find = search.value.replace(/[^\d\u4e00-\u9fa5a-zA-Z]+/g, " ").split(" ");
            for (i = 0, len = find.length; i< len; i++) {
                for (j = 0, numLength = num.length; j < numLength; j++) {
                    pos = num[j].search(find[i]);
                    if (pos >= 0) {
                        arrLi[j].style.background = "yellow";
                    }
                }
            }
        } else {
            alert("请输入想要查询的内容！");
        }
    });
    addEvent(reset, "click", function () {
        display.innerHTML = "";
        num = [];
    });
};