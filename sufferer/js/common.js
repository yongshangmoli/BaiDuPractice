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
