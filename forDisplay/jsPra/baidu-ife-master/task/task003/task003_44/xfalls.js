(function (root, XFalls) {
    root.XFalls = XFalls();
})(window, function () {
    'use strict';

    function XFalls(options) {
        this.line = options.line || 4;//column
        this.width = options.width || '25%';//this.columnWidth
        this.padding = options.padding || 10;//gap
        this.margin = options.margin || 10;//
        this.box = document.querySelector('[data-xfalls]');//wrapper
        this.imgsrc = options.imgsrc || [];//图片源
        this.uls = [];//this.columnDiv
        this.mask = null;

        this.createUl();
        this.init(this.imgsrc.length);

        if (options.ajax) {
            this.ajaxObj = options.ajax;
            this.ajaxControl();
        }
    }

    XFalls.prototype.createUl = function () {
        for (var i = 0; i < this.line; i ++) {
            var ul = document.createElement('ul');
            this.uls.push(ul);
            ul.style.width = typeof this.width === 'string' ? this.width : this.width + 'px';
            this.box.appendChild(ul);

            if (typeof this.padding === 'number') {
                ul.style.padding  = '0 ' + this.padding / 2 + 'px';
            } else {
                ul.style.padding  = '0 ' + parseInt(this.padding) / 2 + 'px';
            }
        }

        this.min = this.uls[0].offsetHeight;
        this.minIndex = 0;
        console.log(this.min,this.minIndex);
    }

    function _createLi(_this, imgsrcArr, num, len) {
        var img = new Image();
        img.src = imgsrcArr[num];
        // console.log(img);
        _this.initEvent(img);
        img.onerror = function () {
            if (num >= len) {
                return;
            }
            _createLi(_this, imgsrcArr, num, len);
        }
        img.onload = function () {
            var li = document.createElement('li');
            li.appendChild(img);

            var min = _this.min,
                minIndex = _this.minIndex;

            for (var i = 0, hlen = _this.uls.length; i < hlen; i ++) {
                var ulH = _this.uls[i].offsetHeight;
                if (min > ulH) {
                    min = ulH;
                    minIndex = i;
                }
                // console.log(ulH);
            }

            if (typeof _this.margin === 'number') {
                li.style.margin = _this.margin + 'px 0';
            } else {
                li.style.margin = parseInt(_this.margin) + 'px 0';
            }
            _this.uls[minIndex].appendChild(li);
            _this.min = _this.uls[minIndex].offsetHeight;

            if (++ num >= len) {
                return;
            }
            _createLi(_this, imgsrcArr, num, len);
        }
    }

    XFalls.prototype.init = function (len) {
        _createLi(this, this.imgsrc, 0, len);
    }


    XFalls.prototype.initEvent = function (ele) {
        ele.addEventListener('click', function (e) {
            e.stopPropagation();
            var mask = document.createElement('div');
            var img = new Image();
            img.src = ele.src;
            mask.appendChild(img);
            mask.className = 'xmask';
            document.body.appendChild(mask);
            img.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            mask.addEventListener('click', function () {
                document.body.removeChild(mask);
            });
        });
    }


    XFalls.prototype.ajax = function (options) {

        var url = options.url;

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Msxml2.XMLHTTP');

        options.type = options.type || 'GET';

        var dataStr = '';

        if (typeof options.data === 'object') {
            for (var i in options.data) {
                dataStr += i + '=' + options.data[i] + "&";
            }
        }


        if (options.type === 'GET') {
            if (dataStr !== '') {
                url += "?" + dataStr;
            }
            xhr.open(options.type, url, true);
            xhr.send(null);
        } else {
            xhr.open(options.type, url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(dataStr);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >=200 && xhr.status <= 207 || xhr.status == 304) {
                    if (options.onsuccess) {
                        options.onsuccess(xhr.responseText);
                    } else {
                        if (options.onfailed) {
                            options.onfailed();
                        }
                    }
                }
            }
        }

    }

    XFalls.prototype.ajaxControl = function () {
        var _this = this;
        window.onscroll = function (){
            
            var windowHeight = document.documentElement.clientHeight;

            var bodyHeight = document.documentElement.offsetHeight;

            var scrollMaxHeight = bodyHeight-windowHeight;
            
            var scrollTop = document.body.scrollTop;
            
            _this.ajaxObj.onsuccess = function (responseText) {
                var json = JSON.parse(responseText);
                if (json.imgsrc) {
                    _createLi(_this, json.imgsrc, 0, json.imgsrc.length);
                }
            }

            if (scrollTop==scrollMaxHeight){
                _this.ajax(_this.ajaxObj);
            }
        }
    }

    return XFalls;
});
