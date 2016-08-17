/**
* 获取需要的DOM元素
*/
var left_in = document.getElementById('left_in');
var right_in = document.getElementById('right_in');
var left_out = document.getElementById('left_out');
var right_out = document.getElementById('right_out');
var input = document.getElementById('input');
var output = document.getElementById('output');
var sort = document.getElementById('sort');
/**
* 全局对象
*/
var DIVNUMBER = 0;
var SORT = false;
var INTERVALID;

/**
*生成随机元素
*/
function randomValue() {
  var random = [];
  var i;
  output.innerHTML = '';
  DIVNUMBER = 0;
  for (i = 0; i < 60; i++) {
    random.push(Math.ceil(Math.random() * 90 + 10));
    render(random[i],'left')
  }
}
/**
*渲染div元素
*/
function render(value,direction) {
  var wrap = document.createElement('div');
  DIVNUMBER ++;
  wrap.textContent = value;
  wrap.style.height = value * 2 + 'px';
  wrap.style.lineHeight = value * 2 + 'px';
  if (direction === 'left') {
    output.insertBefore(wrap,output.firstChild);
  }
  if (direction === 'right') {
    output.appendChild(wrap);
  }
}
/**
*验证数值以及队列个数
*/
function validate() {
  var value = input.value;
  if (value >= 10 && value.length <= 100 && DIVNUMBER < 60) {
    return true;
  }
  else if (DIVNUMBER >= 60) {
    alert('队列元素已满');
    return ;
  }
  else {
    alert('请输入合法字符');
    return ;
  }
}
/**
*读取数值
*/
function getData() {
  var value = input.value;
  return value;
}
/**
*删除数值
*/
function delData(ele) {
  output.removeChild(ele);
  DIVNUMBER --;
}
/**
*显示数值
*/
function display(ele) {
  var value = ele.textContent;
  alert(value);
}
/**
* 排序算法
*/
function sortData() {
  var data = [];
  for (var i = 0; i < output.children.length; i++) {
    data.push(output.children[i].textContent);
  }
  for (var x = 0; x < data.length; x++) {
    if (Number.parseInt(data[x]) > Number.parseInt(data[x+1])) {
      swap(x,x+1);
    }
  }
}
function swap(index1,index2) {
     setTimeout(function() {
      var cln=output.children[index1].cloneNode(true);
      var cln1=output.children[index2].cloneNode(true);
      output.replaceChild(cln1, output.children[index1]);
      output.replaceChild(cln, output.children[index2]);
    },10)
}

/**
*绑定点击事件
*/
function initClickEvent() {
  document.body.addEventListener('click', function(event){
    if (event.target.id === 'left_in') {
      if (validate()) {
        render(getData(),'left');
      }
    }
    if (event.target.id === 'right_in') {
      if (validate()) {
        render(getData(),'right');
      }
    }
    if (event.target.id === 'left_out') {
      var left_ele = output.firstChild;
      delData(left_ele);
      display(left_ele);
    }
    if (event.target.id === 'right_out') {
      var right_ele = output.lastChild;
      delData(right_ele);
      display(right_ele);
    }
    if (event.target.id === 'random') {
      randomValue();
    }
    if (event.target.id === 'sort') {
      if (SORT === false) {
        INTERVALID = setInterval(sortData,100);
        SORT = true;
      }
      else {
        return ;
      }
    }
    if (event.target.id === 'stop') {
      clearInterval(INTERVALID);
      SORT = false;
    }
    if (event.target.parentElement.id === 'output') {
      delData(event.target);
    }
  })
}

function init() {
  initClickEvent();
}

init();
