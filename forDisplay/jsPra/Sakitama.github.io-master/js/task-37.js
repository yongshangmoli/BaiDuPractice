(function (window, undefined) {
    function Popup(para) {
        return new Popup.prototype.init(para);
    }
    Popup.prototype = {
        /**
         * 创建弹出层
         */
        createPopup: function (para) {
            var body = document.getElementsByTagName("body")[0];
            var section = document.createElement("section");
            section.className = "pop-wrap";
            var header = document.createElement("header");
            header.className = "pop-header";
            var h3 = document.createElement("h3");
            header.appendChild(h3);
            var a = document.createElement("a");
            a.innerHTML = "x";
            a.href = "javascript:;";
            a.className = "close";
            header.appendChild(a);
            var article = document.createElement("article");
            article.className = "pop-content";
            var p = document.createElement("p");
            article.appendChild(p);
            var footer = document.createElement("footer");
            footer.className = "pop-control";
            var input = document.createElement("input");
            input.type = "button";
            input.className = "confirm";
            input.value = "确认";
            footer.appendChild(input);
            input = document.createElement("input");
            input.type = "button";
            input.className = "cancel";
            input.value = "取消";
            footer.appendChild(input);
            section.appendChild(header);
            section.appendChild(article);
            section.appendChild(footer);
            var cover = document.createElement("section");
            cover.className = "pop-up";
            cover.appendChild(section);
            body.appendChild(cover);
            /**
             * 如果允许缩放
             */
            if (para.allowResize) {
                var div = document.createElement("div");
                div.className = "resizeL";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeT";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeR";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeB";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeLT";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeTR";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeBR";
                section.appendChild(div);
                div = document.createElement("div");
                div.className = "resizeLB";
                section.appendChild(div);
            }
        },
        /**
         * 初始化
         * @param para
         * @returns {Popup}
         */
        init: function (para) {
            this.createPopup(para);
            this.cover = document.querySelector(".pop-up");
            this.wrap = this.cover.querySelector(".pop-wrap");
            //设置弹出层的宽和高
            this.wrap.width = para.width;
            this.wrap.height = para.height;
            this.wrap.style.width = para.width + "px";
            this.wrap.style.height = para.height + "px";
            //设置边距的时候不能直接offsetWidth或offsetHeight，会导致结果为0，因为此时弹出层没有显示出来，offsetWidth或offsetHeight是计算值，结果为0
            this.wrap.style.marginLeft = -parseInt(util.getCss(this.wrap, "width")) / 2 + "px";
            this.wrap.style.marginTop = -parseInt(util.getCss(this.wrap, "height")) / 2 + "px";
            //给标题区添加内容
            this.header = this.wrap.querySelector(".pop-header");
            this.header.querySelector("h3").innerHTML = para.title;
            //给内容区添加内容
            this.wrap.querySelector(".pop-content").querySelector("p").innerHTML = para.content;
            //设置提示框类型
            this.type = para.type;
            this.cover.className += " " + this.type;
            //设置状态
            this.status = false;
            //设置页面滚动标志
            this.allowPageWheel = para.allowPageWheel;
            //设置弹出层拖拽标志
            this.allowDrag = para.allowDrag;
            //设置弹出层缩放标志
            this.allowResize = para.allowResize;
            //给确认和取消按钮添加回调事件，这里注意，如果每次点击按钮都新创建一个对象的话，那么这里的事件会重复绑定，导致alert多次
            var that = this;
            util.addEvent(this.wrap.querySelector(".confirm"), "click", function () {
                para.confirm();
                that.hide();
            });
            util.addEvent(this.wrap.querySelector(".cancel"), "click", function () {
                para.cancel();
                that.hide();
            });
            //给关闭按钮添加点击事件
            util.addEvent(this.header.querySelector(".close"), "click", function (event) {
                event = event || window.event;
                that.hide();
            });
            //是否允许拖拽
            if (this.allowDrag) {
                this.drag(this.wrap, this.header);
            }
            //是否允许缩放
            if (this.allowResize) {
                this.popupResize();
            }
            return this;
        },
        /**
         * 弹出层缩放
         */
        popupResize: function () {
            var oL = document.getElementsByClassName("resizeL")[0];
            var oT = document.getElementsByClassName("resizeT")[0];
            var oR = document.getElementsByClassName("resizeR")[0];
            var oB = document.getElementsByClassName("resizeB")[0];
            var oLT = document.getElementsByClassName("resizeLT")[0];
            var oTR = document.getElementsByClassName("resizeTR")[0];
            var oBR = document.getElementsByClassName("resizeBR")[0];
            var oLB = document.getElementsByClassName("resizeLB")[0];
            //四角
            this.resize(this.wrap, oLT, true, true, false, false);
            this.resize(this.wrap, oTR, false, true, false, false);
            this.resize(this.wrap, oBR, false, false, false, false);
            this.resize(this.wrap, oLB, true, false, false, false);
            //四边
            this.resize(this.wrap, oL, true, false, false, true);
            this.resize(this.wrap, oT, false, true, true, false);
            this.resize(this.wrap, oR, false, false, false, true);
            this.resize(this.wrap, oB, false, false, true, false);
        },
        resize: function (oParent, handle, isLeft, isTop, lockX, lockY) {
            util.addEvent(handle, "mousedown", function (event) {
                event = util.getEvent(event);
                var disX = event.clientX - handle.offsetLeft;//初始X
                var disY = event.clientY - handle.offsetTop;//初始Y
                var iParentTop = oParent.offsetTop;//浮出层相对于父容器的上边距
                var iParentLeft = oParent.offsetLeft;//浮出层相对于父容器的左边距
                var iParentWidth = oParent.offsetWidth;//浮出层的宽度
                var iParentHeight = oParent.offsetHeight;//浮出层的高度
                document.onmousemove = function (event) {
                    event = util.getEvent(event);
                    var iL = event.clientX - disX;
                    var iT = event.clientY - disY;
                    var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;//设置最大宽度
                    var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;//设置最大高度
                    var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;//判断是否是可以左右伸缩
                    var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;//判断是否可以上下伸缩
                    var dragMinWidth = oParent.width;//设置最小宽度
                    var dragMinHeight = oParent.height;//设置最小高度
                    isLeft && (oParent.style.left = iParentLeft + iL + oParent.width / 2 + "px");
                    isTop && (oParent.style.top = iParentTop + iT + oParent.height / 2 + "px");
                    iW < dragMinWidth && (iW = dragMinWidth);//判断最小宽度
                    iW > maxW && (iW = maxW);
                    lockX || (oParent.style.width = iW + "px");
                    iH < dragMinHeight && (iH = dragMinHeight);//判断最小高度
                    iH > maxH && (iH = maxH);
                    lockY || (oParent.style.height = iH + "px");
                    if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
                    return false;
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            });
        },
        /**
         * 拖拽功能
         */
        drag: function (dom, handler) {//只为标题区添加拖拽
            handler.style.cursor = "move";
            util.addEvent(handler, "mousedown", function (event) {
                event = util.getEvent(event);
                util.preventDefault(event);
                var disY,
                    disX;
                disX = event.clientX - dom.offsetLeft;
                disY = event.clientY - dom.offsetTop;
                document.onmousemove = function (event) {
                    event = util.getEvent(event);
                    util.preventDefault(event);
                    var tempX = event.clientX - disX + dom.width / 2,
                        tempY = event.clientY - disY + dom.height / 2;
                    //拖拽时不能超过视窗边界
                    if (tempX > document.documentElement.offsetWidth - dom.offsetWidth + dom.width / 2) {
                        tempX = document.documentElement.offsetWidth - dom.offsetWidth + dom.width / 2;
                    } else if (tempX < dom.width / 2) {
                        tempX = dom.width / 2;
                    }
                    if (tempY > document.documentElement.offsetHeight - dom.offsetHeight + dom.height / 2) {
                        tempY = document.documentElement.offsetHeight - dom.offsetHeight + dom.height / 2;
                    } else if (tempY < dom.height / 2) {
                        tempY = dom.height / 2;
                    }
                    dom.style.left = tempX + "px";
                    dom.style.top = tempY + "px";
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            });
        },
        /**
         * 阻止页面滚动回调事件
         * @param event
         */
        stopScroll: function (event) {
            util.preventDefault(event);
        },
        /**
         * 阻止页面滚动
         */
        stopPageWheel: function () {
            util.addEvent(window, "mousewheel", this.stopScroll);
            util.addEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
        },
        /**
         * 移除阻止页面滚动
         */
        removeStopPageWheel : function () {
            util.removeEvent(window, "mousewheel", this.stopScroll);
            util.removeEvent(window, "DOMMouseScroll", this.stopScroll);//兼容FF
        },
        /**
         * 显示弹出层
         * @returns {Popup}
         */
        show: function () {
            this.cover.className += " show";
            this.status = true;
            //是否允许页面滚动，在弹出层显示的时候才运行
            if (!this.allowPageWheel) {
                this.stopPageWheel();
            }
            return this;
        },
        /**
         * 隐藏弹出层
         * @returns {Popup}
         */
        hide: function () {
            this.cover.className = this.cover.className.replace(/show/g, "").trim();
            this.status = false;
            //弹出层消失后移除阻止页面滚动事件
            if (!this.allowPageWheel) {
                this.removeStopPageWheel();
            }
            return this;
        },
        /**
         * 触发
         * @returns {Popup}
         */
        toggle: function () {
            if (this.status) {
                this.hide();
            } else {
                this.show();
            }
            return this;
        }
    };
    Popup.prototype.init.prototype = Popup.prototype;//让init的实例能够通过原型链访问Popup.prototype
    window.Popup = Popup;//导出接口
})(window, undefined);
