window.onload = function () {
    var radio = document.getElementsByName("gra-time");
    var timeSelect = document.getElementById("form-gra-time");
    var citySlect = document.getElementById("city-select");
    var wrap = document.getElementsByClassName("aqi-chart-wrap")[0];
    var text = document.getElementById("text");

    function addEvent(element, event, listener) {
        if (element.addEventListener) { //标准
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { //低版本ie
            element.attachEvent("on" + event, listener);
        } else { //都不行的情况
            element["on" + event] = listener;
        }
    }
    /* 数据格式演示
     var aqiSourceData = {
     "北京": {
     "2016-01-01": 10,
     "2016-01-02": 10,
     "2016-01-03": 10,
     "2016-01-04": 10
     }
     };
     */

// 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }
    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = ''
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };
// 用于渲染图表的数据
    var chartData = {};

// 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: 0,
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    function renderChart() {
        wrap.innerHTML = "";
        text.innerHTML = "";
        var temp = null;
        var result = null;
        var pointer = 0;
        var weekTotal = 0;
        var i = 0;
        result = {
            "01": {day: 0, total: 0},
            "02": {day: 0, total: 0},
            "03": {day: 0, total: 0},
            "04": {day: 0, total: 0},
            "05": {day: 0, total: 0},
            "06": {day: 0, total: 0},
            "07": {day: 0, total: 0},
            "08": {day: 0, total: 0},
            "09": {day: 0, total: 0},
            "10": {day: 0, total: 0},
            "11": {day: 0, total: 0},
            "12": {day: 0, total: 0},
        };
        for (var attr in chartData) {//获取每个月的总天数和总污染指数
            if (chartData.hasOwnProperty(attr)) {
                temp = attr.split("-");
                result[temp[1]].total += chartData[attr];
                result[temp[1]].day += 1;
            }
        }
        for (attr in result) {//获取每个月的周数和每一周的天数
            if (result.hasOwnProperty(attr)) {
                var weekNum = result[attr].day / 7;
                var leave = result[attr].day % 7;
                temp = {};
                for (i = 1; i <= weekNum; i++) {
                    temp["0" + i] = {
                        day: 7
                    };
                }
                if (leave !== 0) {
                    temp["0" + i] = {
                        day: leave
                    };
                }
            }
            result[attr].week = temp;
        }
        temp = [];
        for (attr in chartData) {
            if (chartData.hasOwnProperty(attr)) {
                temp.push(chartData[attr]);
            }
        }
        for (attr in result) {//获取每一周的总污染指数
            if (result.hasOwnProperty(attr)) {
                for (var currentWeek in result[attr].week) {
                    if (result[attr].week.hasOwnProperty(currentWeek)) {
                        for (i = pointer; i < pointer + result[attr].week[currentWeek].day; i++) {
                            weekTotal += temp[i];
                        }
                        pointer = i;
                        result[attr].week[currentWeek].total = weekTotal;
                        weekTotal = 0;
                    }
                }
            }
        }
        function toChinese(text) {
            if (text === "day") {
                return "天";
            } else if (text === "week") {
                return "周";
            } else {
                return "月";
            }
        }
        text.innerHTML = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + " 查询时间粒度：" + toChinese(pageState.nowGraTime);

        if (pageState.nowGraTime === "day") {
            for (var attr in chartData) {
                if (chartData.hasOwnProperty(attr)) {
                    var div = document.createElement("div");
                    div.style.width = "1%";
                    div.style.backgroundColor = "#" + randomColor();
                    div.title = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + "，时间：" + attr + "，空气污染指数：" + chartData[attr];
                    wrap.appendChild(div);
                    startMoveTimeVersion(div, {
                        height: chartData[attr]
                    }, 1000, "Elastic", "easeOut");
                }
            }
        } else if (pageState.nowGraTime === "week") {
            for (attr in result) {
                if (result.hasOwnProperty(attr)) {
                    if (result[attr].day !== 0) {
                        for (currentWeek in result[attr].week) {
                            if (result[attr].week.hasOwnProperty(currentWeek)) {
                                var div = document.createElement("div");
                                div.style.width = "6%";
                                div.style.backgroundColor = "#" + randomColor();
                                div.title = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + "，时间：" + parseInt(attr) + "月第" + parseInt(currentWeek) + "周" + "，空气平均污染指数：" + result[attr].week[currentWeek].total / result[attr].week[currentWeek].day;
                                wrap.appendChild(div);
                                startMoveTimeVersion(div, {
                                    height: result[attr].week[currentWeek].total / result[attr].week[currentWeek].day
                                }, 1000, "Elastic", "easeOut");
                            }
                        }
                    }
                }
            }
        } else {
            for (attr in result) {
                if (result.hasOwnProperty(attr)) {
                    if (result[attr].day !== 0) {
                        var div = document.createElement("div");
                        div.style.width = "30%";
                        div.style.backgroundColor = "#" + randomColor();
                        div.title = "当前城市：" + citySlect.options[pageState.nowSelectCity].text + "，时间：" + parseInt(attr) + "月" + "，空气平均污染指数：" + result[attr].total / result[attr].day;
                        wrap.appendChild(div);
                        startMoveTimeVersion(div, {
                            height: result[attr].total / result[attr].day
                        }, 1000, "Elastic", "easeOut");
                    }
                }
            }
        }
    }
    /**
     * 生成随机16进制颜色
     */
    function randomColor() {
        var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        if (rand.length === 6) {
            return rand;
        } else {
            return randomColor();
        }
    }
    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange() {
        var current = selectRadio();
        if (current !== pageState.nowGraTime) {
            pageState.nowGraTime = current;
            renderChart();
        }
    }
    function selectRadio() {//获取单选框当前所选择的值
        for (i = 0, len = radio.length; i < len; i++) {
            if (radio[i].checked) {
                return radio[i].value;
            }
        }
    }
    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        var current = citySlect.selectedIndex;
        if (current !== pageState.nowSelectCity) {
            chartData = aqiSourceData[citySlect.options[current].text];
            pageState.nowSelectCity = current;
            chartData = aqiSourceData[citySlect.options[pageState.nowSelectCity].text];//当城市改变的时候才重新获取数据
            renderChart();
        }
    }
    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        addEvent(timeSelect, "click", graTimeChange);
    }
    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        addEvent(citySlect, "change", citySelectChange);
    }
    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        chartData = aqiSourceData[citySlect.options[pageState.nowSelectCity].text];
        renderChart();
    }
    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm()
        initCitySelector();
        initAqiChartData();
    }
    init();
    function startMoveTimeVersion(obj, json, duringTime, type, sonType, callBack) {
        var iCur = {},
            result,
            t,
            startTime = getCurrentTime(),
            finishTime;
        function css(obj, attribute) {
            if (obj.currentStyle) {//只有IE支持currentStyle，先判断是否是IE浏览器。IE8及以下不认opacity，IE9及以上、FF和Chrome可以使用opacity。filter: alpha(opacity=30)属性IE10及以上、FF和Chrome都不认识。IE9及以下支持
                return obj.currentStyle[attribute];//是IE浏览器则返回当前元素的对应属性的值
            } else {
                return getComputedStyle(obj, false)[attribute];//IE9及以上或者非IE浏览器例如FF和Chrome支持getComputedStyle
            }
        }
        function getCurrentTime() {
            return (new Date()).getTime();
        }
        for (var attribute in json) {
            if (json.hasOwnProperty(attribute)) {
                if (attribute == "opacity") {
                    iCur[attribute] = Math.round(css(obj, attribute) * 100);//Chrome低版本取不到准确的0.3，于是需要四舍五入
                } else {
                    iCur[attribute] = parseInt(css(obj, attribute));//其他属性提取出来会有px，去掉px，只取出数值
                }
            }
        }
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            finishTime = getCurrentTime();
            t = duringTime - Math.max(0, (startTime - finishTime) + duringTime);
            for (var attr in json) {
                if (json.hasOwnProperty(attr)) {
                    if (attr == "opacity") {
                        result = Tween[type][sonType](t, iCur[attr], json[attr] * 100 - iCur[attr], duringTime);
                        obj.style.opacity = result / 100;
                        obj.style.filter = "alpha(opacity=" + result + ")";
                    } else {
                        result = Tween[type][sonType](t, iCur[attr], json[attr] - iCur[attr], duringTime);
                        obj.style[attr] = result + "px";
                    }
                }
            }
            if (t == duringTime) {
                clearInterval(obj.timer);
                callBack && callBack.call(obj);
            }
        }, 13);
        var Tween = {
            Linear: function(t,b,c,d){ return c*t/d + b; },
            Quad: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                }
            },
            Cubic: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                }
            },
            Quart: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                }
            },
            Quint: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                }
            },
            Sine: {
                easeIn: function(t,b,c,d){
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOut: function(t,b,c,d){
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                }
            },
            Expo: {
                easeIn: function(t,b,c,d){
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOut: function(t,b,c,d){
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            Circ: {
                easeIn: function(t,b,c,d){
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                }
            },
            Elastic: {
                easeIn: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
                },
                easeInOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                }
            },
            Back: {
                easeIn: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                }
            },
            Bounce: {
                easeIn: function(t,b,c,d){
                    return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
                },
                easeOut: function(t,b,c,d){
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                easeInOut: function(t,b,c,d){
                    if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
                    else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
        };
    }
};