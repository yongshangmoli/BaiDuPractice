
/*(function() {
})();*/

//飞船
function Ship(orbit,powerType,energyType) {
	var ship = {
			_flying : false, //是否处于飞行状态
			_energy : 100,//初始能量
			_destroy : false,//是否摧毁
			_angle : 0, //旋转角度
			_orbit : orbit,//处于哪个轨道
			_clear : false,//是否已经从DOM中移除了该飞船
			_ergSub : powerType.ergSub, //能源消耗
			_ergAdd : energyType.ergAdd,//能源补充
			_rttdeg : powerType.deg,//旋转角度
		
			//动力系统，两部分：开始飞行&停止飞行
			powerSystem : {
				start : function() {
					if(ship._energy > 0) {
						ship._flying = true;
					}
				},
				stop : function() {
					ship._flying = false;
				},
				fly : function() {
	                if(ship._flying) {
	                	ship._angle += ship._rttdeg;
	                }
	                ship._angle %= 360;
	            }
			},
			
			//能源系统:能源增加,消耗,获取当前能源值
			energySystem : {
				energyAdd : function() {
					ship._energy += ship._ergAdd;
					if(ship._energy > 100) {
						ship._energy = 100;
					}
				},
				energySub : function() {
					if(ship._flying) {
						ship._energy -= ship._ergSub;
					}
					if(ship._energy <= 0) {
						ship._flying = false;
						ship._energy = 0;
					}
				},
				energyValue : function() {
					return ship._energy;
				}
			},
			
			//信号接收处理系统:开始飞行，停止飞行，自毁
			signalSystem : {
				analyseMsg : function(msg) {
					if(msg.orbitId != ship._orbit) {
						return;
					}
					switch (msg.cmd) {
						case 'start':
							ship.powerSystem.start();
							break;
						case 'stop':
							ship.powerSystem.stop();
							break;
						case 'destroy':
							ship.destroy();
							break;
						default:
							break;
					}
				}
			},
			
			//自毁系统
			destroy : function() {
				ship._destroy = true;
			}
	}
	return ship;
}


//指挥官
var cmder = {
	//记录个轨道是否有飞船
	orbitStates : [false,false,false,false],
	//创建飞船的命令
	createShip : function(orbit,powerType,energyType)  {
		if(this.orbitStates[orbit]) {
			log("轨道" + (orbit + 1) + "上已经存在飞船！", "red");
			return;
		}
		this.orbitStates[orbit] = true;
		log("轨道" + (orbit + 1) + "创建飞船！", "green");
		shipManager.BUS.sendMsg(shipManager.BUS.Adapter.encode({
			onceMore:0,
			orbitId:orbit,
			cmd:'create',
			powerType:powerType,
			energyType:energyType
		}));
	},
	//让飞船飞行的命令
	flyShip : function(orbit) {
		if(!this.orbitStates[orbit]) {
			log("轨道" + (orbit + 1) + "上无飞船！", "red");
		}
		log("轨道" + (orbit + 1) + "飞船起飞！", "green");
		shipManager.BUS.sendMsg(shipManager.BUS.Adapter.encode({
			onceMore:0,
			orbitId:orbit,
			cmd:'start'
		}));
	},
	//让飞船停止的命令
	stopShip : function(orbit) {
		if(!this.orbitStates[orbit]) {
			log("轨道" + (orbit + 1) + "上无飞船！", "red");
		}
		log("轨道" + (orbit + 1) + "飞船停止飞行！", "green");
		shipManager.BUS.sendMsg(shipManager.BUS.Adapter.encode({
			onceMore:0,
			orbitId:orbit,
			cmd:'stop'
		}));
	},
	//让飞船自爆的命令
	destroyShip : function(orbit) {
		if(!this.orbitStates[orbit]) {
			log("轨道" + (orbit + 1) + "上无飞船！", "red");
		}
		this.orbitStates[orbit] = false;
		log("轨道" + (orbit + 1) + "飞船自爆！", "green");
		shipManager.BUS.sendMsg(shipManager.BUS.Adapter.encode({
			onceMore:0,
			orbitId:orbit,
			cmd:'destroy'
		}));
	}
}




