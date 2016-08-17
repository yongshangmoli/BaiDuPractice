(function (window, undefined) {
    /*
    飞船类
     */
    var Spaceship = function (orbitId) {
        var that = this;
        this.orbitId = orbitId;
        this.status = 0;//0表示停止，1表示飞行
        this.energy = 100;//初始能量100%
        this.destroyed = false;
        this.deg = 0;//初始旋转角度0
        this.removed = false;//是否已经从DOM中移除了该飞船，false表示还没有，true表示已经移除
        /*
        动力系统，飞行和停止
         */
        this.powerSystem = {
            //开始飞行
            start: function () {
                /*
                能量足够，开始航行
                 */
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
                    that.deg += 1;
                }
                that.deg = that.deg % 360;
            }
        };
        /*
        能量系统，能量消耗以及太阳能的补充
         */
        this.energySystem = {
            solarEnergy: function () {
                that.energy += 2;//太阳能补充速度
                if(that.energy > 100) {
                    that.energy = 100;
                }
            },
            consumeEnergy: function () {
                if(that.status === 1) {
                    that.energy -= 5;//能量每秒消耗速度
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
        /*
        飞船上的无线电系统，用来接收控制官发来的消息
         */
        this.radioSystem = {
            recieveMessage: function (message) {
                //检查消息是否是发给自己的
                if(message.id !== that.orbitId) {
                    return;
                }
                //执行命令
                switch(message.command) {
                    //开始飞行
                    case 'start':
                        that.powerSystem.start();
                        break;
                    //停止飞行
                    case 'stop':
                        that.powerSystem.stop();
                        break;
                    //自爆
                    default:
                        that.destroySystem.destroy();
                        break;
                }
            }
        };
        /*
        自毁系统
         */
        this.destroySystem = {
            destroy: function () {
                that.destroyed = true;
            }
        };
    };
    /*
    返回接口
     */
    window.Spaceship = Spaceship;
})(window);