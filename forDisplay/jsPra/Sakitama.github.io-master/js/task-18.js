window.onload = function () {
    var text = document.getElementById("text");
    var leftIn = document.getElementById("left-in");
    var leftOut = document.getElementById("left-out");
    var rightIn = document.getElementById("right-in");
    var rightOut = document.getElementById("right-out");
    var display = document.getElementById("display");
    function addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
    addEvent(leftIn, "click", function () {
        var li = document.createElement("li");
        li.innerHTML = text.value;
        display.insertBefore(li, display.firstChild);
    });
    addEvent(leftOut, "click", function () {
        if (display.firstChild !== null) {
            display.removeChild(display.firstChild);
        } else {
            alert("已经空了，没有可以移除的了！");
        }
    });
    addEvent(rightIn, "click", function () {
        var li = document.createElement("li");
        li.innerHTML = text.value;
        display.appendChild(li);
    });
    addEvent(rightOut, "click", function () {
        if (display.lastChild !== null) {
            display.removeChild(display.lastChild);
        } else {
            alert("已经空了，没有可以移除的了！");
        }
    });
    addEvent(text, "focus", function () {
       text.value = "";
    });
};