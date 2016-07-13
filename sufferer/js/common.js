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

( function( window ) {
  'use strict';
  function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }
  var hasClass, addClass, removeClass;

  if ( 'classList' in document.documentElement ) {
    hasClass = function( elem, c ) {
      return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
      elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
      elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem, c ) {
      return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
      if ( !hasClass( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function( elem, c ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem, c ) {
    var fn = addClass;
    fn( elem, c );
  }

  window.classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };
})(window);
