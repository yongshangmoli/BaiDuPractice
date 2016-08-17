(function (window, undefined) {
    var commander = {};
    /*
    记录各个轨道的状态，看是否存在飞船
     */
    commander.orbitStatusRecord = [false, false, false, false];
    /*
    创建飞船
     */
    commander.createSpaceship = function (orbitId) {
        if(this.orbitStatusRecord[orbitId]) {//如果该轨道已经有飞船了
            basicFunction.showMessage("轨道" + (orbitId + 1) + "上已经存在飞船！", "orange");
            return;
        }
        this.orbitStatusRecord[orbitId] = true;
        basicFunction.showMessage("在轨道" + (orbitId + 1) + "上创建飞船！", "yellow");
        god.createSpaceship(orbitId);
    };
    //开始飞行，如果该轨道上存在多艘飞船，则一起飞行
    commander.startNavigate = function (orbitId) {
        if(!this.orbitStatusRecord[orbitId]) {//记录中该轨道没有飞船
            basicFunction.showMessage("轨道" + (orbitId + 1) + "上不存在飞船！", "orange");
            return;
        }
        basicFunction.showMessage("向轨道" + (orbitId + 1) + "发送开始飞行指令！", "yellow");
        //发送广播消息
        god.Mediator.sendMessage({
            id: orbitId,
            command: 'start'
        });
    };
    //停止飞行，如果该轨道上存在多艘飞船，则一起停止
    commander.stopNavigate = function (orbitId) {
        if(!this.orbitStatusRecord[orbitId]) {//记录中该轨道没有飞船
            basicFunction.showMessage("轨道" + (orbitId + 1) + "上不存在飞船！", "orange");
            return;
        }
        basicFunction.showMessage("向轨道" + (orbitId + 1) + "发送停止飞行指令！", "yellow");
        //发送广播消息
        god.Mediator.sendMessage({
            id: orbitId,
            command: 'stop'
        });
    };
    //销毁飞船，如果该轨道上存在多艘飞船，则一起销毁
    commander.spaceshipDestroy = function (orbitId) {
        if(!this.orbitStatusRecord[orbitId]) {//记录中该轨道没有飞船
            basicFunction.showMessage("轨道" + (orbitId + 1) + "上不存在飞船！", "orange");
            return;
        }
        //从记录中删除飞船
        this.orbitStatusRecord[orbitId] = false;
        basicFunction.showMessage("向轨道" + (orbitId + 1) + "发送销毁指令！", "yellow");
        //发送广播消息
        god.Mediator.sendMessage({
            id: orbitId,
            command: 'destroy'
        });
    };
    /*
    返回接口
     */
    window.commander = commander;
})(window);