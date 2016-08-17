(function (window, undefined) {
    var util = {};
    /**
     * 添加事件
     * @param element
     * @param event
     * @param listener
     */
    util.addEvent = function (element, event, listener) {
        if (element.addEventListener) { //标准
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { //低版本ie
            element.attachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = listener;
        }
    };
    /**
     * 事件代理
     * @param element
     * @param tag
     * @param eventName
     * @param listener
     */
    util.delegateEvent = function (element, tag, eventName, listener) {
        util.addEvent(element, eventName, function (event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (target && target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    };
    /**
     * 移除事件
     * @param element
     * @param event
     * @param listener
     */
    util.removeEvent = function (element, event, listener) {
        if (element.removeEventListener) { //标准
            element.removeEventListener(event, listener, false);
        } else if (element.detachEvent) { //低版本ie
            element.detachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = null;
        }
    };
    /**
     * 获取事件对象
     * @param event
     * @returns {*|Event}
     */
    util.getEvent = function (event) {
        return event || window.event;
    };
    /**
     * 阻止默认行为
     * @param event
     */
    util.preventDefault = function (event) {
        var event = util.getEvent(event);
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };
    /**
     * 获取属性值
     * @param obj
     * @param attribute
     * @returns {*}
     */
    util.getCss = function (obj, attribute) {
        if (obj.currentStyle) {//只有IE支持currentStyle，先判断是否是IE浏览器。IE8及以下不认opacity，IE9及以上、FF和Chrome可以使用opacity。filter: alpha(opacity=30)属性IE10及以上、FF和Chrome都不认识。IE9及以下支持
            return obj.currentStyle[attribute];//是IE浏览器则返回当前元素的对应属性的值
        } else {
            return getComputedStyle(obj, false)[attribute];//IE9及以上或者非IE浏览器例如FF和Chrome支持getComputedStyle
        }
    };
    util.Gsc = {
        getid: function (id) {
            return /#/.test(id) ? document.querySelector(id) : document.getElementById(id);
        },
        getclass: function (classname) {
            return /./.test(classname) ? document.querySelector(classname) : document.getElementsByClassName(classname)[0];
        },
        newElement: function (tag) {
            return document.createElement(tag);
        },
        addAttr: function (dom, attr, value) {
            dom[attr] = value;
        },
        addChild: function (dom, child) {
            dom.appendChild(child);
        },
        html: function (dom, value) {
            dom.innerHTML = value;
        }
    };
    window.util = util;
})(window, undefined);