//飞船管理员
var shipManager = {
	shipList : [],
	//创建飞船并添加到图层中
	createShip : function(orbit,powerType,energyType)  {
		var ships = shipManager.shipList.push(new Ship(orbit,powerType,energyType));
		var shipDiv = document.createElement("div");
		shipDiv.id = "ship"+orbit;
		shipDiv.className = "ship orbit"+orbit+"-ship";
		shipDiv.innerText = "100%";
		document.body.appendChild(shipDiv);
	},

	BUS : {
		/**
		 * 消息设计
		 * msg : {
		 * 		onceMore : 0/1;0非重发，1重发
		 * 		orbitId : 0-3;
		 * 		cmd : 'start/..'
		 * 		(如果是start才会有后面的字段)
		 * 		powerType : 0-2;
		 * 		energyType : 0-2;
		 * }
		 * 二进制的命令：00000（0000）
		 * 		第一位表示是否是重发
		 * 		第二三位表示轨道
		 * 		第四五位表示命令：00create,01start,10stop,11destroy
		 * 		当四五位为00是，六七位代表powerType,八九位代表energyType
		 * */
		sendMsg : function(binary) {
			var msg = shipManager.BUS.Adapter.decode(binary);
			console.log(msg);
			if(Math.random() <= 0.1) {
				log("向 轨道" + msg.orbitId + " 发送的 " + msg.cmd + " 丢包！重试……", "red");
				if(msg.onceMore === 0) {
					binary = "1"+binary.substr(1) ;
				}
				shipManager.BUS.sendMsg(binary);
				return;
			}
				
			if(msg.onceMore === 1) {
				log("重试向 轨道" + msg.orbitId + " 发送的 " + msg.cmd + " 成功", "green");
			}
			else {
				log("向 轨道" + msg.orbitId + " 发送的 " + msg.cmd + " 成功", "green");
			}
			if(msg.cmd == "create") {
				console.log(shipType.powerType[msg.powerType],shipType.energyType[msg.energyType]);
				shipManager.createShip(msg.orbitId, shipType.powerType[msg.powerType], shipType.energyType[msg.energyType]);
			}
			else {
				console.log(msg.cmd);
				for(var ele in shipManager.shipList) {
					if(shipManager.shipList[ele]._destroy) {
						continue;
					}
					
					shipManager.shipList[ele].signalSystem.analyseMsg(msg);
				}
			}
		},
		Adapter : {
			encode : function(msg) {
				var res = msg.onceMore + (msg.orbitId+4).toString(2).substr(1);
				switch (msg.cmd) {
					case "create":
						res += "00"+((msg.powerType+4).toString(2)).substr(1)+((msg.energyType+4).toString(2)).substr(1);
						break;
					case "start":
						res += "01";
						break;
					case "stop":
						res += "10";
						break;
					case "destroy":
						res += "11";
					default:
						break;
				};
				
				console.log(res);
				return res;
			},
			decode : function(binary) {
				console.log(msg);
				var msg = {onceMore:parseInt(binary.substr(0,1),2),orbitId:parseInt(binary.substr(1,2),2)}
				var cmdN = parseInt(binary.substr(3,2),2);
				console.log("decod====");
				console.log(cmdN);
				console.log(msg);
				switch (cmdN) {
					case 0:
						msg.cmd = 'create';
						msg.powerType = parseInt(binary.substr(5,2),2);
						msg.energyType = parseInt(binary.substr(7,2),2);
						break;
					case 1:
						msg.cmd = 'start';
						break;
					case 2 : 
						msg.cmd = 'stop';
						break;
					case 3 : 
						msg.cmd = 'destroy';	
						break;
					default:
						break;
				}
				return msg;
			}
		}
	}
};

