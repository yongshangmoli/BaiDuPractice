_CalF = {
    // 选择元素
    $: function (arg, context) {
        var tagAll,
            n,
            eles = [],
            i,
            sub = arg.substring(1); // 除去第一个字符，取剩下的字符串
        context = context || document; // 上下文是否存在，不存在就使用document
        if(typeof arg === 'string'){
            switch(arg.charAt(0)){ // 取第一个字符
                case '#':
                    return document.getElementById(sub);
                    break;
                case '.':
                    if (context.getElementsByClassName) { // 如果浏览器支持getElementsByClassName方法
                        return context.getElementsByClassName(sub);
                    }
                    tagAll = _CalF.$('*', context); // 获取所有元素
                    n = tagAll.length;
                    for (i = 0; i < n; i++) { // 如果浏览器不支持getElementsByClassName方法，那么检查所有元素的className
                        if (tagAll[i].className.indexOf(sub) > -1) {
                            eles.push(tagAll[i]);
                        }
                    }
                    return eles;
                    break;
                default: // 默认是通过标签名获取元素
                    return context.getElementsByTagName(arg);
                    break;
            }
        }
    },
    // 绑定事件
    bind: function (node, type, handler) {
        if (node.addEventListener) {
            node.addEventListener(type, handler, false);
        } else if (node.attachEvent) {
            node.attachEvent('on' + type, handler);
        } else {
            node['on' + type] = handler;
        }
    },
    // 移除事件
    removeEvent: function (node, type, handler) {
        if (node.removeEventListener) {
            node.removeEventListener(type, handler, false);
        } else if (node.detachEvent) {
            node.detachEvent('on' + type, handler);
        } else {
            node['on' + type] = null;
        }
    },
    // 事件代理
    delegateEvent: function (element, tag, eventname, listener) {
        _CalF.bind(element, eventname, function (event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (target.tagName === tag.toUpperCase()) {
                listener.call(target, event);
            }
        });
    },
    // 获取元素位置
    getPos: function (node) {
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
            scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        pos = node.getBoundingClientRect();
        return {
            top: pos.top + scrollt,
            right: pos.right + scrollx,
            bottom: pos.bottom + scrollt,
            left: pos.left + scrollx
        };
    },
    // 添加样式名
    addClass: function (c, node) {
        node.className = node.className + ' ' + c;
    },
    // 移除样式名
    removeClass: function (c, node) {
        var reg = new RegExp('(^|\\s+)' + c + '(\\s+|$)','g');
        node.className = node.className.replace(reg, '');
    },
    // 阻止冒泡
    stopPropagation: function (event) {
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    },
    // 组织默认事件
    preventDefault: function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            evant.returnValue = false;
        }
    },
    // 创建XHR对象
    createXHR: function (undefined) {
        if (typeof XMLHttpRequest !== "undefined") {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject !== "undefined") {
            if (typeof arguments.callee.activeXString !== "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                    i,
                    len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    } catch (ex) {

                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Errpr("No XHR object available.");
        }
    },
    // AJAX
    ajax: function (method, url, data, callback) {
        var xhr = new _CalF.createXHR();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    callback(xhr.responseText);
                } else {
                    alert("Request was unsuccessful: " + xhr.status);
                }
            }
        };
        if (method === "get" && data) {
            url += "?" + data;
        }
        xhr.open(method, url, true);
        if (method === "get") {
            xhr.send(null);
        } else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    }
};
(function (window, undefined) {
    function WaterfallLayout(param) {
        return new WaterfallLayout.prototype.init(param);
    }
    WaterfallLayout.prototype = {
        init: function (param) {
            this.id = param.id;
            this.col = param.col || 5;
            this.cpage = 1;
            this.control = true;
            this.createContainer(this.id);
            this.renderColumn(this.col);
            this.getData();
            var that = this;
            _CalF.bind(window, "scroll", function () {
                var min = that.getShortestColumn(that.columnArray),
                    windowHeight = that.getViewport(),
                    scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
                if (that.getTop(min) + min.clientHeight < windowHeight + scrollHeight) {
                    if (that.control) {
                        that.control = false;
                        that.cpage++;
                        that.getData();
                    }
                }
            });
            // 给封装容器添加事件代理，代理来自图片上的点击事件
            _CalF.delegateEvent(this.gallery, "img", "click", function () {
                var img = document.createElement("img");
                that.imgPop.className = "show";
                that.imgPop.innerHTML = "";
                img.src = this.src;
                that.imgPop.appendChild(img);
            });
            _CalF.bind(this.imgPop, "click", function (event) {
                event = event || window.event;
                if(event.target.id === "gallery-pop") {
                    that.imgPop.className = "";
                }
            });
        },
        // 创建弹出层
        createPop: function () {
            this.imgPop = document.createElement("div");
            this.imgPop.id = "gallery-pop";
            return this.imgPop;
        },
        // 创建封装容器
        createContainer: function (id) {
            if (!!_CalF.$("#" + id)) {
                console.warn(id + " has already existed");
                return;
            }
            var container = document.createElement("div");
            container.id = id;
            this.gallery = document.createElement("div");
            this.gallery.className = "gallery";
            container.appendChild(this.gallery);
            container.appendChild(this.createPop());
            _CalF.$("body")[0].appendChild(container);
        },
        // 生成列
        renderColumn: function (col) {
            var columnDOM = null,
                i = 0,
                that = this;
            this.columnArray = [];
            for (; i < col; i++) {
                columnDOM = document.createElement("div");
                columnDOM.className = "gallery-column";
                columnDOM.style.width = this.gallery.clientWidth / this.col + "px";
                this.colWidth = this.gallery.clientWidth / this.col;
                this.columnArray.push(columnDOM);
                this.gallery.appendChild(columnDOM);
            }
        },
        // 通过AJAX每次获取一页数据
        getData: function () {
            var that = this;
            _CalF.ajax("get", "getPics.php", "cpage=" + that.cpage, function (data) {
                data = JSON.parse(data);
                that.addContent(data);
            });
        },
        // 获取视口大小
        getViewport: function () {
            if (document.compatMode == "BackCompat") {
                return document.body.clientHeight;
            } else {
                return document.documentElement.clientHeight;
            }
        },
        // 获取元素的top值
        getTop: function (element) {
            var actualTop = element.offsetTop,
                current = element.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        },
        // 将每次获取到的数据添加到页面中
        addContent: function (data) {
            var i = 0,
                imageItem = null,
                divItem = null,
                pItem = null;
            for (; i < data.length; i++) {
                divItem = document.createElement("div");
                divItem.className = "gallery-column-item";
                imageItem = document.createElement("img");
                imageItem.src = data[i].preview;
                imageItem.style.width = this.colWidth - 16 + "px";
                imageItem.style.height = data[i].height * (this.colWidth - 16) / data[i].width + "px";

                pItem = document.createElement("p");
                pItem.innerHTML = data[i].title;
                divItem.appendChild(imageItem);
                divItem.appendChild(pItem);
                this.getShortestColumn(this.columnArray).appendChild(divItem);
            }
            this.control = true;
        },
        // 获取高度最小的列
        getShortestColumn: function (columnArray) {
            var min = columnArray[0];
            for (var i = 1; i < columnArray.length; i++) {
                if (columnArray[i].clientHeight < min.clientHeight) {
                    min = columnArray[i];
                }
            }
            return min;
        }
    };
    WaterfallLayout.prototype.init.prototype = WaterfallLayout.prototype;
    window.WaterfallLayout = WaterfallLayout;
})(window, undefined);