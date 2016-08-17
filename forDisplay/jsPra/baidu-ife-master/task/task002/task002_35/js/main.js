/**
 *    4.11更新
 *    添加行数统计
 *    添加错误提醒
 */
var block = document.querySelector('#block'),
    text = document.querySelector('.console textarea'),
    rows = document.querySelector('.rows');

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
    //TUN方法
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

(function () {
    var btns = document.querySelectorAll('#inputs input'),
        performBtn = btns[0],
        emptyBtn = btns[1];
        emptyBtn.addEventListener('click', function () {
            text.value = '';
            rows.innerHTML = '';
        });
        text.addEventListener('keyup', function () {
            rows.innerHTML = '';
            var rowArr = text.value.split('\n');
            for (var i = 0, len = rowArr.length; i < len; i ++) {
                var p = document.createElement('p');
                rows.appendChild(p);
                p.innerHTML = i + 1;
            }
            rows.scrollTop = text.scrollTop;
        });
        performBtn.addEventListener('click', function () {
            var arr = text.value.split('\n'),
                timer = null,
                len = arr.length,
                resultArr = [],
                cmdArr = ['GO', 'go', 'TRA TOP', 'TRA RIG', 'TRA BOT', 'TRA LEF', 'tra top', 'tra rig', 'tra bot', 'tra lef', 'MOV TOP', 'MOV RIG', 'MOV BOT', 'MOV LEF', 'mov top', 'mov rig', 'mov bot', 'mov lef', 'TUN RIG', 'TUN BAC', 'TUN LEF', 'tun rig', 'tun bac', 'tun lef'];

            for (var i = 0; i < len; i ++) {
                if (/\s\d+$/.test(arr[i])) {
                    var cmd = arr[i].replace(/\s\d+$/, ''),
                        hasCmd = false;
                    for (var k = 0; k < cmdArr.length; k++) {
                        if (cmd == cmdArr[k]) {
                            hasCmd = true;
                        }
                    }
                    if (!hasCmd) {
                        resultArr.push([arr[i], i]);
                        continue;
                    }
                    var temp = parseInt(arr[i].match(/\s\d+$/)[0]);
                    for (var j = 0; j < temp; j ++) {
                        resultArr.push([cmd, i]);
                    }
                } else {
                    resultArr.push([arr[i], i]);
                }
            }
            i = 0;
            len = resultArr.length;
            clearInterval(timer);
            timer = setInterval(function () {

                if (block.cpu(resultArr[i][0]) === 'no') {
                    rows.querySelectorAll('p')[resultArr[i][1]].style.backgroundColor = 'red';
                }
                i ++;
                if (i >= len) {
                    clearInterval(timer);
                }
            }, 500);
        });

})();
