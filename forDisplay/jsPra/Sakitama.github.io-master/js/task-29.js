var validate = document.getElementById("validate");
var message = document.getElementById("message");
var confirm = document.getElementById("confirm");
var validateInput = function () {
    var value = validate.value;
    if (value.length === 0) {
        showMessage(message, 0, "red");
    } else {
        value = value.replace(/^\s+|\s$/g, "").replace(/[\u0391-\uFFE5]/g, "--");//将所有中文及中文符号替换为英文符号，方便计算长度
        console.log(value);
        if (value.length < 4 || value.length > 16) {
            showMessage(message, 1, "red");
        } else {
            showMessage(message, 2, "green");
        }
    }
};
var showMessage = function (obj, result, textColor) {
    if (result === 0) {
        obj.innerHTML = "输入为空";
        obj.style.color = textColor;
        validate.style.border = "1px solid " + textColor;
    }
    if (result === 1) {
        obj.innerHTML = "长度不符合要求，输入范围4-16位，中文及中文符号占2位，英文、数字和英文符号占1位";
        obj.style.color = textColor;
        validate.style.border = "1px solid " + textColor;
    }
    if (result === 2) {
        obj.innerHTML = "输入格式正确";
        obj.style.color = textColor;
        validate.style.border = "1px solid " + textColor;
    }
};
var addEvent = function (element, event, listener) {
    if (element.addEventListener) { //标准
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) { //低版本ie
        element.attachEvent("on" + event, listener);
    } else { //都不行的情况
        element["on" + event] = listener;
    }
};
var deleteMessage = function () {
    message.innerHTML = "";
    validate.style.border = "1px solid gray";
};
addEvent(confirm, "click", validateInput);
addEvent(validate, "focus", deleteMessage);//输入框每次获得焦点清空提示内容并恢复边框颜色