/**
 * 2016.3.23
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 * 去空格的正则表达式见下面
 */
function addAqiData() {
	if (!String.prototype.trim) {
		  String.prototype.trim = function () {
			  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
			 /* this.replace(/(^s*)|(s*$)/g, "")*/
		  };
	}
	/*错误信息渲染在页面上，且已有错误信息时不重复渲染*/
	var city = document.getElementById('aqi-city-input');
	var airQuality = document.getElementById('aqi-value-input');
	var cityIsOK = checkCity(city.value.trim());
	var airQualityIsOK = checkNum(airQuality.value.trim());
	if(!cityIsOK && city.parentNode.getElementsByTagName('p').length === 0) {
		var p = document.createElement('p');
		city.parentNode.appendChild(p);
		p.innerHTML = 'Error:the name of the city should be English or chinese';
	}
	if(!airQualityIsOK && airQuality.parentNode.getElementsByTagName('p').length === 0) {
		var p = document.createElement('p');
		airQuality.parentNode.appendChild(p);
		p.innerHTML = 'Error:the input of air quality should be a integer';
	}
	if(cityIsOK && airQualityIsOK) {
		aqiData[city.value.trim()] = airQuality.value.trim();
	}
}
/*判断城市输入是否为中文或英文，只有全部为中文或者全部为英文时才算合格*/
function checkCity(city) {
	if(/^[A-Za-z]+$/.test(city) || /^[^u4e00-u9fa5]+$/.test(city)) {
		return true;
	}
	return false;
}
/*判断输入是否为数字，正，负，0都可以*/
function checkNum(airQuality) {
	var reg = /^[-]?[1-9]+$|0/;
	if(reg.test(airQuality)) {
		return true;
	}
	return false;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	if(!isEmpty(aqiData)) {
		/*检查是否有错误信息，若有先将它们去掉*/
		var label1 = document.getElementById('aqi-city-input');
		var error1 = label1.nextSibling;
		console.log(error1);
		if(error1) {
			label1.parentNode.removeChild(error1);
		}
		var label2 = document.getElementById('aqi-value-input');
		var error2 = label2.nextSibling;
		if(error2) {
			label2.parentNode.removeChild(error2);
		}
		/*在table中插入节点*/
		var table = document.getElementById('aqi-table');
		if(!table.hasChildNodes()) {
			var tr = document.createElement('tr');
			var infos = ['城市','空气质量','操作'];
			table.appendChild(tr);
			tr.innerHTML = '<td>城市</td><td>空气质量</td><td>操作</td>';
		}
		for(index in aqiData) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			tr.innerHTML = '<td>'+index+'</td><td>'+aqiData[index]+'</td><td><button>删除</button></td>';
		}
		aqiData = {};
	}
}

function isEmpty(obj) {
    for (var name in obj) 
    {
        return false;
    }
    return true;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
/*function delBtnHandle() {
	
	console.log('as');
}
*/
function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	var addBtn = document.getElementById('add-btn');
	addBtn.onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	var table = document.getElementById('aqi-table');
	table.addEventListener('click', function(e) {
		if(e.target.innerHTML === '删除') {
			 e.currentTarget.removeChild(e.target.parentNode.parentNode);
		}
	});
}
init();
/*
 *在插入节点时也可以不通过innerHTML来操作
var infos = [index,aqiData[index],'删除'];
for(var i=0;i<3;i++) {
    for(var i=0;i<3;i++) {
	var td = document.createElement('td');
	tr.appendChild(td);
	if(i === 2) {
		var btn = document.createElement('button');
		var info = document.createTextNode(infos[i]);
		btn.appendChild(info);
		td.appendChild(btn);
	}
	else {
		var info = document.createTextNode(infos[i]);
		td.appendChild(info);
	}
}*/