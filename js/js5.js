/**
 * 2016.3.25 by CW
 */

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
	var datStr = '';
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

// 记录当前页面的表单选项pageState.nowSelectCity
var pageState = {
	nowSelectCity: 0,
	nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart(choice) {
	var drawPlace = document.getElementById('aqi-chart');
	drawPlace.innerHTML = '';
	if(choice == 'city') {
		initAqiChartData();
	}
	var width,drawObg;
	if(pageState.nowGraTime == 'day') {
		width = '1%';
		drawObg = chartData['day'];
	}
	else if(pageState.nowGraTime == 'week') {
		width = '5%';
		drawObg = chartData['week'];
	}
	else if(pageState.nowGraTime == 'month') {
		width = '25%';
		drawObg = chartData['month'];
	}
	for(var ele in drawObg) {
		var div = document.createElement('div');
		div.style.width = width;
		div.style.height = drawObg[ele];
		div.title = ele+'的污染指数为：'+drawObg[ele];
		div.style.backgroundColor = randomColor();
		/*若产生的颜色不能显示的，另外取*/
		while(div.style.backgroundColor == '') {
			div.style.backgroundColor = randomColor();
		}
		drawPlace.appendChild(div);
	}
	addEvent(drawObg, 'mouseover',function(e) {
		if(e.srcElement.value) {
			graTimeChange(e.srcElement.value);
		}
	});
}

/**
 * 产生随机颜色的函数,此处可能产生五位数
 */
function randomColor() {
	return '#'+(~~(Math.random()*(1<<24))).toString(16);
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(time) {
  // 确定是否选项发生了变化 
	var graTime = pageState.nowGraTime;
	if(!(graTime == time)) {
		pageState.nowGraTime = time;
		renderChart('time');
	}
  // 设置对应数据
  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(index) {
  // 确定是否选项发生了变化 
	if(pageState.nowSelectCity !== index) {
		pageState.nowSelectCity = index;
		renderChart('city');
	}
  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm(graTime) {
	addEvent(graTime, 'click',function(e) {
		if(e.srcElement.value) {
			graTimeChange(e.srcElement.value);
		}
	});
}

function addEvent(target,type,handler) {
	if(target.addEventListener) {
		target.addEventListener(type,handler,false);
	}
	else {
		target.attachEvent('on'+type,function(event) {
			return handler.call(target,event);
		});
	}
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector(city) {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	for(var ele in aqiSourceData) {
		var option = document.createElement('option');
		option.innerHTML = ele;
		city.appendChild(option);
	}
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
	addEvent(city, 'click', function(e) {
		if(e.clientX === 0) {
			citySelectChange(e.target.selectedIndex);
		}
	});
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
	var city = pageState.nowSelectCity;
	var dayObj = aqiSourceData[Object.keys(aqiSourceData)[city]];
	var dayCount = 0,weekCount = 0,monthCount = 0;
	var weeksum = 0,monthsum = 0;
	var weekObj = {},monthObj = {};
	for(var day in dayObj) {
		dayCount ++;
		weeksum += dayObj[day];
		monthsum += dayObj[day];
		if(dayCount %7 === 0) {
			weekCount ++;
			weekObj['2016年第'+weekCount+'周'] = (weeksum/7).toFixed(2) ;
			weeksum = 0;
		}
		if(dayCount %30 === 0) {
			monthCount ++;
			monthObj['2016年第'+monthCount+'个月'] = (monthsum/30).toFixed(2) ;
			monthsum = 0;
		}
	}
	chartData['day'] = dayObj;
	chartData['week'] = weekObj;
	chartData['month'] = monthObj;
}

/**
 * 初始化函数
 */
function init() {
	var graTime = document.getElementById('form-gra-time');
	var city = document.getElementById('city-select');
	
	initGraTimeForm(graTime);
	initCitySelector(city);
	renderChart('city');
}

init();
