(function($) {
	var util = {
		tds : "",
		preHlight : 0,
		curDate : null,
	};
	var defaultCfg = {
		beginYear : 1970,
		endYear : 2070
	}

    $.fn.extend({
		myCalendar : function(options) {
			var options = $.extend(defaultCfg, options);
			/**
			 * 为了方便在函数原型上定义方法，扩展的defMtd方法
			 * @param  {[string]}
			 * @param  {[function]}
			 * @return {[this]}
			 */
			Function.prototype.defMtd = function(name,func) {
				this.prototype[name] = func;
				return this;
			};
			/**
			 * 日历类传入参数表示日历要显示的范围
			 * @param {[number：日历开始年份]}
			 * @param {[number: 日历结束年份]}
			 */
			var Calendar = function(beginYear,endYear) {
				this.beginYear = beginYear;
				this.endYear = endYear;
				this.date = new Date();
				this.mthDays = [31,-1,31,30,31,30,31,31,30,31,30,31];
			}
			/**
			 * 绘制生成日历
			 * @param  {[jquery对象：显示日历的div]}
			 */
			Calendar.defMtd("drawCalendar",function(wrapper) {
				wrapper.addClass(" wrapper");
				var yrAndMth = $("<div id='yearAndMonth' class='yearAndMonth'></div>");
				var yearSelect = $("<select id='year'></select>");
				var monthSelect = $("<select id='month'></select>");
				yrAndMth.appendTo(wrapper);
				yearSelect.appendTo(yrAndMth);
				monthSelect.appendTo(yrAndMth);
				var dayPanel = $("<div id='day' class='day'></div>");
				var thead = $("<thead><tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr></thead>");
				var tds = "<tbody>"
				for (var i = 0 ; i < 6; i++) {
					tds += "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
				}
				tds += "</tbody>";
				var tbody = $(tds);
				dayPanel.appendTo(wrapper);
				thead.appendTo(dayPanel);
				tbody.appendTo(dayPanel);
			});
			/**
			 * 日历头部添加年月选择的选项
			 * @param  {长度为2的数组，存放的jQuery对象：containers[0]是年份的select,containers[1]是月份的select}
			 */
			Calendar.defMtd("addYrMth",function(containers) {
				var options = [],start = this.beginYear;
				for (var i = this.beginYear ; i <= this.endYear; i++) {
					options.push("<option value="+i+">"+i+"年</option>");
				}
				containers[0].html(options.join(""));
				options = [];
				for (var i = 1 ; i <= 12; i++) {
					options.push("<option value="+i+">"+i+"月</option>");
				}
				containers[1].html(options.join(""));
			});
			/**
			 * 用于计算某年的某个月有多少天
			 * @param  {number：年份}
			 * @param  {number:月份}
			 * @return {[type]}
			 */
			Calendar.defMtd("countDays",function(year,month) {
				if(month < 1 || month > 12) {
					throw new TypeError("wrong time");
				}
				var that = this;
				if(month === 2) {
					if(year.toString().slice(-2) === "00") {
						that.mthDays[1] = (year/400 === Math.floor(year/400) ? 29 : 28);
					}
					else {
						that.mthDays[1] = (year/4 === Math.floor(year/4) ? 29 : 28);
					}
				}
				return that.mthDays[month-1];
			});
			/**
			 * 将传入的参数指定的年月份指定为选中状态
			 * @param  {number：年份}
			 * @param  {number:月份}
			 */
			Calendar.defMtd("setSeltYrMth",function(year,month) {
				$("#year option[value="+year+"]").attr("selected",true).siblings().attr("selected",false);
				$("#month option[value="+month+"]").attr("selected",true).siblings().attr("selected",false);;
			});
			/**
			 * 将传入的td添加高亮显示
			 * @param  {jquery对象，要显示为高亮的td}
			 */
			Calendar.defMtd("setSeltDay",function(curSlt) {
				util.preHlight.removeClass("active");
				curSlt.addClass("active");
				util.preHlight = curSlt;
			});
			/**
			 * 为面板添加日期显示
			 * @param  {jq对象，显示日期的tds}
			 * @param  {number,本月第一天是周几}
			 * @param  {number,本月共多少天}
			 * @param  {number，下月有多少天}
			 * @return {jq对象，面板第一个td应当显示的日期}
			 */
			Calendar.defMtd("setPanel",function(tds,firstDayWeek,daySumCur,firstTdDay) {
				for (var i = 0; i < firstDayWeek; i++) {
					$(tds[i]).html(firstTdDay++).attr("class","").addClass("not-cur-mth");
				}
				var dayTime = 1;
				for (var i = firstDayWeek; i < firstDayWeek+daySumCur; i++) {
					$(tds[i]).attr("class","").html(dayTime++);
				}
				dayTime = 1;
				for (var i = firstDayWeek+daySumCur; i < 42; i++) {
					$(tds[i]).attr("class","").html(dayTime++).addClass("not-cur-mth");
				}
			});
			/**
			 * 初始化，初次加载页面时绘制当前日期的面板
			 * @param  {Date对象，当前时间}
			 */
			Calendar.defMtd("firstDraw",function(date) {
				this.getDrawEles(false,null,date);
			});

			/**
			 * 得到需要显示的panel的年月日，需要显示的日期,设定日期的接口
			 * @param  {Boolean,是否是select点击产生的}
			 * @param  {jq对象，获取是周几的外容器}
			 * @param  {js内置对象Date, 当日日期}
			 */
			Calendar.defMtd("getDrawEles",function(isSlt,dayWrapper,date) {
				//var res = [];//year,month,day,week,daySumCur,daySumPreMth,firstDayWeek,firstTdDay
				var that = this;
				var year,month,day,week,curHlight;
				if(date) {
					year = date.getFullYear();
					month = date.getMonth()+1;
					day = date.getDate();
					week = date.getDay();
				}
				else {
					year = parseInt($('#year option:selected').val(),10);
					month = parseInt($('#month option:selected').val(),10);
					day = parseInt(dayWrapper.html(),10);
					if(isSlt) {
						week = new Date(year,month-1,day).getDay();
					}
					else {
						week = dayWrapper.index() === 0 ? 7:dayWrapper.index();
						if(day > 15) {
							if(month-1 <= 0) {
								month = 12;
								year -= 1;
							}
							else {
								month -= 1;
							}
						}
						else if(day < 15) {
							if(month+1 >= 13) {
								month = 1;
								year += 1;
							}
							else {
								month += 1;
							}
						}
					}
				}
				var daySumCur = that.countDays(year,month);
				var daySumPreMth = that.countDays(year,month-1 === 0 ? 12 : month-1);
				var firstDayWeek = week + 1 - day%7;
				firstDayWeek = firstDayWeek <= 0 ? (firstDayWeek+7):firstDayWeek;
				var firstTdDay = daySumPreMth - firstDayWeek + 1;
				util.preHlight = $(util.tds.get(day+firstDayWeek-1));
				if(date) {
					that.setSeltYrMth(year,month);
				}
				else {
					if(isSlt) {
						if(day > daySumCur) {
							util.preHlight = $(util.tds.get(firstDayWeek+daySumCur-1));
						}
					}
					else {
						that.setSeltYrMth(year,month);
					}
				}
				this.setPanel(util.tds,firstDayWeek,daySumCur,firstTdDay);
				this.setSeltDay(util.preHlight);
				util.curDate = new Date(year,month-1,day);
			});
			/**
			 * 初始化函数，绘制并绑定事件监听函数
			 */
			Calendar.defMtd("init",function() {
				var that = this;
				this.drawCalendar($("#wrapper"));
				util.tds = $("tbody td");
				this.addYrMth([$("#year"),$("#month")]);
				this.firstDraw(that.date);
				//选择年月的事件监听
				$("#year").add($("#month")).on("change",function() {
					that.getDrawEles(true,util.preHlight);//that.getDrawEles(true,util.preHlight,date);
				});
				//日期点击的事件监听
				util.tds.on("click",function() {
					var className = $(this).attr("class") || '';
					if(className.indexOf("not-cur-mth") > -1) {
						that.getDrawEles(false,$(this));
					}
					else {
						that.setSeltDay($(this));
					}
				});
			});
			new Calendar(options.beginYear,options.endYear).init();
			return this;
		}
	});
})(jQuery);