/**
* 获取需要的DOM元素
*/
var left_in = document.getElementById('left_in');
var right_in = document.getElementById('right_in');
var left_out = document.getElementById('left_out');
var right_out = document.getElementById('right_out');
var input = document.getElementById('input');
var output = document.getElementById('output');
var search = document.getElementById('search');

/**
* 渲染div元素
*/
function render(value,direction) {
  var wrap = document.createElement('div');
  wrap.textContent = value;
  if (value === '') {
    return ;
  }
  if (direction === 'left') {
    output.insertBefore(wrap,output.firstChild);
  }
  if (direction === 'right') {
    output.appendChild(wrap);
  }
}
/**
* 读取数值
*/
function getData() {
  var value = input.value.trim().split(/,|，|、|\s|\n|\r|\t/);
  return value;
}
/**
* 删除数值
*/
function delData(ele) {
  output.removeChild(ele);
}
/**
* 显示数值
*/
function display(ele) {
  var value = ele.textContent;
  alert(value);
}
/**
* 查询数值
*/
function searchData() {
  var value = search.previousSibling.previousSibling.value.trim();
  var re = new RegExp(value);
  for (var i = 0; i < output.children.length; i++) {
    output.children[i].style.backgroundColor = 'CornflowerBlue';
    if (value != '' && output.children[i].textContent.match(re)) {
      output.children[i].style.backgroundColor = 'lightGreen';
    }
  }
}
/**
* 绑定点击事件
*/
function init() {
  document.body.addEventListener('click', function(event){
    if (event.target.id === 'left_in') {
      for (var i = 0; i < getData().length; i++) {
        render(getData()[i],'left');
      }
    }
    if (event.target.id === 'right_in') {
      for (var i = 0; i < getData().length; i++) {
        render(getData()[i],'right');
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
    if (event.target.parentElement.id === 'output') {
      delData(event.target);
    }
    if (event.target.id === 'search') {
      searchData();
    }
  })
}

init();
