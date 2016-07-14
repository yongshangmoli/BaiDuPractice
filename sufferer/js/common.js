function alert_msg(msg,className){
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
window.alert = alert_msg;
//lockScreen
var lockScreen = {
  _windowH : window.innerHeight,
  _page : document.getElementById("page")
}
function lockScreenHgt() {
  lockScreen._page.style.height = lockScreen._windowH + "px";
  lockScreen._page.style.overflow = "hidden";
}
function unlockScreenHgt() {
  lockScreen._page.style.height = "auto";
  lockScreen._page.style.overflow = "auto";
}

//loading
function showLoading(){
  var el = document.querySelector('.loading');
  var cover = document.querySelector('.doctor-cover');
  if(cover) {
    cover.style.display = 'block';
  }
  else {
    cover = document.createElement('div');
    cover.className = 'doctor-cover';
    cover.id = 'doctor_cover';
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
  var el = document.querySelector('.loading');
  var cover = document.querySelector('.doctor-cover');
  if(el) el.className = 'loading';
  if(cover) {cover.style.display = 'none';}
}