(function () {
	shipManager.flyDisplay = setInterval(function() {
		for(var i = 0; i < shipManager.shipList.length; i++) {
			 var ship = shipManager.shipList[i];
			  //飞船Div
           var shipDiv = document.getElementById("ship" + ship._orbit);
			if(ship._destroy) {
               if(!ship.clear) {
               	ship.clear = true;
               	document.body.removeChild(shipDiv);
               }
               continue;
           }
           //飞船飞行控制
			ship.powerSystem.fly();
           //修改飞船位置
			shipDiv.style.webkitTransform = "rotate(" + ship._angle + "deg)";
			shipDiv.style.mozTransform = "rotate(" + ship._angle + "deg)";
			shipDiv.style.msTransform = "rotate(" + ship._angle + "deg)";
			shipDiv.style.oTransform = "rotate(" + ship._angle + "deg)";
			shipDiv.style.transform = "rotate(" + ship._angle + "deg)";
           //能源显示
			shipDiv.innerHTML = ship.energySystem.energyValue() + "%";
		}
	}, 100);
	
	shipManager.solarManager = setInterval(function() {
        for(var i = 0; i < shipManager.shipList.length; i++) {
            //已销毁的飞船不处理
            if(shipManager.shipList[i]._destroyed) {
                continue;
            }
            //太阳能充能系统
            shipManager.shipList[i].energySystem.energyAdd();
            //飞行耗能
            shipManager.shipList[i].energySystem.energySub();
        }
    }, 1000);
})();




//事件绑定函数
function addEvent(target,type,handler) {
	if(target.addEventListener) {
		target.addEventListener(type,handler);
	}
	else if(target.attachEvent) {
		target.attachEvent('on'+type,function(event) {
			return handler.call(target,window.event);
		})
	}
	else {
		target['on'+type] = function() {
			return handler.call(target);
		}
	}
}

//取消事件冒泡
function stopBubble(e) {
	if(e.stopPropagation) {
		e.stopPropagation();
	}
	else {
		e.cancelBubble = true;
	}
}

