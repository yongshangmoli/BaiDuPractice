(function (window, undefined) {
    var basicFunction = {};
    /**
     获取时间
     */
    basicFunction.getCurrentTime = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    };
    /**
     获取元素
     */
    basicFunction.getElement = function (selector) {
        return document.querySelector(selector);
    };
    /**
     控制台和消息窗体允许拖拽
     */
    var console = basicFunction.getElement("#console");
    var control = basicFunction.getElement("#control");
    basicFunction.drag = function (obj) {
        var timer = null,
            disY = 0,
            disX = 0,
            preX,
            preY,
            iSpeedX = 0,
            iSpeedY = 0;
        obj.onmousedown = function (ev) {
            var that = this,
                x = ev || window.event,
            //clientX 事件属性返回当事件被触发时鼠标指针相对于浏览器页面（或客户区）的水平坐标。客户区指的是当前窗口
                disY = x.clientY - that.offsetTop,
                disX = x.clientX - that.offsetLeft,
                preX = x.clientX,
                preY = x.clientY;
            clearInterval(timer);//运动过程中拖拽会出现闪动问题，解决方法是如果在运动过程中出现拖拽则清除运动的定时器
            document.onmousemove = function (ev) {
                var x = ev || window.event,
                    tempX = x.clientX - disX,
                    tempY = x.clientY - disY;
                //拖拽时不能超过视窗边界
                if (tempX > document.documentElement.clientWidth - obj.offsetWidth) {
                    tempX = document.documentElement.clientWidth - obj.offsetWidth;
                } else if (tempX < 0) {
                    tempX = 0;
                }
                if (tempY > document.documentElement.clientHeight - obj.offsetHeight) {
                    tempY = document.documentElement.clientHeight - obj.offsetHeight;
                } else if (tempY < 0) {
                    tempY = 0;
                }
                that.style.left = tempX + "px";
                that.style.top = tempY + "px";
                //获取最后两点的X坐标和Y坐标之间的差值
                iSpeedX = x.clientX - preX;
                iSpeedY = x.clientY - preY;
                preX = x.clientX;
                preY = x.clientY;
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            //return false;//如果阻止默认行为的话，将导致select无法显示下拉框
        };
    };
    basicFunction.drag(console);
    basicFunction.drag(control);
    /**
     消息窗体显示消息
     */
    var consoleText = basicFunction.getElement("#console-text");
    basicFunction.showMessage = function (message, textColor) {
        var p = document.createElement("p");
        p.innerHTML = basicFunction.getCurrentTime() + " " + message;
        p.style.color = textColor;
        if (consoleText.firstElementChild) {
            consoleText.insertBefore(p, consoleText.firstElementChild);
        } else {
            consoleText.appendChild(p);
        }
    };
    /**
     为了方便以后使用数据，使用JS动态添加选项
     */
    var systemType = {
        powerType: [
            {type: "前进号", deg: 3, consumeEnergy: 5},
            {type: "奔腾号", deg: 5, consumeEnergy: 7},
            {type: "超越号", deg: 8, consumeEnergy: 9}
        ],
        energyType: [
            {type: "劲量型", solarEnergy: 2},
            {type: "光能型", solarEnergy: 3},
            {type: "永久型", solarEnergy: 4}
        ]
    };
    var controlMain = basicFunction.getElement("#control-main");
    var arrSelect = controlMain.getElementsByTagName("select");
    var option = null;
    for(var i = 0; i < arrSelect.length; i++) {
        if(arrSelect[i].dataset.type == "powerSystem") {
            for(var j = 0; j < systemType.powerType.length; j++) {
                option = document.createElement("option");
                option.setAttribute("value", j.toString());
                option.innerHTML = systemType.powerType[j].type +
                    "（速率: " + systemType.powerType[j].deg +
                    "deg/s，能耗" + systemType.powerType[j].consumeEnergy + "%/s）";
                arrSelect[i].appendChild(option);
            }
        } else {
            for(var j = 0; j < systemType.energyType.length; j++) {
                option = document.createElement("option");
                option.setAttribute("value", j.toString());
                option.innerHTML = systemType.energyType[j].type +
                    "（补充能源速度" + systemType.energyType[j].solarEnergy + "%/s）";
                arrSelect[i].appendChild(option);
            }
        }
    }
    /**
     按钮事件
     */
    basicFunction.buttonClick = function () {
        var orbit = parseInt(this.parentNode.dataset.id);
        var message = this.dataset.type;
        switch(message) {
            case "create":
                var powerSystem = this.previousElementSibling.previousElementSibling;//获取动力类型下拉框
                var energySystem = this.previousElementSibling;//获取能量类型下拉框
                if(this.dataset.status === "create") {
                    commander.createSpaceship(orbit, parseInt(powerSystem.value), parseInt(energySystem.value));//轨道号，值为0、1和2；动力系统，值为0，1和2；能量系统，值为0，1和2
                    this.dataset.status = "created";
                    this.innerHTML = "自爆销毁";
                    this.nextElementSibling.disabled = false;
                    powerSystem.disabled = true;
                    energySystem.disabled = true;
                } else {
                    commander.spaceshipDestroy(orbit);
                    this.dataset.status = "create";
                    this.innerHTML = "创建飞船";
                    this.nextElementSibling.disabled = true;
                    this.nextElementSibling.dataset.status = "start";
                    this.nextElementSibling.innerHTML = "飞行";
                    powerSystem.disabled = false;
                    energySystem.disabled = false;
                }
                break;
            default:
                if(this.dataset.status === "start") {
                    commander.startNavigate(orbit);
                    this.dataset.status = "stop";
                    this.innerHTML = "停止";
                } else {
                    commander.stopNavigate(orbit);
                    this.dataset.status = "start";
                    this.innerHTML = "飞行";
                }
                break;
        }
    };
    /**
     添加事件
     */
    basicFunction.addEvent = function (element, event, listener) {
        if (element.addEventListener) { //标准
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { //低版本ie
            element.attachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = listener;
        }
    };
    /**
     事件代理
     */
    basicFunction.delegateEvent = function (element, tag, eventName, listener) {
        basicFunction.addEvent(element, eventName, function () {
            var event = arguments[0] || window.event,
                target = event.target || event.srcElement;
            if (target && target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    };
    /**
     为control-main添加事件代理
     */
    basicFunction.delegateEvent(controlMain, "button", "click", basicFunction.buttonClick);
    /**
     返回接口
     */
    window.basicFunction = basicFunction;
    window.systemType = systemType;
})(window);