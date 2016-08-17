var getMessage = (function () {
    var cityAndCollege = [
        ["艾欧尼亚", "北京大学", "清华大学", "上海交通大学", "浙江大学"],
        ["均衡教派", "Harvard University", "Yale University", "University of Cambridge", "Oxford University"],
        ["黑色玫瑰", "STANFORD University", "University of Chicago", "Massachusetts Institute of Technology"],
        ["诺克萨斯", "Duke University", "University of Pennsylvania", "California Institute of Technology"],
        ["德玛西亚", "Columbia University", "princeton University", "University of California, Berkeley"],
        ["班德尔城", "南京大学", "华南理工大学", "中国科学院大学", "国防科技大学"]
    ];
    var addEvent = function (element, event, listener) {
        if (element.addEventListener) { //标准
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { //低版本ie
            element.attachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = listener;
        }
    };
    var getElement = function (id) {
        return document.querySelector(id);
    };
    var delegateEvent = function delegateEvent(element, tag, eventName, listener) {
        addEvent(element, eventName, function () {
            var event = arguments[0] || window.event,
                target = event.target || event.srcElement;
            if (target && target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    };
    /**
     * 显示城市相应的大学
     * @param obj
     * @param sub
     */
    var showCollege = function (obj, sub) {
        sub.innerHTML = "";
        var option = null;
        for (var i = 1, len = cityAndCollege[obj.selectedIndex].length; i < len; i++) {
            option = document.createElement("option");
            option.innerHTML = cityAndCollege[obj.selectedIndex][i];
            sub.appendChild(option);
        }
    };
    return {
        getElement: getElement,
        addEvent: addEvent,
        delegateEvent: delegateEvent,
        showCollege: showCollege
    };
})();
var student = getMessage.getElement("#student");
var arrRadio = document.getElementsByName("people");
var college = getMessage.getElement("#college");
var company = getMessage.getElement("#company");
var city = getMessage.getElement("#city");
var school = getMessage.getElement("#school");
/**
 * 在校生和非在校生切换的时候改变选择内容，原理是改变display值
 */
getMessage.delegateEvent(student, "input", "click", function () {
    var current = "";
    for (var i = 0, len = arrRadio.length; i < len; i++) {
        if (arrRadio[i].checked) {
            current = arrRadio[i].value;
            break;
        }
    }
    if (current === "在校生") {
        college.style.display = "block";
        getMessage.showCollege(city, school);
        company.style.display = "none";
    } else {
        college.style.display = "none";
        company.style.display = "block";
    }
});
/**
 * 切换城市的时候，显示城市对应的大学
 */
getMessage.addEvent(city, "click", function () {
    getMessage.showCollege(city, school);
});
