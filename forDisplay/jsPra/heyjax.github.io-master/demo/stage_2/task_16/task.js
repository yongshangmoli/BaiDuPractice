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
 */
function addAqiData() {
  var city = document.getElementById('aqi-city-input').value;
  var value = document.getElementById('aqi-value-input').value;
  var error = document.getElementsByClassName('error');
  function validateCity(string) {
    //左边为字母正则表达式，右边为中文unicode的正则表达式
    var reg = /^[-'a-z\u4e00-\u9eff]{1,}$/i;
    return string.match(reg);
  }
  function validateValue(value){
    //这里如果用正则写，会不支持带有.0的数字，例如1.0，20.0
    return Number(value) === parseInt(value, 10);
  }

  if ( validateCity(city) && validateValue(value)) {
    aqiData[city.trim()] = value.trim();
    // 清除错误信息
    if (error.length != 0){
      error[0].parentNode.removeChild(error[0]);
    }
  }
  else {
    //错误信息处理
    var error_message = document.createElement('p');
    error_message.innerHTML = '请按规范输入！城市为中英文，指数值为数字';
    error_message.setAttribute('class','error');
    if (error.length === 0) {
      document.getElementById('add-btn').parentNode.appendChild(error_message);
    }
  }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var key;
  var table = document.getElementById('aqi-table');
  var table_header = '<td>城市</td><td>空气质量</td><td>操作</td>'
  if (document.getElementsByTagName('tr').length != 0) {
    table.innerHTML = '';
  }
  if (Object.keys(aqiData).length > 0) {
    table.innerHTML = table_header;
  }
  for(key in aqiData) {
     if(aqiData.hasOwnProperty(key)) {
       var value = aqiData[key];
       var value_td = '<td>'+ value +'</td><button>删除</button></tr>'
       var city_td = '<tr><td>'+ key +'</td><td>空气质量</td>'
       var tr = document.createElement('tr');
       table.appendChild(tr);
       tr.innerHTML = city_td + value_td;
     }
   }
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
function delBtnHandle(city_delete) {
  // do sth.
  delete aqiData[city_delete];
  renderAqiList();
}

function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  window.onload = function() {
    var add_button = document.getElementById('add-btn');
    var table = document.getElementById('aqi-table');
    add_button.addEventListener('click', function() {
      addBtnHandle();
      // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
      table.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
          var city_delete = event.target.parentNode.children[0].textContent;
          delBtnHandle(city_delete);
        }
      })
    })
  }
}

init();
