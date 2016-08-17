(function (window, undefined) {
    var commander = {};
    /**
     记录各个轨道的状态，看是否存在飞船
     */
    commander.orbitStatusRecord = [false, false, false, false];
    /**
     创建飞船
     */
    commander.createSpaceship = function (orbitId, powerSystem, energySystem) {
        if(this.orbitStatusRecord[orbitId]) {//如果该轨道已经有飞船了
            basicFunction.showMessage("警告！ 轨道" + (orbitId + 1) + " 上已经存在飞船！", "orange");
            return;
        }
        this.orbitStatusRecord[orbitId] = true;
        basicFunction.showMessage("在 轨道" + (orbitId + 1) + " 上创建飞船！", "yellow");
        god.BUS.sendMessage(god.BUS.Adapter.encoding(orbitId, {
            command: "create",
            powerSystem: powerSystem,
            energySystem: energySystem
        }));
    };
    /**
     * 启动飞船
     */
    commander.startNavigate = function (orbitId) {
        if(!this.orbitStatusRecord[orbitId]) {//记录中该轨道没有飞船
            basicFunction.showMessage("警告！ 轨道" + (orbitId + 1) + " 上不存在飞船！", "orange");
            return;
        }
        basicFunction.showMessage("向 轨道" + (orbitId + 1) + " 发送开始飞行指令！", "yellow");
        //发送广播消息
        god.BUS.sendMessage(god.BUS.Adapter.encoding(orbitId, {
            command: "start"
        }));
    };
    /**
     * 飞船停止
     */
    commander.stopNavigate = function (orbitId) {
        if(!this.orbitStatusRecord[orbitId]) {//记录中该轨道没有飞船
            basicFunction.showMessage("警告！ 轨道" + (orbitId + 1) + " 上不存在飞船！", "orange");
            return;
        }
        basicFunction.showMessage("向 轨道" + (orbitId + 1) + " 发送停止飞行指令！", "yellow");
        //发送广播消息
        god.BUS.sendMessage(god.BUS.Adapter.encoding(orbitId, {
            command: "stop"
        }));
    };
    /**
     * 飞船自爆
     */
    commander.spaceshipDestroy = function (orbitId) {
        if(!this.orbitStatusRecord[orbitId]) {//记录中该轨道没有飞船
            basicFunction.showMessage("警告！ 轨道" + (orbitId + 1) + " 上不存在飞船！", "orange");
            return;
        }
        //从记录中删除飞船
        this.orbitStatusRecord[orbitId] = false;
        basicFunction.showMessage("向 轨道" + (orbitId + 1) + " 发送销毁指令！", "yellow");
        //发送广播消息
        god.BUS.sendMessage(god.BUS.Adapter.encoding(orbitId, {
            command: "destroy"
        }));
    };
    /**
     * 控制官的数据中心，接收来自飞船的广播信号
     */
    commander.DC = {
        receiveBroadcastMessage: function (message) {
            var msg = god.BUS.Adapter.decoding(message);
            if (msg.receiver !== "commander") {
                return;
            }
            //寻找记录
            var record = document.getElementById("record-" + msg.message.id);
            if(record === null) {
                //创建记录
                record = document.createElement("tr");
                record.id = "record-" + msg.message.id;
                for(var i = 0; i < 5; i++) {
                    record.appendChild(document.createElement("td"));
                }
                document.getElementsByTagName("table")[0].appendChild(record);
            }
            var items = record.getElementsByTagName("td");
            items[0].innerHTML = "轨道" + (msg.message.id + 1);
            items[1].innerHTML = systemType.powerType[msg.message.powerSystem].type;
            items[2].innerHTML = systemType.energyType[msg.message.energySystem].type;
            items[3].innerHTML = msg.message.status === 0 ? "停止" : "飞行";
            items[4].innerHTML = msg.message.energy + "%";
            //记录更新时间
            record.dataset.update = Date.now();
        }
    };
    /**
     * 考虑在丢包率比较大的情况下监控系统显示出特殊信息并且当销毁飞船3秒后自动清除记录
     */
    (function() {
        setInterval(function() {
            //所有记录
            var table = document.getElementsByTagName("table")[0];
            var records = table.getElementsByTagName("tr");
            //当前时间
            var t = Date.now();
            for(var i = 0; i < records.length; i++) {
                //表头
                if(!records[i].dataset.update) {
                    continue;
                }
                //与上次更新时间差距超过3秒则删除该轨道记录，超过1秒则标记为失联
                if(t - records[i].dataset.update > 3000) {
                    table.removeChild(records[i]);
                } else if(t - records[i].dataset.update > 1000) {
                    records[i].getElementsByTagName("td")[3].innerHTML = "失联";
                }
            }
        }, 1000);
    })();
    /**
     返回接口
     */
    window.commander = commander;
})(window);