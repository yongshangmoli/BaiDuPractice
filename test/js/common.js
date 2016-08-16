/*
var suffererRecord = {
	preDoctor : "Pei",
	preSufferer : [],
	curSufferer : {},
};
var utilG = {
	nullCheck : function(text) {
		return !(text === "" || text === null);
	},
};
//header返回按键
$("#goback").on("click",function(e) {
	console.log(11);
	window.history.go(-1);
});
*/

var tencarePayUtil = tencarePayUtil || {};
var tencareConfig = tencareConfig || {};
var urlId = urlId || 0;

//禁止后退
if(urlId == 4 || urlId == 5){
    window.history.pushState('noback','','');
    window.onpopstate = function(){ history.go(1);};
}

tencarePayUtil.getParameterFromQueryString  = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var global_options = {
    type: "POST",
    url: "http://doctor.qq.com/asapi/app/TencarePay3/config?u=" + urlId + "&oid=" + ( tencarePayUtil.getParameterFromQueryString("oid")==null?"":tencarePayUtil.getParameterFromQueryString("oid") ),
    data: "",
    dataType: "json",
    timeout: 3000,
    success: function(ret, textStatus, XHR){
        if(ret.code == 0 ) {
            tencareConfig = ret.config;
            if(tencareConfig.is_authoriz == false ) {
                window.location.replace(tencareConfig.authoriz_url);    // 跳转授权
            }

            if( typeof uploadMedia == 'function' ) {
                uploadMedia();
            }
        }
    }
};


jQuery(function(){
    jQuery.ajax(global_options);
    // 调试用
    // tencareConfig = {"patient_info_url":"http://doctor.qq.com/asapi/app/TencarePay3/savePatientInfo?oid=gh_361b076915ae","disease_info_url":"http://doctor.qq.com/asapi/app/TencarePay3/saveIllness?oid=gh_361b076915ae","pay_config_url":"http://doctor.qq.com/asapi/app/TencarePay3/pay?oid=gh_361b076915ae","upload_media_url":"http://doctor.qq.com/asapi/app/TencarePay3/uploadMedia","pending_info_url":"http://doctor.qq.com/asapi/app/TencarePay3/getPendingInfo?oid=gh_361b076915ae","consultant_info_url":"http://doctor.qq.com/asapi/app/TencarePay3/getConsultantInfo?oid=gh_361b076915ae","authoriz_url":"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3f5ba44683fedc08&redirect_uri=http%3A%2F%2Fdoctor.qq.com%2Fasapi%2Fapp%2FTencarePay3%2Fcallback%3Foid%3Dgh_361b076915ae%26u%3D0&response_type=code&scope=snsapi_base&state=6577&component_appid=wx8211b9778a163fd7#wechat_redirect","is_authoriz":false};
    // if( typeof uploadMedia == 'function' ) {
    //     uploadMedia();
    // }
});




function alert_msg(msg,className){
  var className = className || 'alert_tip';
  function lock(e){e.preventDefault();}
  var el = document.querySelector('.'+className);
  if(!el) {
    el = document.createElement('div');
    document.body.appendChild(el);
  }
  else {
    // el.style.display = "block";
    $(el).fadeIn('slow');
  }
  document.addEventListener('touchstart',lock);
  el.addEventListener('touchend',function(e){
    var target = e.target;
    if(target.tagName.toLowerCase() !== 'span') return;
    el.style.display = "none";
    document.removeEventListener('touchstart',lock);
    clearTimeout(timer);
  });
  el.innerHTML = '<span></span>'+msg || '';
  el.className = className+' active';
  var timer = setTimeout(function() {
    // el.style.display = "none";
    $(el).fadeOut('slow');
    document.removeEventListener('touchstart',lock);
    clearTimeout(timer);
  },2000);
}

window.Alert = alert;
window.alert = alert_msg;
/*//lockScreen
var lockScreen = {
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
}
*/
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

// //点击流
// (function(){
//   if(window.doctor){
//     return;
//   };

//   var doctor={};
//   doctor.count=function(){if (typeof(pgvMain) == 'function') pgvMain()};
//   doctor.loadScript=function(url,callback){
//     var script = document.createElement('script');
//     script.type = "text/javascript";
//     if (script.readyState) {
//       script.onreadystatechange = function() {
//         if (script.readyState == "loaded" || script.readyState == "complete") {
//           script.onreadystatechange = null;
//           if (callback) {
//             callback()
//           }
//         }
//       }
//     } else {
//       script.onload = function() {
//         if (callback) {
//           callback()
//         }
//       }
//     }
//     script.src = url;
//     document.body.appendChild(script)
//   };

//   doctor.init=function(){
//     doctor.loadScript('http://pingjs.qq.com/tcss.ping.js',function(){doctor.count()});
//   };

//   window.doctor=doctor;
//   doctor.init();
// })();