/*function alert_msg(msg,className){
  var className = className || 'alert_tip';
  function lock(e){e.preventDefault();}
  var el = document.querySelector('.'+className);
  if(!el) {
    el = document.createElement('div');
    document.body.appendChild(el);
  }
  else {
  	el.style.display = "block";
  }
  document.addEventListener('touchstart',lock);
  el.addEventListener('touchend',function(e){
    var target = e.target;
    if(target.tagName.toLowerCase() !== 'span') return;
    el.style.display = "none";
    document.removeEventListener('touchstart',lock);
  });
  el.innerHTML = '<span></span>'+msg || '';
  el.className = className+' active';
}
window.Alert = alert;
window.alert = alert_msg;*/
//lockScreen
var lockScreen = {
  _page : document.getElementsByTagName("html")[0]
};
function lockScreenHgt() {
  // lockScreen._page.style.height = lockScreen._windowH + "px";
  lockScreen._page.className = "hide-height";
}
function unlockScreenHgt() {
  // lockScreen._page.style.height = "100%";
  lockScreen._page.className = "";
}
/*var lockScreen = {
  _windowH : window.innerHeight,
  _page : document.getElementById("page"),
  _subBtn : document.querySelector('.patient-btn'),
}
function lockScreenHgt() {
  // lockScreen._page.style.height = lockScreen._windowH + "px";
  lockScreen._page.className = "page hide-height";
}
function unlockScreenHgt() {
  // lockScreen._page.style.height = "100%";
  lockScreen._page.className = "page";
}*/
//传入参数表示是否添加点击隐藏的事件，(和是否使用透明蒙层?)
function showTraptCover(needEvt) {
  // lockScreenHgt();
  var cover = document.querySelector('.tranparent-cover');
  if(cover) {
    cover.style.display = 'block';
  }
  else {
    cover = document.createElement('div');
    cover.className = 'tranparent-cover';
    cover.id = 'tranparent_cover';
    document.body.appendChild(cover);
    if(needEvt) {
      $(cover).on("click",function() {
          this.style.display = 'none';
          var el = document.querySelector('.alert_tip');
          if(el) {el.style.display = 'none';}
          unlockScreenHgt();
      });
    }
  }
}

function hideTraptCover() {
  
  var cover = document.getElementById('tranparent_cover');
  if(cover) {cover.style.display = 'none';}
}

//loading
function showLoading(){
  lockScreenHgt();
  var el = document.querySelector('.loading');
  var cover = document.querySelector('.tranparent-cover');
  if(cover) {
    cover.style.display = 'block';
  }
  else {
    cover = document.createElement('div');
    cover.className = 'tranparent-cover';
    cover.id = 'tranparent_cover';
    document.body.appendChild(cover);
  }
  if(el) { 
    el.className = 'loading active'; 
    return; 
  }
  el = document.createElement('div');
  el.className = 'loading active';
  document.body.appendChild(el);
}

function hideLoading() {
    unlockScreenHgt();
    var el = document.querySelector('.loading');
    var cover = document.getElementById('tranparent_cover');
    if(el) el.className = 'loading';
    if(cover) {cover.style.display = 'none';}
}

/*function alert_msg(msg,className){
  var className = className || 'alert_tip';
  lockScreenHgt();
  showTraptCover(true);
  // function lock(e){e.preventDefault();}
  var el = document.querySelector('.'+className);
  if(!el) {
    el = document.createElement('div');
    document.body.appendChild(el);
  }
  else {
    el.style.display = "block";
  }
  el.addEventListener('touchend',function(e){
    var target = e.target;
    if(target.tagName.toLowerCase() !== 'span') return;
    el.style.display = "none";
  });
  el.innerHTML = '<span></span>'+msg || '';
  el.className = className+' active';
}
window.Alert = alert;
window.alert = alert_msg;*/