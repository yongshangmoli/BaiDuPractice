(function (window, undefined) {
    function SortTable(param) {
        return new SortTable.prototype.init(param);
    }
    SortTable.prototype = {
        init: function (param) {
            this.title = param.title;
            this.isSortable = param.isSortable;
            this.message = param.message;
            this.createTable();
            var table = util.Gsc.getclass(".sort-table");
            var that = this;
            //给table主体添加事件代理
            util.delegateEvent(table, "span", "click", function () {
                var index = this.dataset.index
                var method = /asc/.test(this.className) ? "asc" : "desc";
                that.sort(index, method);
                that.updateTable(table);
            });
        },
        /**
         * 创建表格主体
         */
        createTable: function () {
            var tableBox = util.Gsc.getid("#tableBox");
            if (!tableBox) {
                console.warn("请创建表格包含块：<section class='tableBox' id='tableBox'></section>");
                return;
            }
            var table = util.Gsc.newElement("table");
            util.Gsc.addAttr(table, "className", "sort-table");
            var tbody = util.Gsc.newElement("tbody");
            util.Gsc.addChild(table, tbody);
            var tr_head = util.Gsc.newElement("tr");
            for (var i = 0; i < this.title.length; i++) {
                var th = util.Gsc.newElement("th");
                var p = util.Gsc.newElement("p");
                util.Gsc.html(p, this.title[i]);
                util.Gsc.addChild(th, p);
                if (this.isSortable[i]) {//判断是否添加排序功能
                    var span_asc = util.Gsc.newElement("span");
                    var span_desc = util.Gsc.newElement("span");
                    util.Gsc.addAttr(span_asc, "className", "icon icon-asc");
                    util.Gsc.addAttr(span_desc, "className", "icon icon-desc");
                    span_asc.dataset.index = i;
                    span_desc.dataset.index = i;
                    util.Gsc.html(span_asc, "↑");
                    util.Gsc.html(span_desc, "↓");
                    util.Gsc.addChild(th, span_asc);
                    util.Gsc.addChild(th, span_desc);
                }
                util.Gsc.addChild(tr_head, th);
            }
            util.Gsc.addChild(tbody, tr_head);
            //添加tr--td
            for (var i = 0; i < this.message.length; i++) {
                var tr = util.Gsc.newElement("tr");
                for (var j = 0; j < this.message[i].length; j++) {
                    var td = util.Gsc.newElement("td");
                    util.Gsc.html(td, this.message[i][j]);
                    util.Gsc.addChild(tr, td);
                }
                util.Gsc.addChild(tbody, tr);
            }
            util.Gsc.addChild(table, tbody);
            util.Gsc.addChild(tableBox, table);
        },
        /**
         * 排序
         * @param index
         * @param method
         */
        sort: function (index, method) {
            if (method === "asc") {
                this.message.sort(function (a, b) {
                    return b[index] - a[index];
                });
            } else {
                this.message.sort(function (a, b) {
                    return a[index] - b[index];
                });
            }
        },
        /**
         * 更新表格内容
         * @param target
         */
        updateTable: function (target) {
            var arrTd = target.getElementsByTagName("td"),
                index = 0;
            for (var i = 0; i < this.message.length; i++) {
                for (var j = 0; j < this.message[i].length; j++) {
                    arrTd[index++].innerHTML = this.message[i][j];
                }
            }
        }
    };
    /**
     * 导出接口
     * @type {Object|SortTable}
     */
    SortTable.prototype.init.prototype = SortTable.prototype;
    window.SortTable = SortTable;
})(window, undefined);