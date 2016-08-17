/**
 * 构造器模式
 * @param name
 * @param type
 * @param func
 * @param rules
 * @param success
 * @param fail
 * @constructor
 */
function FormList(name, type, func, rules) {
    this.label = name;
    this.type = type;
    this.validator = func;
    this.rules = rules;
};
/**
 * 模块模式对检查功能进行封装
 * @type {{checkName, checkPassword, checkAgain, checkEmail, checkPhone}}
 */
var check = (function () {
    /**
     * 用来存储每个表单的提示信息
     */
    var nameHelpMessageArr = ["名称不能为空", "名称不能包含除中文、英文及数字以外的字符", "名称长度过短", "名称长度过长", "名称可用"]
    var passwordHelpMessageArr = ["密码不能为空", "密码不能包含除英文及数字以外的字符", "密码长度过短", "密码长度过长", "密码可用"]
    var againHelpMessageArr = ["俩次密码不相同", "请正确输入第一次密码", "密码正确"];
    var emailHelpMessageArr = ["邮箱不能为空", "邮箱格式错误", "邮箱格式正确"];
    var phoneHelpMessageArr = ["手机号码不能为空", "手机号码格式错误", "手机号码格式正确"];
    var nowPassword = "";
    var passwordRight = false;
    /**
     * 返回模块
     **/
    return {
        checkName: function (str) {
            var count = 0;
            if(str === "") {
                return [nameHelpMessageArr[0], false, "red"];
            } else if (/[^0-9A-Za-z\u4e00-\u9fa5]/.test(str)) {
                return [nameHelpMessageArr[1], false, "red"];
            } else {
                for (var i = 0; i < str.length; i++) {
                    if(/[A-Za-z0-9]/.test(str[i])) {
                        count++;
                    }
                    else {
                        count += 2;
                    }
                }
                if (count < 4) {
                    return [nameHelpMessageArr[2], false, "red"];
                }
                if(count > 16) {
                    return [nameHelpMessageArr[3], false, "red"];
                }
            }
            return [nameHelpMessageArr[4], true, "green"];
        },
        checkPassword: function (str) {
            var count = 0;
            passwordRight = false;
            if (str === "") {
                return [passwordHelpMessageArr[0], false, "red"];
            } else if (/[^0-9A-Za-z]/.test(str)) {
                return [passwordHelpMessageArr[1], false, "red"];
            } else {
                if (str.length < 8) {
                    return [passwordHelpMessageArr[2], false, "red"];
                } else if (str.length > 20) {
                    return [passwordHelpMessageArr[3], false, "red"];
                } else {
                    passwordRight = true;
                    nowPassword = str;
                    return [passwordHelpMessageArr[4], true, "green"];
                }
            }
        },
        checkPasswordRepeat: function (str) {
            if (passwordRight) {
                if (nowPassword === str) {
                    return [againHelpMessageArr[2], true, "green"];
                } else {
                    return [againHelpMessageArr[0], false, "red"];
                }
            } else {
                return [againHelpMessageArr[1], false, "red"];
            }
        },
        checkEmail: function (str) {
            if(str === "") {
                return [emailHelpMessageArr[0], false, "red"];
            } else if (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str)) {
                return [emailHelpMessageArr[2], true, "green"];
            } else {
                return [emailHelpMessageArr[1], false, "red"];
            }
        },
        checkPhone: function (str) {
            if (str === "") {
                return [phoneHelpMessageArr[0], false, "red"];
            } else if (/1[358][0-9]{9}/.test(str)) {
                return [phoneHelpMessageArr[2], true, "green"];
            } else {
                return [phoneHelpMessageArr[1], false, "red"];
            }
        }
    };
})();
/**
 * 实例
 * @type {FormList}
 */
var nameInput = new FormList("name", "text", check.checkName, "必填，长度为4~16个字符，只允许输入中文、英文字母和数字,中文占2字符");
var passwordInput = new FormList("password", "password", check.checkPassword, "必填，长度为8~20个字符，只允许输入英文字母和数字");
var passwordRepeatInput = new FormList("passwordRepeat", "password", check.checkPasswordRepeat, "重复输入密码,俩次密码需相同");
var emailInput = new FormList("email", "email", check.checkEmail, "必填，请输入正确的邮箱地址");
var phoneInput = new FormList("phone", "text", check.checkPhone, "必填，请输入中国大陆内合法的11位手机号码");
/**
 * 将英文label转化为中文
 * @type {{name: string, password: string, passwordAgain: string, email: string, phone: string}}
 */
var labelObj = {
    "name":"名称",
    "password":"密码",
    "passwordRepeat":"确认密码",
    "email":"电子邮箱",
    "phone":"手机号码"
};
/**
 * 添加表单
 * @param obj
 * @returns {string}
 */
function addFrom(obj) {
    return "<tr><td><label for=\"" + obj.label + "\">" + labelObj[obj.label] + "</label></td><td><input type=\"" + obj.type + "\" placeholder=\"请输入" + labelObj[obj.label] + "\" id=\"" + obj.label + "\" name=\"" + obj.label + "\"><span id=\"" + obj.label + "Warn\"></span></td></tr>";
}
/**
 * 跨浏览器添加focus和blur事件
 * @param element
 * @param event
 * @param listener
 */
function addFocusAndBlurEvent(element, eventName, listener) {
    if (element.addEventListener) { //标准
        element.addEventListener(eventName, listener, true);
    } else if (element.attachEvent) { //IE8及以下不支持DOM2级事件
        /**
         * (eventName === "focus" ? "in" : "out")要加括号，运算符优先级问题
         */
        element.attachEvent("onfocus" + (eventName === "focus" ? "in" : "out"), listener);
    } else {
        element["onfocus" + (eventName === "focus" ? "in" : "out")] = listener;
    }
}
/**
 * 事件代理
 * @param element
 * @param tag
 * @param eventName
 * @param listener
 */
