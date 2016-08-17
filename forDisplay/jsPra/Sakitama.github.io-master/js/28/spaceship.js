(function (window, undefined) {
    /**
     飞船类
     */
    var Spaceship = function (orbitId, powerSystem, energySystem) {
        var that = this;
        /**
        建造飞船，初始化飞船对象
         */
        this.orbitId = orbitId;
        this.rate = systemType.powerType[powerSystem].deg;
        this.consume = systemType.powerType[powerSystem].consumeEnergy;
        this.add = systemType.energyType[energySystem].solarEnergy;
        this.status = 0;//0表示停止，1表示飞行
        this.energy = 100;//初始能量100%
        this.destroyed = false;
        this.deg = 0;//初始旋转角度0
        this.removed = false;//是否已经从DOM中移除了该飞船，false表示还没有，true表示已经移除
        /**
         动力系统，飞行和停止
         */
        this.powerSystem = {
            //开始飞行
            start: function () {
                //能量足够，开始航行
                if(that.energy > 0) {
                    that.status = 1;
                }
            },
            //停止飞行
            stop: function () {
                that.status = 0;
            },
            //改变旋转角度
            changeDeg: function () {
                if(that.status === 1) {
                    that.deg += that.rate;
                }
                that.deg = that.deg % 360;
            }
        };
        /**
         能量系统，能量消耗以及太阳能的补充
         */
        this.energySystem = {
            solarEnergy: function () {
                that.energy += that.add;//太阳能补充速度
                if(that.energy > 100) {
                    that.energy = 100;
                }
            },
            consumeEnergy: function () {
                if(that.status === 1) {
                    that.energy -= that.consume;//能量每秒消耗速度
                }
                if(that.energy <= 0) {
                    that.status = 0;
                    that.energy = 0;
                }
            },
            //获取当前能源值
            getCurrentEnergy: function () {
                return that.energy;
            }
        };
        /**
         飞船上的无线电系统，用来接收控制官发来的消息
         */
        this.radioSystem = {
            receiveMessage: function (message) {
                //消息解码
                var msg = god.BUS.Adapter.decoding(message);
                //检查消息是否是发给自己的
                if(msg.message.id !== that.orbitId) {
                    return;
                }
                //执行命令
                switch(msg.message.command) {
                    //开始飞行
                    case "start":
                        that.powerSystem.start();
                        break;
                    //停止飞行
                    case "stop":
                        that.powerSystem.stop();
                        break;
                    //自爆
                    case "destroy":
                        that.destroySystem.destroy();
                        break;
                }
            },
            /**
             * 飞船的广播系统，用于向全宇宙广播自身状态
             */
            broadcastMessage: function () {
                god.BUS.sendMessage(god.BUS.Adapter.encoding("commander", {
                    id: that.orbitId,
                    command: "broadcast",
                    status: that.status,
                    energy: that.energy,
                    powerSystem: powerSystem,
                    energySystem: energySystem
                }));
            }
        };
        /**
         自毁系统
         */
        this.destroySystem = {
            destroy: function () {
                that.destroyed = true;
            }
        };
    };
    /**
     返回接口
     */
    window.Spaceship = Spaceship;
})(window);