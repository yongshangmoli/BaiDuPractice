(function () {
    /*创建子节点*/
    function _createChild(type, calssName, parent) {
        var ele = document.createElement(type);
        parent.appendChild(ele);
        ele.className = calssName;
        return ele;
    }
    /*创建mask*/
    function _createMask() {
        var mask = document.createElement('div');
        document.body.appendChild(mask);

        mask.xwrap = _createChild('div', 'xwrap', mask);

        mask.xwrapNav = _createChild('div', 'xwrap-nav', mask.xwrap);
        mask.xwrapClose = _createChild('button', 'xwrap-close', mask.xwrapNav);
        mask.xwrapClose.addEventListener('click', function () {
            mask.className = 'xmask hide';
            mask.xwrap.removeAttribute('style');
        });
        mask.xwrapTitle = _createChild('h3', 'xwrap-title', mask.xwrapNav);

        mask.xwrapMain = _createChild('div', 'xwrap-main', mask.xwrap);

        mask.xwrapFooter = _createChild('div', 'xwrap-footer', mask.xwrap);
        mask.xwrapBtn = _createChild('button', 'xwrap-btn', mask.xwrapFooter);
        mask.xwrapBtn.addEventListener('click', function () {
            mask.className = 'xmask hide';
            mask.xwrap.removeAttribute('style');
        });

        return mask;
    }

    function fnDown(event){
    	var oDrag = document.querySelector('.xwrap');
    	event = event || window.event;
    		//光标按下时，光标与面板之间的距离
    		disX = event.clientX - oDrag.offsetLeft,
    		disY = event.clientY - oDrag.offsetTop;
    	//移动
    	document.onmousemove = function (event){
    		event = event || window.event;
    		fnMove(event, disX, disY);
    	}
    	//释放
    	document.onmouseup = function (){
    		document.onmousemove = null;
    		document.onmouseup = null;
    	}

    }

    function fnMove (e, posX, posY){
    	var oDrag = document.querySelector('.xwrap'),
    		l = e.clientX - posX,
    		t = e.clientY - posY,
    		winW = document.documentElement.clientWidth || document.body.clientWidth,
    		winH = document.documentElement.clientHeight || document.body.clientHeight,
    		maxW = winW - oDrag.offsetWidth + oDrag.offsetWidth / 2,//解决translate(-50%, 0)偏移
    		maxH = winH - oDrag.offsetHeight;
    	if (l < oDrag.offsetWidth / 2) {
    		l = oDrag.offsetWidth / 2;
    	}else if (l > maxW){
    		l = maxW;
    	}
    	if (t < 0) {
    		t = 0;
    	} else if (t > maxH){
    		t = maxH;
    	}
    	oDrag.style.left = l + "px";
    	oDrag.style.top = t + "px";
    }



    var xm = {
        mask: null,
        init: function () {
            /*单例*/
            this.mask = this.mask || _createMask();
            this.mask.className = 'xmask show';

            this.mask.xwrap.style.width = this.width + 'px';
            this.mask.xwrapClose.innerHTML = 'x';
            this.mask.xwrapTitle.innerHTML = this.title;
            this.mask.xwrapMain.innerHTML = this.message;
            this.mask.xwrapBtn.innerHTML = this.btntext;

            this.mask.xwrapNav.onmousedown = fnDown;
        }
    };

    window.xmask = function (options) {

        if (options) {
            xm.width = options.width || 560;
            xm.title = options.title || '相关信息';
            xm.message = options.message || '这是一个浮出层';
            xm.btntext = options.btntext || '确定';
        } else {
            xm.width = 560;
            xm.title = '相关信息';
            xm.message = '这是一个浮出层';
            xm.btntext = '确定';
        }
        xm.init();
    }
})();
