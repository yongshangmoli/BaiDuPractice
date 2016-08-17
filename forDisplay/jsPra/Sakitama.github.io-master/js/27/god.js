(function (window, undefined) {
    var god = {};
    /**
     存储飞船对象
     */
    god.spaceshipObject = [];
    /**
     上帝是万能的，飞船由上帝来创造
     */
    var contain = basicFunction.getElement("#contain");
    god.createSpaceship = function (orbitId, powerSystem, energySystem) {
        var shipId = god.spaceshipObject.push(new Spaceship(orbitId, powerSystem, energySystem));
        var spaceshipDiv = document.createElement("div");
        spaceshipDiv.id = "spaceship" + shipId;
        spaceshipDiv.className = "space-ship orbit-ship" + orbitId;
        spaceshipDiv.innerHTML = "<div></div><p>100%</p>";
        contain.appendChild(spaceshipDiv);
    };
    /**
     BUS介质由上帝创造
     */
    god.BUS = {
        /**
         新型信号发射器
         */
        sendMessage: function (message) {//参数message是编码过后的二进制指令
            //300毫秒后广播消息
            setTimeout(function () {
                //解码
                var msg = god.BUS.Adapter.decoding(message);
                if(message.substr(0, 1) === "1") {//如果是重发的消息
                    message = message.substr(1);//去除第一个
                }
                //10%概率丢包
                if(Math.random() <= 0.1) {
                    basicFunction.showMessage("向 " + msg.receiver + " 发送的 " + msg.message.command + " 指令丢包！重新发送指令中...", "red");
                    god.BUS.sendMessage("1" + message);//发送指令失败，在前面添加1，表示该指令属于重发指令，继续尝试发送
                    return;
                }
                if(msg.retried) {
                    basicFunction.showMessage("重新向 " + msg.receiver + " 发送 " + msg.message.command + " 指令成功！", "#6fa3ff");
                } else {
                    basicFunction.showMessage("向 " + msg.receiver + " 发送 " + msg.message.command + " 指令成功！", "green");
                }
                if(msg.message.command == "create") {
                    //创建飞船
                    god.createSpaceship(msg.message.id, msg.message.drive, msg.message.energy);
                } else {
                    //向飞船广播消息
                    for(var i = 0; i < god.spaceshipObject.length; i++) {
                        //已销毁的飞船不处理
                        if(god.spaceshipObject[i].destroyed) {
                            continue;
                        }
                        //向飞船发送消息
                        god.spaceshipObject[i].radioSystem.receiveMessage(message);
                    }
                }
            }, 300);
        },
        /**
        编码器和解码器
         */
        Adapter: {
            /**
            编码器
            返回二进制指令，比如001000110，表示“在轨道2上创建能源系统为永久型的奔腾号”，如果前面有1表示重发命令，最长10位，最短5位，总共只有5、6、9和10长的可能性
             */
            encoding: function (orbitId, message) {
                var binary = "";
                switch(orbitId) {
                    case 0: binary += "000"; break;
                    case 1: binary += "001"; break;
                    case 2: binary += "010"; break;
                    case 3: binary += "011"; break;
                }
                switch(message.command) {
                    case "create":
                        binary += "00";
                        switch(message.powerSystem) {
                            case 0: binary += "00"; break;
                            case 1: binary += "01"; break;
                            case 2: binary += "10"; break;
                        }
                        switch(message.energySystem) {
                            case 0: binary += "00"; break;
                            case 1: binary += "01"; break;
                            case 2: binary += "10"; break;
                        }
                        break;
                    case "start": binary += "01"; break;
                    case "stop": binary += "10"; break;
                    case "destroy": binary += "11"; break;
                }
                return binary;
            },
            /**
            解码器，返回指令格式
             {
                 receiver: "轨道号",
                 message: {
                     id: number,
                     command: string,
                     drive: number,
                     energy: number
                 },
                 retried: false
             }
             */
            decoding: function (data) {
                var originalCommand = {receiver: null, message: {}, retried: false};//解码之后的命令格式
                if(data.substr(0, 1) === "1") {//如果该命令属于重发命令
                    originalCommand.retried = true;//retried为true表示该指令属于重发指令
                    data = data.substr(1);//去除重发标志
                }
                switch(data.substr(0, 3)) {//取前三个
                    case "000": originalCommand.receiver = "轨道1"; originalCommand.message.id = 0; break;
                    case "001": originalCommand.receiver = "轨道2"; originalCommand.message.id = 1; break;
                    case "010": originalCommand.receiver = "轨道3"; originalCommand.message.id = 2; break;
                    case "011": originalCommand.receiver = "轨道4"; originalCommand.message.id = 3; break;
                }
                switch(data.substr(3, 2)) {//取第四个和第五个
                    case "00"://create命令
                        originalCommand.message.command = "create";
                        switch(data.substr(5, 2)) {//取第六个和第七个
                            case "00": originalCommand.message.drive = 0; break;
                            case "01": originalCommand.message.drive = 1; break;
                            case "10": originalCommand.message.drive = 2; break;
                        }
                        switch(data.substr(7, 2)) {//取第八个个和第九个
                            case "00": originalCommand.message.energy = 0; break;
                            case "01": originalCommand.message.energy = 1; break;
                            case "10": originalCommand.message.energy = 2; break;
                        }
                        break;
                    case "01": originalCommand.message.command = "start"; break;
                    case "10": originalCommand.message.command = "stop"; break;
                    case "11": originalCommand.message.command = "destroy"; break;
                }
                return originalCommand;
            }
        }
    };
    /**
     开启运动定时器和能量定时器
     */
    (function () {
        /**
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
        /**
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
    /**
     返回接口
     */
    window.god = god;
})(window);
