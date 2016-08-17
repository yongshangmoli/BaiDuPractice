/**
 * 		2016-4-6 更新
 * 		代码整体重构
 * 		将go方法与四个tra方法合并为一个方法
 * 		将四个mov方法合并为一个方法
 * 		将三个tun方法合并为一个方法
 * 		用事件委托代替了子元素的事件监听
 */

var block = document.querySelector('#block'),
    inputs = document.querySelectorAll('#inputs input'),
    btns = document.querySelector('#btns'),
    traBtns = document.querySelector('#trabtns');

(function init() {
    //小方块随机位置
    function random() {
        return Math.floor(Math.random() * 10 + 1) * 50 ;
    }
    block.style.transform = "translate(" + random() + "px, " + random() + "px) rotate(0deg)";
    //给小方块添加方法
    //获取坐标以及角度
    block.getAttr = function () {
        var arr = this.style.transform.match(/-?\d+/g);
        for (var i = 0, len = arr.length; i < len; i ++) {
            arr[i] = parseInt(arr[i]);
        }
        return arr;
    };
    //判断方向
    block.direction = function () {
        var deg = this.getAttr()[2];
        while (deg > 360) {
            deg -= 360;
        }
        while (deg < -360) {
            deg += 360;
        }
        var dir = deg / 90;
        if (dir === 1 || dir === -3) {
            return 'right';
        } else if (dir === 2 || dir === -2) {
            return 'down';
        } else if (dir === 3 || dir === -1) {
            return 'left';
        } else {
            return 'top';
        }
    }
    //不带参为GO方法，带参为TRA方法
    block.go = function (direct) {
        var direction = direct || this.direction(),
            tempArr = this.getAttr(),
            x = tempArr[0],
            y = tempArr[1],
            deg = tempArr[2];

        if (direction === 'top') {
            y -= y - 50 > 0 ? 50 : 0;
        } else if (direction === 'left') {
            x -= x - 50 <= 0 ? 0 : 50;
        } else if (direction === 'down') {
            y += y + 50 < 550 ? 50 : 0;
        } else if (direction === 'right'){
            x += x + 50 >= 550 ? 0 : 50;
        }

        this.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + deg + "deg)";
    }
    //MOV系列方法
    block.mov = function (direct) {
        if (direct === 'top' || direct === 'left') {
            while (this.direction() !== direct) {
                var tempArr = this.getAttr(),
                    x = tempArr[0],
                    y = tempArr[1],
                    deg = tempArr[2];

                deg -= 90;
                this.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + deg + "deg)";
            }
            this.go(direct);
        } else if (direct === 'down' || direct === 'right') {
            while (this.direction() !== direct) {
                var tempArr = this.getAttr(),
                    x = tempArr[0],
                    y = tempArr[1],
                    deg = tempArr[2];

                deg += 90;
                this.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + deg + "deg)";
            }
            this.go(direct);
        }
    }

    block.tun = function (direct) {
        var tempArr = this.getAttr();
        var x = tempArr[0];
        var y = tempArr[1];
        var deg = tempArr[2];

        if (direct === 'left') {
            deg -= 90;
        } else if (direct === 'right') {
            deg += 90;
        } else if (direct === 'bac') {
            deg += 180;
        }

        this.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + deg + "deg)";
    }
    //根据命令判断并执行合适的方法
    block.cpu = function (command) {
        if (command === 'GO' || command === 'go') {
            this.go();
        } else if (command === 'TRA TOP' || command === 'tra top') {
            this.go('top');
        } else if (command === 'TRA RIG' || command === 'tra rig') {
            this.go('right');
        } else if (command === 'TRA BOT' || command === 'tra bot') {
            this.go('down');
        } else if (command === 'TRA LEF' || command === 'tra lef') {
            this.go('left');
        } else if (command === 'MOV TOP' || command === 'mov top') {
            this.mov('top');
        } else if (command === 'MOV RIG' || command === 'mov rig') {
            this.mov('right');
        } else if (command === 'MOV BOT' || command === 'mov bot') {
            this.mov('down');
        } else if (command === 'MOV LEF' || command === 'mov lef') {
            this.mov('left');
        } else if (command === 'TUN RIG' || command === 'tun rig') {
            this.tun('right');
        } else if (command === 'TUN BAC' || command === 'tun bac') {
            this.tun('bac');
        } else if (command === 'TUN LEF' || command === 'tun lef') {
            this.tun('left');
        } else {
            return 'no';
        }
    }
})();

traBtns.addEventListener('click', function (e) {
    if (e.target && e.target.nodeName === 'BUTTON') {
        block.cpu(e.target.innerHTML);
    }
});
btns.addEventListener('click', function (e) {
    if (e.target && e.target.nodeName === 'BUTTON') {
        block.cpu(e.target.innerHTML);
    }
});

//input btn
(function () {

    function dispose() {
        block.cpu(inputs[0].value);
        inputs[0].value = '';
    }

    inputs[0].addEventListener('keydown', function (e) {
        e = e || window.event;
        if (e.keyCode == '13') {
            dispose();
        }
    }, false);

    inputs[1].addEventListener('click', function () {
        dispose();
    }, false);

})();
