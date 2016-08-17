window.onload = function () {
    function $(id) {
        return document.getElementById(id);
    }
    var text = $("text");
    var leftIn = $("left-in");
    var leftOut = $("left-out");
    var rightIn = $("right-in");
    var rightOut = $("right-out");
    var display = $("display");
    var arrLi = display.getElementsByTagName("li");
    var sort = $("sort");
    var reset = $("reset");
    var random = $("random");
    var num = [];
    var count = 0;
    var complete = false;

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
        if (text.value !== "") {
            if (!/^\d+$/.test(text.value) || parseInt(text.value) < 10 || parseInt(text.value) > 100) {
                alert("请输入10-100以内的数字！");
                text.value = "";
            } else {
                if (count < 60) {
                    num.unshift(parseInt(text.value));
                    var li = document.createElement("li");
                    li.style.height = parseInt(text.value) + "%";
                    li.innerHTML = text.value;
                    count++;
                    display.insertBefore(li, display.firstChild);
                } else {
                    alert("输入数据太多啦！不能超过60个！")
                }
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
            if (!/^\d+$/.test(text.value) || parseInt(text.value) < 10 || parseInt(text.value) > 100) {
                alert("请输入10-100以内的数字！");
                text.value = "";
            } else {
                if (count < 60) {
                    num.push(parseInt(text.value));
                    var li = document.createElement("li");
                    li.style.height = parseInt(text.value) + "%";
                    li.innerHTML = text.value;
                    count++;
                    display.appendChild(li);
                } else {
                    alert("输入数据太多啦！不能超过60个！")
                }
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

    addEvent(text, "focus", function () {
        text.value = "";
    });

    addEvent(random, "click", function () {
        randomQueue();
    });

    addEvent(reset, "click", function () {
        text.value = "";
        num = [];
        display.innerHTML = "";
        complete = false;
        count = 0;
    });

    addEvent(sort, "click", function () {
        if (!complete) {
            if (arrLi[0]) {
                startBubbleSort(num);
                complete = true;
            } else {
                alert("通过左侧入或者右侧入输入一些要排序的数据！");
            }
        } else {
            alert("请点击重置数据按钮才能开始新的排序！");
        }
    });

    function flashDOM(array) {//刷新DOM
        var html = "";
        for (var i = 0; i < array.length; i++) {
            html += "<li style='height: " + array[i] + "%; background: " + randomColor() + ";'><p>" + array[i] + "</p></li>";
        }
        display.innerHTML = html;
    }

    function startBubbleSort(array) {//开始冒泡排序
        var i = 0,
            j = 1,
            temp,
            len = array.length,
            timer = null;
        timer = setInterval(run, 30);//每次调用run()，如果发现有符合条件的则交换数值
        function run() {
            if (i < len) {
                if (j < len) {
                    if (array[i] > array[j]) {
                        temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                        arrLi[i].style.height = array[i] + "%";
                        arrLi[i].innerHTML = "<p>" + array[i] + "</p>";
                        arrLi[j].style.height = array[j] + "%";
                        arrLi[j].innerHTML = "<p>" + array[j] + "</p>";
                    }
                    j++;
                } else {
                    i++;
                    j = i + 1;
                }
            } else {
                clearInterval(timer);
                return;
            }
        }
    }

    function randomColor() {//生产随机颜色
        var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        if (rand.length === 6) {
            return "#" + rand;
        } else {
            return randomColor();
        }
    }

    function randomQueue() {//生成随机数据
        num= [];
        for(var i = 0; i < 60; i++) {
            num.push(parseInt(Math.random() * 91) + 10);
        }
        count = 60;
        flashDOM(num);
    }

};
