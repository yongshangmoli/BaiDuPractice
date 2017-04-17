var game = (function() {
	var configMap = {
			blockInRow : 8,
			blockInClo : 10,
			blockSideLen : 40,
			wallNum : 10
		},
		nodeStore = {
			canvas : null,
			ctx : null,
			heroImg : null,
			monsterImg : null
		},
		stateMap = {
			heroReady : false,
			monsterReady : false,
			boxIsMoving : false
		},
		utilObj = {
			hero : {
				speed : 256,
				x : 0,
				y : 0
			},
			monster : {
				x : 100,
				y : 100
			},
			usedPos : [],
			stateArr : null,
			// requestAnimationFrame : window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame,
			then : Date.now(),
			sideGap : 0,
			canvas : {
				width : 0,
				height : 0
			}
		},
		requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame,
		getCanvas, loadImg, updatePos, renderMap, setStartEnd, setWalls, getStateArr, getStartToEndPath, addEvent, checkUpdate, startGame, resetCanvas, initModule;

	getCanvas = function() {
		var canvas = document.getElementById("canvas"),
			ctx = canvas.getContext("2d"),
			screenWidth = document.documentElement.clientWidth,
			screenHeight = document.documentElement.clientHeight,
			canvasWidth = screenWidth * 0.8,
			blockSideLen = canvasWidth / configMap.blockInRow,
			blockInClo = Math.floor(screenHeight/blockSideLen),
			canvasHeight = blockInClo * blockSideLen;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		configMap.blockSideLen = blockSideLen;
		configMap.blockInClo = blockInClo;
		nodeStore.canvas = canvas;
		nodeStore.ctx = ctx;
		utilObj.sideGap = screenWidth * 0.1;
		utilObj.canvas.width = canvasWidth;
		utilObj.canvas.height = canvasHeight;

		// console.log(configMap.blockInRow, configMap.blockInClo);
	};

	loadImg = function() {
		var heroImg = new Image(),
			monsterImg = new Image();

		heroImg.onload = function() {
			stateMap.heroReady = true;
		};
		heroImg.src = "imgs/hero.png";
		monsterImg.onload = function() {
			stateMap.monsterReady = true;
		};
		monsterImg.src = "imgs/monster.png";

		nodeStore.heroImg = heroImg;
		nodeStore.monsterImg = monsterImg;
	};

	updatePos = function(boxes) {
		var i = 0, len = boxes.length,
			timer = setInterval(function() {
				if(i === len) {
					clearInterval(timer);
					stateMap.boxIsMoving = false;
					if(boxes[i-1].x === utilObj.monster.x && boxes[i-1].y === utilObj.monster.y) {
						resetCanvas();
						// setWalls();
						startGame();
						ensurePath();
					}
				}
				else {
					nodeStore.ctx.clearRect(utilObj.hero.x*configMap.blockSideLen, utilObj.hero.y*configMap.blockSideLen, configMap.blockSideLen, configMap.blockSideLen);
					stateMap.boxIsMoving = true;
					utilObj.hero.x = boxes[i].x;
					utilObj.hero.y = boxes[i].y;
					i ++;
				}
				console.log("update", stateMap.boxIsMoving);
			}, 100);
	};

	renderMap = function() {
		// console.log("renderMap");
		if (stateMap.heroReady) {
			nodeStore.ctx.drawImage(nodeStore.heroImg, utilObj.hero.x*configMap.blockSideLen, utilObj.hero.y*configMap.blockSideLen, configMap.blockSideLen, configMap.blockSideLen);
		}
		if (stateMap.monsterReady) {
			nodeStore.ctx.drawImage(nodeStore.monsterImg, utilObj.monster.x*configMap.blockSideLen, utilObj.monster.y*configMap.blockSideLen, configMap.blockSideLen, configMap.blockSideLen);
		}

		nodeStore.ctx.fillStyle = "rgb(255, 255, 255)";
	};

	setStartEnd = function() {
		var heroPosX = game.util.makeRandPos(0, configMap.blockInRow),
			heroPosY = game.util.makeRandPos(0, configMap.blockInClo),
			monsterPosX = game.util.makeRandPos(0, configMap.blockInRow),
			monsterPosY = game.util.makeRandPos(0, configMap.blockInClo);

		while(heroPosX === heroPosY && monsterPosX === monsterPosY) {
			monsterPosX = game.util.makeRandPos(0, configMap.blockInRow);
		}

		utilObj.hero.x = heroPosX;
		utilObj.hero.y = heroPosY;
		utilObj.monster.x = monsterPosX;
		utilObj.monster.y = monsterPosY;

		utilObj.usedPos[0] = {x : heroPosX, y : heroPosY};
		utilObj.usedPos[1] = {x : monsterPosX, y : monsterPosY};
	};

	//store the walls' pos to prevent generate wall in the same place
	setWalls = function() {
		var wallNum = configMap.wallNum;
		utilObj.usedPos.splice(2,utilObj.usedPos.length);
		for (var i = 0; i < wallNum; i++) {
			var wallPosX = game.util.makeRandPos(0, configMap.blockInRow),
				wallPosY = game.util.makeRandPos(0, configMap.blockInClo),
				usedArrLen = utilObj.usedPos.length;
			for(var j=0; j<usedArrLen; j++) {
				if(utilObj.usedPos[j].x === wallPosX) {
					while(utilObj.usedPos[j].y === wallPosY) {
						wallPosY = game.util.makeRandPos(0, configMap.blockInClo);
					}
				}
			}
			utilObj.usedPos.push({x : wallPosX, y : wallPosY});
		}
	};

	drawWalls = function(wallPos) {
		console.log(wallPos);
		for (var i = 2; i < configMap.wallNum+2; i++) {
			var ctx = nodeStore.ctx;
			ctx.fillStyle = "#eee";
			ctx.fillRect(wallPos[i].x*configMap.blockSideLen, wallPos[i].y*configMap.blockSideLen, configMap.blockSideLen, configMap.blockSideLen);
		}
	};

	getStateArr = function(posArr) {
		var stateArr = new Array(configMap.blockInRow);// stateArr[i][j] = 1 means no wall, =0 means wall

		for (var i = 0; i < configMap.blockInRow; i++) {
			stateArr[i] = new Array(configMap.blockInClo);
			for (var j = 0; j < configMap.blockInClo; j++) {
				stateArr[i][j] = 1;
			}
		}

		var wallNum = configMap.wallNum + 2;
		// console.log(wallNum, stateArr);
		for (var i = 2; i < wallNum; i++) {
			// console.log(posArr[i]);
			stateArr[(posArr[i]).x][(posArr[i]).y] = 0;
		}

		// console.log(stateArr);
		utilObj.stateArr = stateArr;
		// return stateArr;
	};

	getStartToEndPath = function(endBox) {
		var boxes = [];
		while(endBox.parent !== null) {
			boxes.push(endBox);
			endBox = endBox.parent;
		}
		boxes.reverse();
		return boxes;
	};

	addEvent = function() {
		addEventListener("click", function(e) {
			console.log(e);
			var x = Math.floor((e.clientX - utilObj.sideGap)/configMap.blockSideLen),
				y = Math.floor(e.clientY/configMap.blockSideLen);

			console.log("click event", x, y);

			if ((x ===  utilObj.usedPos[0].x &&　y === utilObj.usedPos[0].y || utilObj.stateArr[x][y] === 0) /*|| (x === utilObj.usedPos[1].x &&  y === utilObj.usedPos[1].y)*/) {
				return;
			}
			else {
				if(!stateMap.boxIsMoving) {
					var newBox = {x : x, y : y};
					utilObj.finalPath = game.move.initModule(utilObj.stateArr, utilObj.usedPos[0], newBox);
					updatePos(getStartToEndPath(utilObj.finalPath));
				}
			}
		}, false);

		/*addEventListener("mouseup", function(e) {
			console.log(e);

		}, false);*/
	};

	checkUpdate = function() {
		var now = Date.now();

		renderMap();
		utilObj.then = now;

		requestAnimationFrame(checkUpdate);
	};

	startGame = function() {
		setStartEnd();
		loadImg();
		setWalls();
		drawWalls(utilObj.usedPos);
		getStateArr(utilObj.usedPos);
	};

	resetCanvas = function() {
		nodeStore.canvas.width = utilObj.canvas.width;
		nodeStore.canvas.height = utilObj.canvas.height;
	};

	ensurePath = function() {
		var res = game.move.initModule(utilObj.stateArr, utilObj.usedPos[0], utilObj.usedPos[1]);
		while(res === null) {
			resetCanvas();
			setWalls();
			res = game.move.initModule(utilObj.stateArr, utilObj.usedPos[0], utilObj.usedPos[1]);
		}
	};

	initModule = function() {
		getCanvas();
		startGame();
		checkUpdate();
		ensurePath();
		addEvent();
	};

	return {
		initModule　:　initModule
	};
}());


