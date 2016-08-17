var myQuery = {
    /**
     * 用于存储每一项的验证结果
     */
    result: [false, false, false, false, false],
    helpMessage: [
        "4-16个字符，中文及中文符号占2字符，英文、数字及英文符号占1字符",
        "以字母开头，长度在6~18之间，只能包含字符、数字和下划线",
        "请再输入一次密码",
        "请输入合法的邮箱",
        "请输入中国大陆内合法的手机号"
    ],
    /**
     * 获取DOM元素
     * @param id
     * @returns {Element}
     */
    getElement: function (id) {
        return document.querySelector(id);
    },
    /**
     * 添加事件
     * @param element
     * @param event
     * @param listener
     */
    addEvent: function (element, event, listener) {
        if (element.addEventListener) { //标准
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { //低版本ie
            element.attachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = listener;
        }
    },
    /**
     * 前后去空格
     * @param str
     * @returns {XML|string|void|*}
     */
    myTrim: function (str) {
        return str.replace(/^\s+|\s+$/g, "");
    },
    /**
     * 事件代理
     * @param element
     * @param tag
     * @param eventName
     * @param listener
     */
    delegateEvent: function (element, tag, eventName, listener) {
        myQuery.addEvent(element, eventName, function () {
            var event = arguments[0] || window.event,
                target = event.target || event.srcElement;
            if (target && target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    },
    /**
     * 验证用户名
     * @param message
     * @param inputBorder
     * @param str
     */
    validateUsername: function (message, inputBorder, str) {
        str = myQuery.myTrim(str).replace(/[\u0391-\uFFE5]/g, "--");//将所有中文及中文符号替换为英文符号，方便计算长度
        if (str.length < 4 || str.length > 16) {
            message.innerHTML = "输入长度为4-16位字符";
            message.style.color = "red";
            inputBorder.style.border = "2px solid red";
            myQuery.result[0] = false;
        } else {
            message.innerHTML = "输入合法";
            message.style.color = "green";
            inputBorder.style.border = "2px solid green";
            myQuery.result[0] = true;
        }
    },
    /**
     * 验证密码
     * @param message
     * @param inputBorder
     * @param str
     */
    validateUserPassword: function (message, inputBorder, str) {
        if (/^[a-zA-Z]\w{5,17}$/.test(str)) {
            message.innerHTML = "输入合法";
            message.style.color = "green";
            inputBorder.style.border = "2px solid green";
            myQuery.result[1] = true;
        } else {
            message.innerHTML = "密码不符合规范，请重新输入";
            message.style.color = "red";
            inputBorder.style.border = "2px solid red";
            myQuery.result[1] = false;
        }
    },
    /**
     * 验证邮件地址
     * @param message
     * @param inputBorder
     * @param str
     */
    validateUserEmail: function (message, inputBorder, str) {
        if (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str)) {
            message.innerHTML = "输入合法";
            message.style.color = "green";
            inputBorder.style.border = "2px solid green";
            myQuery.result[3] = true;
        } else {
            message.innerHTML = "邮箱不符合规范，请重新输入";
            message.style.color = "red";
            inputBorder.style.border = "2px solid red";
            myQuery.result[3] = false;
        }
    },
    /**
     * 验证手机号
     * @param message
     * @param inputBorder
     * @param str
     */
    validateUserPhone: function (message, inputBorder, str) {
        if (/1[358][0-9]{9}/.test(str)) {
            message.innerHTML = "输入合法";
            message.style.color = "green";
            inputBorder.style.border = "2px solid green";
            myQuery.result[4] = true;
        } else {
            message.innerHTML = "手机号码不符合规范，请重新输入";
            message.style.color = "red";
            inputBorder.style.border = "2px solid red";
            myQuery.result[4] = false;
        }
    }
};
var get_user_message = myQuery.getElement("#get_user_message");
var arrInput = document.getElementsByTagName("input");
/**
 * 为每个input添加获得焦点事件，这里有个问题，如果给form或者table添加事件代理则无效
 */
for (var i = 0, len = arrInput.length; i < len; i++) {
    (function (k) {
        myQuery.addEvent(arrInput[i], "focus", function () {
            myQuery.getElement("#" + this.dataset.help).innerHTML = myQuery.helpMessage[k];
            myQuery.getElement("#" + this.dataset.help).style.color = "lightgray";
            this.style.border = "2px solid gray";
        });
    })(i);
    myQuery.addEvent(arrInput[i], "blur", check);
}
/**
 * 检测输入
 */
function check() {
    if (this.name === "validate_username") {
        myQuery.validateUsername(myQuery.getElement("#" + this.dataset.help), this, this.value);
    } else if (this.name === "validate_password") {
        myQuery.validateUserPassword(myQuery.getElement("#" + this.dataset.help), this, this.value);
    } else if (this.name === "validate_repeat_password") {
        /**
         * 对于重复检测密码，先对密码格式进行检测，然后才对是否相同进行检测
         */
        if (/^[a-zA-Z]\w{5,17}$/.test(this.value)) {
            if (this.value !== myQuery.getElement("#validate_password").value) {
                myQuery.getElement("#" + this.dataset.help).innerHTML = "两次密码输入不一致，请重新输入！";
                myQuery.getElement("#" + this.dataset.help).style.color = "red";
                this.style.border = "2px solid red";
                myQuery.result[2] = false;
            } else {
                myQuery.getElement("#" + this.dataset.help).innerHTML = "输入合法";
                myQuery.getElement("#" + this.dataset.help).style.color = "green";
                this.style.border = "2px solid green";
                myQuery.result[2] = true;
            }
        } else {
            myQuery.getElement("#" + this.dataset.help).innerHTML = "密码不符合规范，请重新输入";
            myQuery.getElement("#" + this.dataset.help).style.color = "red";
            this.style.border = "2px solid red";
            myQuery.result[2] = false;
        }
    } else if (this.name === "validate_email") {
        myQuery.validateUserEmail(myQuery.getElement("#" + this.dataset.help), this, this.value);
    } else {
        myQuery.validateUserPhone(myQuery.getElement("#" + this.dataset.help), this, this.value);
    }
}
/**
 * 给提交按钮添加点击事件
 */
myQuery.addEvent(myQuery.getElement("#submit"), "click", function () {
    /**
     * 点击提交按钮的时候再对所有输入进行校验
     */
    for (i = 0; i < len; i++) {
        check.call(arrInput[i]);
    }
    /**
     * 检测结果是否全部通过
     */
    for (i = 0; i < myQuery.result.length; i++) {
        if (myQuery.result[i] === false) {
            alert("提交失败，请检查您的输入");
            return;
        }
    }
    alert("提交成功");
});