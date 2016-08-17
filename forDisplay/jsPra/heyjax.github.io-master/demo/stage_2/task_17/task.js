/* 数据格式演示
var aqiSourceData = {
  '北京': {
    '2016-01-01': 10,
    '2016-01-02': 10,
    '2016-01-03': 10,
    '2016-01-04': 10
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
  var dat = new Date('2016-01-01');
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  '北京': randomBuildData(500),
  '上海': randomBuildData(300),
  '广州': randomBuildData(200),
  '深圳': randomBuildData(100),
  '成都': randomBuildData(300),
  '西安': randomBuildData(500),
  '福州': randomBuildData(100),
  '厦门': randomBuildData(100),
  '沈阳': randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: 'day'
}


/**
* Get all DOM element
*/
var form = document.getElementById('form-gra-time');
var select = document.getElementById('city-select');
var chartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
/**
 * 渲染图表
 */

 //根据空气指数不同弹出不同的颜色
function color(height) {
  if (height <= 50) {
    return 'SpringGreen';
  }
  else if (height <= 100) {
    return 'Khaki';
  }
  else if (height <= 150) {
    return 'Coral';
  }
  else if (height <= 200) {
    return 'IndianRed';
  }
  else {
    return 'MediumOrchid';
  }
}

function renderChart() {
  // 用div渲染，需要div的个数以及div的长度以及title属性中每个div所对应的具体日期和长度
  var wrap = document.createElement('div'); //由于循环量大，将循环的DOM节点离线加载到新的div上，最后再统一一起加到已有节点上，减少渲染时间
  var height = [];
  var title = [];
  var i;
  chartWrap.innerHTML = '';
  for (var date in chartData.div_height) {
    if (chartData.div_height.hasOwnProperty(date)) {
      height.push(chartData.div_height[date]);
      title.push(date)
    }
  }
  for (i=0; i < chartData.div_number; i++) {
    var div = document.createElement('div');
    div.style.backgroundColor = color(height[i]);
    div.style.height = height[i] + 'px';
    div.setAttribute('title','当前城市：' + pageState.nowSelectCity + ' 时间：' + title[i] + ' 空气质量指数：' + height[i]);
    wrap.appendChild(div);
  }
  wrap.setAttribute('class','wrap')
  chartWrap.appendChild(wrap);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */

function getAllDate() {
   var dat = new Date('2016-01-01');
   var datStr = '';
   var date = [];
   for (var i = 1; i < 92; i++) {
     datStr = getDateStr(dat);
     dat.setDate(dat.getDate() + 1);
     date.push(datStr);
   }
   return date;
}

function day(city) {
   var result = {};
   result = {
     div_number: Object.keys(aqiSourceData[city]).length,
     div_height: aqiSourceData[city]
   }
   return result;
}

function week(city) {
   var date = [];
   var week = [];
   var week1 = [];
   var average_number = {};
   var data = 0;
   var count = 0;
   var average;
   var result = {};
   week.push(week1);
   // 获取该城市的所有天数到date数组中
   date = getAllDate();
   // 从星期一开始，以7天为一个循环获取一个小的数列，星期一以前的push进入week1，从而获得完整的以自然周为循环的数组
   for (var i = 0; i < date.length; i++) {
     var firstDay = new Date(date[i]);
     var stratingDay = firstDay.getUTCDay();
     if (stratingDay === 1) {
       var j = i;
       for (j; j <= date.length; j+=7) {
         week.push(date.slice(j,j+7));
       }
       break;
     }
     else {
       week1.push(date[i]);
     }
   }
   // 计算城市对应每个周的平均数据，并将其放仅average_number的数组中
   for (var x = 0; x < week.length; x++) {
     for (var y = 0; y < week[x].length; y++) {
       data += aqiSourceData[city][week[x][y]];
       count ++;
     }
     average = Math.round(data/count);
     data = 0;
     count = 0;
     var week_order = 'week' + (x + 1);
     average_number[week_order] = average;
   }
   result = {
     div_number: week.length,
     div_height: average_number
   }
   return result;
}

function month(city) {
   var average_number = {};
   var data = [0,0,0];
   var count = [0,0,0];
   var result = {};
   // 获取该城市的所有天数到date数组中
   date = getAllDate();
   // 通过getmonth将数组分成三个月并求其平均值
   for (var i = 0; i < date.length; i++) {
     var firstDay = new Date(date[i]);
     var stratingMonth = firstDay.getMonth();
     var month_order = 'month' + (stratingMonth + 1);
     for (var j = 0; j < 3; j++) {
       if (stratingMonth === j) {
         data[j] += aqiSourceData[city][date[i]];
         count[j] ++;
       }
     }
     average_number[month_order] = Math.round(data[stratingMonth]/count[stratingMonth]);
   }
   result = {
     div_number: 3,
     div_height: average_number
   }
   return result;
}

function graTimeChange(time,citychange) {
  // 确定是否选项发生了变化
  var lastChoice = pageState.nowGraTime;
  pageState.nowGraTime = time;
  if (lastChoice === time && citychange === false) {
    return ;
  }
  else{
    // 设置对应数据
    if (time === 'day') {
      chartData = day(pageState.nowSelectCity);
    }
    else if (time === 'week'){
      chartData = week(pageState.nowSelectCity);
    }
    else if (time === 'month'){
      chartData = month(pageState.nowSelectCity);
    }
    // 调用图表渲染函数
    renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(city) {
  // 确定是否选项发生了变化
  var lastChoice = pageState.nowSelectCity;
  pageState.nowSelectCity = city;
  if (lastChoice === city) {
    return;
  }
  else {
    // 设置对应数据
    graTimeChange(pageState.nowGraTime,true);
    // 调用图表渲染函数
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */

function initGraTimeForm() {
  form.addEventListener('click',function(event){
    if (event.target.tagName === 'INPUT') {
      graTimeChange(event.target.value,false);
    }
  })
}

/**
 * 初始化城市Select下拉选择框中的选项
 */

function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  for (var city in aqiSourceData) {
    if (aqiSourceData.hasOwnProperty(city)) {
      var data = aqiSourceData[city];
      var option = document.createElement('option');
      select.innerHTML += '<option  value="' + city + '">' + city +'</option>';
    }
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.addEventListener('click',function(event) {
    citySelectChange(event.target.value);
  })
}

/**
 * 初始化图表需要的数据格式
 */

function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData.div_number = Object.keys(aqiSourceData[pageState.nowSelectCity]).length;
  chartData.div_height = aqiSourceData[pageState.nowSelectCity];
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}

init();