function delegateEvent(element, tag, eventName, listener) {
    addFocusAndBlurEvent(element, eventName, function (ev) {
        var event = ev || window.event,
            target = event.target || event.srcElement;
        if (target && target.tagName === tag.toUpperCase()) {
            listener.call(target, event);
        }
    });
}
/**
 * 获取元素
 * @param id
 * @returns {Element|HTMLElement}
 */
function $(id) {
    return document.getElementById(id);
}
var result = [false, false, false, false, false];//用于存储结果
var nameChose = $("nameList");
var passwordChose = $("passwordList");
var emailChose = $("emailList");
var phoneChose = $("phoneList");
var product = $("product");
var type = $("type");
var print = $("print");
var strObj = [
    [nameInput],
    [passwordInput, passwordRepeatInput],
    [emailInput],
    [phoneInput]
];
/**
 * 为生成表单按钮添加事件
 */
function addClickEvent(element, listener) {
    if (element.addEventListener) { //标准
        element.addEventListener("click", listener, false);
    } else if (element.attachEvent) { //IE8及以下不支持DOM2级事件
        element.attachEvent("onclick", listener);
    } else { //都不行的情况
        element["onclick"] = listener;
    }
}
addClickEvent(product, productForm);
function productForm() {
    /**
     * var hack = $("hack");
     * 这段代码如果放在productForm()外面，因为每次更新内容都是替换了tbody，所以下一次运行productForm()会报错
     */
    var hack = $("hack");
    var formArr = [nameChose, passwordChose, emailChose, phoneChose];
    var str = "",
        arr = [];
    for(var i = 0; i < formArr.length; i++){
        /**
         * 如果当前复选框被选中
         */
        if(formArr[i].checked) {
            arr.push(strObj[i]);
        }
    }
    for(var j = 0; j < arr.length; j++){
        for(var k = 0; k < arr[j].length; k++){
            str += addFrom(arr[j][k]);
        }
    }
    str += "<tr><td></td><td><button type='submit' id='submit'>提交</button></td></tr>";
    setTBodyInnerHTML(hack, str);
    var submit = $("submit");
    addClickEvent(submit, function () {
        for (var i = 0; i < result.length; i++) {
            if (result[i] === false) {
                alert("提交失败");
                return;
            }
        }
        alert("提交成功");
    });
}
/**
 * IE6、7、8和9中的tbody的innerHTML不支持直接赋值
 * @param tbody
 * @param html
 */
function setTBodyInnerHTML(tbody, html) {
    var div = document.createElement("div");
    div.innerHTML = "<table><tbody id='hack'>" + html + "</tbody></table>";
    tbody.parentNode.replaceChild(div.firstChild.firstChild, tbody);//IE8及以下不支持firstElementChild，由于这里没有多余空格，所以不用考虑文本节点的影响
}
/**
 * 为table元素添加事件代理，代理来自input元素的获取、失去焦点事件
 */
delegateEvent(print, "input", "focus", showHelpMessage);
function showHelpMessage() {
    /**
     * IE8及以下不支持nextElementSibling
     */
    var p = this.nextSibling;
    while (p) {
        if (p.nodeType === 1) {
            break;
        }
        p = p.nextSibling;
    }
    switch (this.name) {
        case "name":
            p.innerHTML = nameInput.rules;
            break;
        case "password":
            p.innerHTML = passwordInput.rules;
            break;
        case "passwordRepeat":
            p.innerHTML = passwordRepeatInput.rules;
            break;
        case "email":
            p.innerHTML = emailInput.rules;
            break;
        case "phone":
            p.innerHTML = phoneInput.rules;
            break;
    }
    p.style.color = "black";//提示信息保持黑色
}
delegateEvent(print, "input", "blur", showValidateMessage);
function showValidateMessage() {
    /**
     * IE8及以下不支持nextElementSibling
     */
    var p = this.nextSibling;
    while (p) {
        if (p.nodeType === 1) {
            break;
        }
        p = p.nextSibling;
    }
    switch (this.name) {
        case "name":
            p.innerHTML = nameInput.validator(this.value)[0];
            result[0] = nameInput.validator(this.value)[1];
            this.style.borderColor = nameInput.validator(this.value)[2];
            p.style.color = nameInput.validator(this.value)[2];
            break;
        case "password":
            p.innerHTML = passwordInput.validator(this.value)[0];
            result[1] = passwordInput.validator(this.value)[1];
            this.style.borderColor = passwordInput.validator(this.value)[2];
            p.style.color = passwordInput.validator(this.value)[2];
            break;
        case "passwordRepeat":
            p.innerHTML = passwordRepeatInput.validator(this.value)[0];
            result[2] = passwordRepeatInput.validator(this.value)[1];
            this.style.borderColor = passwordRepeatInput.validator(this.value)[2];
            p.style.color = passwordRepeatInput.validator(this.value)[2];
            break;
        case "email":
            p.innerHTML = emailInput.validator(this.value)[0];
            result[3] = emailInput.validator(this.value)[1];
            this.style.borderColor = emailInput.validator(this.value)[2];
            p.style.color = emailInput.validator(this.value)[2];
            break;
        case "phone":
            p.innerHTML = phoneInput.validator(this.value)[0];
            result[4] = phoneInput.validator(this.value)[1];
            this.style.borderColor = phoneInput.validator(this.value)[2];
            p.style.color = phoneInput.validator(this.value)[2];
            break;
    }
}