(function() {
	var controller = document.getElementById("controller");
	var consoler = document.getElementById("consoler");
	var pwrAerg = document.getElementById("pwrAerg");
	var power = document.getElementsByName("power");
	var energy = document.getElementsByName("energy");
	//获取选择的型号
	function _getRadio(radios) {
		for(var i=0;i<radios.length;i++) {
			if(radios[i].checked) {
				return parseInt(radios[i].value);
			}
		}
	}
	
	
	//初始化个按键的状态，可点击或不可点击
	var child = controller.firstElementChild.nextElementSibling;
	while(child) {
		var grandchild = child.firstElementChild.nextElementSibling;
		while(grandchild) {
			_disableButton(grandchild);
			grandchild = grandchild.nextElementSibling;
		}
		child = child.nextElementSibling;
	}
	//为按键绑定点击事件处理函数
	addEvent(controller,"click",function(e){
		stopBubble(e);
		var target = e.target;
		if(target.nodeName == "BUTTON") {
			var orbitDes = target.parentNode.firstChild.data.trim();
			var orderDes =  target.innerHTML;
			var orbit = _getOrbit(orbitDes);
			//var order = _getOrder(orderDes)
			switch (orderDes) {
				case "创建飞船":
					_disableButton(target);
					_enableButton(target.nextElementSibling);
					_enableButton(target.nextElementSibling.nextElementSibling.nextElementSibling);
					console.log(_getRadio(power));
					cmder.createShip(orbit,_getRadio(power),_getRadio(energy));
					break;
				case "开始飞行":
					_disableButton(target);
					_enableButton(target.nextElementSibling);
					cmder.flyShip(orbit);
					break;
				case "停止飞行":
					_disableButton(target);
					_enableButton(target.previousElementSibling);
					cmder.stopShip(orbit);
					break;
				case "销毁飞船":
					_enableButton(target.parentNode.firstElementChild);
					_disableButton(target);
					_disableButton(target.previousElementSibling);
					_disableButton(target.previousElementSibling.previousElementSibling);
					cmder.destroyShip(orbit);
					break;
				default:
					return -1;
					break;
			}
			console.log(orbit);
		}
	});
	//判断当前点击的是第几轨道的飞船
	function _getOrbit(orbitDes) {
		switch (orbitDes) {
			case "第一轨道":
				return 0;
				break;
			case "第二轨道":
				return 1;
				break;
			case "第三轨道":
				return 2;
				break;
			case "第四轨道":
				return 3;
				break;
			default:
				return -1;
				break;
		}
	}
	//使按键变为不可用
	function _disableButton(btn) {
		btn.style.background = "grey";
		btn.disabled = true;
	}
	//使按键变为不可用
	function _enableButton(btn) {
		btn.style.background = "#3cff40";
		btn.disabled = false;
	}
	//定义控制台和现实台的拖放事件
	function drag(objDiv,type) {
		//定义div的初始位置
		if(type == "pwrAerg") {
			objDiv.style.left = 0;
			objDiv.style.top = 0;
		}
		else if(type == "controller") {
			objDiv.style.left = 0;
			objDiv.style.top = (window.innerHeight - objDiv.offsetHeight) + "px";
		}
		else {
			objDiv.style.left = (window.innerWidth - objDiv.offsetWidth) + "px";
			objDiv.style.top = (window.innerHeight - objDiv.offsetHeight) + "px";
		}
		
	    var draggingControl = false;
	    var start = [0, 0];
	    var position = [
	        objDiv.style.left.substr(0, objDiv.style.left.length - 2) - 0,
	        objDiv.style.top.substr(0, objDiv.style.top.length - 2) - 0
	    ];
	    //绑定事件
	    addEvent(objDiv,"mousedown",function(e) {
	    	start[0] = e.clientX - position[0];
	        start[1] = e.clientY - position[1];
			draggingControl = true;
		});
	    addEvent(document,"mouseup",function() {
	        draggingControl = false;
	    });
	    addEvent(document,"mousemove",function(e) {
	        if(draggingControl) {
	            position[0] = e.clientX - start[0];
	            position[1] = e.clientY - start[1];
	            if(position[0] > window.innerWidth - objDiv.offsetWidth) {
	                position[0] = window.innerWidth - objDiv.offsetWidth;
	            }
	            if(position[0] < 0) {
	                position[0] = 0;
	            }
	            if(position[1] > window.innerHeight - objDiv.offsetHeight) {
	                position[1] = window.innerHeight - objDiv.offsetHeight;
	            }
	            if(position[1] < 0) {
	                position[1] = 0;
	            }
	            objDiv.style.left = position[0] + "px";
	            objDiv.style.top = position[1] + "px";
	        }
	    });
	}
	drag(consoler,"consoler");
	drag(controller,"controller");
	drag(pwrAerg,"pwrAerg");
})();

var shipType = {
        powerType: [
            {type: "前进号", deg: 3, ergSub: 5},
            {type: "奔腾号", deg: 5, ergSub: 7},
            {type: "超越号", deg: 8, ergSub: 9}
        ],
        energyType: [
            {type: "劲量型", ergAdd: 2},
            {type: "光能型", ergAdd: 3},
            {type: "永久型", ergAdd: 4}
        ]
    };

//获取日期
function getTime() {
	var date = new Date();
	var year =  date.getFullYear();
    var month = ("00" + (date.getMonth() + 1)).substr(-2);
    var day = ("00" + date.getDay()).substr(-2);
    var hour = ("00" + date.getHours()).substr(-2);
    var minute = ("00" + date.getMinutes()).substr(-2);
    var second = ("00" + date.getSeconds()).substr(-2);
    var millisecond = ("000" + date.getMilliseconds()).substr(-3);
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "." + millisecond;
}
//让提示信息出现在面板中
var consoleLog = document.getElementById("info");
function log(msg, color) {
	var p = document.createElement("p");
	p.innerHTML =  getTime()+" "+msg;
	p.style.color = color;
	consoleLog.appendChild(p);
}



