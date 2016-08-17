/**
 * @namespace _CalF
 * 日历控件所用便捷函数
 * */
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
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    }
};
/**
 * @name Calender
 * @constructor
 * */
function Calender() {
    this.initialize.apply(this, arguments);
}
Calender.prototype = {
    constructor: Calender,
    // 模板数组
    _template: [
        '<dl>',
        '<dt class="title-date">',
        '<span class="prevyear">prevyear</span><span class="prevmonth">prevmonth</span>',
        '<span class="nextyear">nextyear</span><span class="nextmonth">nextmonth</span>',
        '</dt>',
        '<dt><strong>日</strong></dt>',
        '<dt>一</dt>',
        '<dt>二</dt>',
        '<dt>三</dt>',
        '<dt>四</dt>',
        '<dt>五</dt>',
        '<dt><strong>六</strong></dt>',
        '<dd></dd>',
        '</dl>'
    ],
    // 初始化对象
    initialize: function (options) {
        this.id = options.id; // input的ID
        this.input = _CalF.$('#'+ this.id); // 获取input元素
        this.isSelect = options.isSelect;   // 是否支持下拉select选择年月，默认不显示
        this.callBack = options.callBack;
        this.inputEvent(); // input的事件绑定，获取焦点事件
    },
    // 表单的事件
    inputEvent: function () {
        var that = this;
        _CalF.bind(this.input, 'focus', function () {
            that.createContainer();
            that.drawDate(new Date());
        });
    },
    // 创建日期最外层盒子，并设置盒子的绝对定位
    createContainer: function () {
        // 如果存在，则移除整个日期层Container
        var odiv = _CalF.$('#'+ this.id + '-date');
        if (!!odiv) {
            odiv.parentNode.removeChild(odiv);
        }
        var container = this.container = document.createElement('div');
        container.id = this.id + '-date';
        container.style.position = 'absolute';
        container.zIndex = 999;
        // 获取input表单位置inputPos
        var inputPos = _CalF.getPos(this.input);
        // 根据input的位置设置container高度
        container.style.left = inputPos.left + 'px';
        container.style.top = inputPos.bottom - 1 + 'px';
        // 设置日期层上的单击事件，仅供阻止冒泡，用途在日期层外单击关闭日期层
        _CalF.bind(container, 'click', _CalF.stopPropagation);
        document.body.appendChild(container);
    },
    // 渲染日期
    drawDate: function (odate) { // 参数 odate 为日期对象格式
        var dateWarp,
            titleDate,
            dd,
            year,
            month,
            date,
            days,
            weekStart,
            i,
            ddHtml = [],
            textNode,
            nowDate = new Date(),
            nowyear = nowDate.getFullYear(),
            nowmonth = nowDate.getMonth(),
            nowdate = nowDate.getDate();
        this.dateWarp = dateWarp = document.createElement('div');
        dateWarp.className = 'calendar';
        dateWarp.innerHTML = this._template.join(''); // 将模板写入
        this.year = year = odate.getFullYear(); // 获取传入的时间中的年份
        this.month = month = odate.getMonth() + 1; // 获取传入的时间中的月份
        this.date = date = odate.getDate(); // 获取传入的时间中的月份中的天数
        this.titleDate = titleDate = _CalF.$('.title-date', dateWarp)[0];
        // 是否显示select
        if (this.isSelect) {
            var selectHtmls = [];
            // 添加年份下拉框
            selectHtmls.push('<select>');
            for (i = 2020; i > 1970; i--) {
                if (i != this.year) {
                    selectHtmls.push('<option value ="'+ i +'">'+ i +'</option>');
                } else {
                    selectHtmls.push('<option value ="'+ i +'" selected>'+ i +'</option>'); // 自动选中当前年份
                }
            }
            selectHtmls.push('</select>');
            selectHtmls.push('年');
            // 添加月份下拉框
            selectHtmls.push('<select>');
            for (i = 1; i <= 12; i++) {
                if (i != this.month) {
                    selectHtmls.push('<option value ="'+ i +'">'+ i +'</option>');
                } else {
                    selectHtmls.push('<option value ="'+ i +'" selected>'+ i +'</option>'); // 自动选中当前月份
                }
            }
            selectHtmls.push('</select>');
            selectHtmls.push('月');
            titleDate.innerHTML = selectHtmls.join('');
            // 绑定change事件
            this.selectChange();
        } else {
            textNode = document.createTextNode(year + '年' + month + '月');
            titleDate.appendChild(textNode);
            this.btnEvent();
        }
        // 获取模板中唯一的DD元素
        this.dd = dd = _CalF.$('dd',dateWarp)[0];
        // 获取本月天数，以当前年份中的月份的下一个月份的第0天作为时间对象，即可获得当前年份中的月份中的最后一天，比如我要获取2016年4月份的总天数，那么传入的对象是2016年5月份第0天，再用getDate()方法获取4月份最后一天是几号，即为4月份总天数
        days = new Date(year, month, 0).getDate();
        // 获取本月第一天是星期几
        weekStart = new Date(year, month - 1, 1).getDay();
        // 开头显示空白段
        for (i = 0; i < weekStart; i++) {
            ddHtml.push('<a>&nbsp;</a>');
        }
        // 循环显示日期
        for (i = 1; i <= days; i++) {
            if (year < nowyear) {
                ddHtml.push('<a class="live disabled">' + i + '</a>'); // 传入的时间对象的年份小于当前年份
            } else if (year == nowyear) {
                if (month < nowmonth + 1) {
                    ddHtml.push('<a class="live disabled">' + i + '</a>'); // 传入的时间对象的月份小于当前月份
                } else if (month == nowmonth + 1) {
                    if (i < nowdate) ddHtml.push('<a class="live disabled">' + i + '</a>'); // 传入的时间对象的日期小于当前日期
                    if (i == nowdate) ddHtml.push('<a class="live tody">' + i + '</a>'); // 传入的时间对象的日期等于当前日期
                    if (i > nowdate) ddHtml.push('<a class="live">' + i + '</a>');  // 传入的时间对象的日期大于当前日期
                } else if (month > nowmonth + 1) {
                    ddHtml.push('<a class="live">' + i + '</a>'); // 传入的时间对象的月份大于当前月份
                }
            } else if (year > nowyear) {
                ddHtml.push('<a class="live">' + i + '</a>'); // 传入的时间对象的年份大于当前年份
            }
        }
        dd.innerHTML = ddHtml.join('');

        // 如果存在，则先移除
        this.removeDate();
        // 添加
        this.container.appendChild(dateWarp);

        //IE6select遮罩
        var ie6  = !!window.ActiveXObject && !window.XMLHttpRequest;
        if (ie6) dateWarp.appendChild(this.createIframe());

        // A link事件绑定
        this.linkOn();
        // 区域外事件绑定
        this.outClick();
    },
    // 处理IE6下的遮罩
    createIframe: function () {
        var myIframe =  document.createElement('iframe');
        myIframe.src = 'about:blank';
        myIframe.style.position = 'absolute';
        myIframe.style.zIndex = '-1';
        myIframe.style.left = '-1px';
        myIframe.style.top = 0;
        myIframe.style.border = 0;
        myIframe.style.filter = 'alpha(opacity= 0 )';
        myIframe.style.width = this.container.offsetWidth + 'px';
        myIframe.style.height = this.container.offsetHeight + 'px';
        return myIframe;
    },
    // 下拉框选择事件
    selectChange: function () {
        var selects,
            yearSelect,
            monthSelect,
            that = this;
        selects = _CalF.$('select', this.titleDate);
        yearSelect = selects[0];
        monthSelect = selects[1];
        _CalF.bind(yearSelect, 'change', function () {
            var year = yearSelect.value;
            var month = monthSelect.value;
            that.drawDate(new Date(year, month - 1, that.date));
        });
        _CalF.bind(monthSelect, 'change', function () {
            var year = yearSelect.value;
            var month = monthSelect.value;
            that.drawDate(new Date(year, month - 1, that.date));
        });
    },
    // 移除日期DIV.calendar
    removeDate: function () {
        var odiv = _CalF.$('.calendar', this.container)[0];
        if (!!odiv) {
            this.container.removeChild(odiv);
        }
    },
    // 上一月、下一月、上一年和下一年按钮事件
    btnEvent: function () {
        var prevyear = _CalF.$('.prevyear', this.dateWarp)[0],
            prevmonth = _CalF.$('.prevmonth', this.dateWarp)[0],
            nextyear = _CalF.$('.nextyear', this.dateWarp)[0],
            nextmonth = _CalF.$('.nextmonth', this.dateWarp)[0],
            that = this;
        _CalF.bind(prevyear, 'click', function () {
            var idate = new Date(that.year - 1, that.month - 1, that.date);
            that.drawDate(idate);
        });
        _CalF.bind(prevmonth, 'click', function () {
            var idate = new Date(that.year, that.month - 2, that.date);
            that.drawDate(idate);
        });
        _CalF.bind(nextyear, 'click', function () {
            var idate = new Date(that.year + 1,that.month - 1, that.date);
            that.drawDate(idate);
        });
        _CalF.bind(nextmonth, 'click', function () {
            var idate = new Date(that.year , that.month, that.date);
            that.drawDate(idate);
        });
    },
    // A 的事件
    linkOn: function () {
        var links = _CalF.$('.live', this.dd),
            i,
            l = links.length,
            that = this;
        for (i = 0; i < l; i++) {
            links[i].index = i;
            _CalF.bind(links[i], 'click', function () {
                that.date = this.innerHTML;
                that.input.value = that.year + '-' + that.month + '-' + that.date;
                that.removeDate();
                that.callBack();
            });
        }
    },
    // 鼠标在对象区域外点击，移除日期层
    outClick: function () {
        var that = this;
        _CalF.bind(document, 'click', function (event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (target == that.input) {
                return;
            }
            that.removeDate();
        });
    }
};