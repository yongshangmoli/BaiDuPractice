(function (window, undefined) {
    var god = {};
    /*
    存储飞船对象
     */
    god.spaceshipObject = [];
    /*
    无线电介质
     */
    var contain = basicFunction.getElement("#contain");
    /*
    上帝是万能的，飞船由上帝来创造
     */
    god.createSpaceship = function (orbitId) {
        //1秒后发送创建飞船消息
        setTimeout(function() {
            //一定概率（30%）丢包
            if(Math.random() <= 0.3) {
                basicFunction.showMessage("向轨道" + (orbitId + 1) + "发送的 create 指令丢包了！", "red");
                return;
            }
            basicFunction.showMessage("向轨道" + (orbitId + 1) + "发送 create 指令成功！", "green");
            var shipId = god.spaceshipObject.push(new Spaceship(orbitId));
            var spaceshipDiv = document.createElement("div");
            spaceshipDiv.id = "spaceship" + shipId;
            spaceshipDiv.className = "space-ship orbit-ship" + orbitId;
            spaceshipDiv.innerHTML = "<div></div><p>100%</p>";
            contain.appendChild(spaceshipDiv);
        }, 1000);
    };
    /*
     Mediator介质由上帝创造
     */
    god.Mediator = {
        sendMessage: function (message) {
            //1秒后发送消息
            setTimeout(function() {
                //30%概率丢包
                if(Math.random() <= 0.3) {
                    basicFunction.showMessage("向轨道" + (message.id + 1) + "发送的 " + message.command + " 指令丢包了！", "red");
                    return;
                }
                basicFunction.showMessage("向轨道" + (message.id + 1) + "发送 " + message.command + " 指令成功！", "green");
                for(var i = 0; i < god.spaceshipObject.length; i++) {
                    //已销毁的飞船不做处理
                    if(god.spaceshipObject[i].destroyed) {
                        continue;
                    }
                    //向所有未被摧毁的飞船广播消息
                    god.spaceshipObject[i].radioSystem.recieveMessage(message);
                }
            }, 1000);
        }
    };
    /*
    开启运动定时器和能量定时器
     */
    (function () {
        var contain = basicFunction.getElement("#contain");
        /*
         运动定时器
         */
        god.moveTimer = setInterval(function () {
            for(var i = 0; i < god.spaceshipObject.length; i++) {
                var ship = basicFunction.getElement("#spaceship" + (i + 1));
                //destroyed为true的飞船不处理
                //destroyed为true，再判断是否removed为false，如果是则从DOM中移除该飞船
                if (god.spaceshipObject[i].destroyed) {
                    if (!god.spaceshipObject[i].removed) {
                        contain.removeChild(ship);
                        god.spaceshipObject[i].removed = true;
                    }
                    continue;
                }
                //改变角度
                god.spaceshipObject[i].powerSystem.changeDeg();
                //修改飞船位置
                ship.style.webkitTransform = "rotate(" + god.spaceshipObject[i].deg + "deg)";
                ship.style.mozTransform = "rotate(" + god.spaceshipObject[i].deg + "deg)";
                ship.style.msTransform = "rotate(" + god.spaceshipObject[i].deg + "deg)";
                ship.style.oTransform = "rotate(" + god.spaceshipObject[i].deg + "deg)";
                ship.style.transform = "rotate(" + god.spaceshipObject[i].deg + "deg)";
                //能源显示
                var currentEnergy = god.spaceshipObject[i].energySystem.getCurrentEnergy();
                ship.firstElementChild.style.width = currentEnergy + "px";
                ship.lastElementChild.innerHTML = currentEnergy + "%";
            }
        }, 100);
        /*
        能量定时器
         */
        god.energyTimer = setInterval(function () {
            for(var i = 0; i < god.spaceshipObject.length; i++) {
                //已销毁的飞船不处理
                if(god.spaceshipObject[i].destroyed) {
                    continue;
                }
                //太阳能充能系统
                god.spaceshipObject[i].energySystem.solarEnergy();
                //飞行耗能
                god.spaceshipObject[i].energySystem.consumeEnergy();
            }
        }, 1000);
    })();
    /*
    返回接口
     */
    window.god = god;
})(window);
