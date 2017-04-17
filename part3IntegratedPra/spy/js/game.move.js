game.move = (function() {
	//if set allowOblique = true, we need give a default obliqueStep,here we don't consider this scene
	var configMap = {
			squareStep : 1,
			allowOblique : false,
		},
		getPath, initModule;

	function Box(x, y) {
		this.x = x;
		this.y = y;
		this.F = 0;
		this.G = 0;
		this.H = 0;
		this.parent = null;
	}

	Box.prototype = {
		constructor : Box,
		calF : function() {
			return this.G + this.H;
		},
		calH : function (curPos, endPos) {
			return Math.abs(curPos.x - endPos.x) + Math.abs(curPos.y - endPos.y);
		},
		getMinFBox : function(boxes) {
			var len = boxes.length;
			if(len === 1) {
				return boxes[0];
			}
			else if(len === 2) {
				return boxes[0].F > boxes[1].F ? boxes[1] : boxes[0];
			}
			else {
				var minBox = boxes[0];
				for (var i = 1; i < len; i++) {
					if(boxes[i].F < minBox.F) {
						minBox = boxes[i];
					}
				}
				return minBox;
			}
		},
		isInArr : function(arr, curBox, getBox) {
			var len = arr.length;
			for (var i = 0; i < len; i++) {

				// console.log("in isInArr", arr[i].x,'=====>', arr[i].y, '=========>', curBox);

				if(arr[i].x === curBox.x && arr[i].y === curBox.y) {
					return getBox === false ? true : arr[i];
				}
			}
			return getBox === false ? false : null;
		},
		getSurroundings : function(posArr, curBox, /*startBox, endBox, openList,*/ closedList) {
			var x = curBox.x, y = curBox.y,
				borderTop = 0, borderBottom = posArr.length, borderLeft = 0, borderRight = posArr[0].length,
				candidates = [[x-1,y], [x+1,y], [x,y-1], [x,y+1]], len = candidates.length,
				surroundings = [];

			// console.log("in getSurroundings", posArr);

			for (var i = 0; i < len; i++) {

				// console.log(candidates);

				// in the eara
				if(candidates[i][0] >= borderTop && candidates[i][0] < borderBottom && candidates[i][1] >= borderLeft && candidates[i][0] < borderRight) {
					//not the wall and in the closedList
					var box = new Box(candidates[i][0], candidates[i][1]);
					if(posArr[candidates[i][0]][candidates[i][1]] === 1 && !curBox.isInArr(closedList, box, false)) {
					// if(posArr[candidates[i][1]][candidates[i][0]] === 1 && !curBox.isInArr(closedList, box, false)) {
						surroundings.push(box);
					}
				}
			}

			return surroundings;
		},
		removeBox : function(boxList, box) {
			var len = boxList.length;
			for (var i = 0; i < len; i++) {
				if(boxList[i].x === box.x && boxList[i].y === box.y) {
					return boxList.splice(i,1);
					// boxList.splice(i,1);
				}
			}
		},
	};

	getPath = function(posArr, startBox, endBox) {
		var openList = [],closedList = [];
		openList.push(startBox);
		// console.log(startBox, endBox);

		while(openList.length != 0) {

			var curBox = startBox.getMinFBox(openList);

			// console.log("choosed min F box",curBox);

			closedList.push(curBox);
			startBox.removeBox(openList, curBox);

			// console.log(openList, closedList);

			var surroundings = curBox.getSurroundings(posArr, curBox, closedList),
				len = surroundings.length;

			// console.log(surroundings);

			for (var i = 0; i < len; i++) {
				var surroundBox = surroundings[i];
				// console.log(surroundBox.isInArr(openList, surroundBox, false));
				if(surroundBox.isInArr(openList, surroundBox, false)) {
					var newG = curBox.G + configMap.squareStep;
					if(newG < surroundBox.G) {
						surroundBox.G = newG;
						surroundBox.F = surroundBox.calF();
						surroundBox.parent = curBox;
					}
				}
				else {
					surroundBox.G = curBox.G + configMap.squareStep;
					surroundBox.H = surroundBox.calH(surroundBox, endBox);

					// console.log(surroundBox.H);

					surroundBox.F = surroundBox.calF();
					surroundBox.parent = curBox;
					openList.push(surroundBox);

					// console.log(openList);
				}
			}

			var judgeEndBox = curBox.isInArr(openList, endBox, true);
			if(judgeEndBox != null) {
				return judgeEndBox;
			}
		}

		console.log("finnal res", startBox.isInArr(openList, endBox, true));

		return startBox.isInArr(openList, endBox, true);
	};

	initModule = function(posArr, startPoint, endPoint) {
		var startBox = new Box(startPoint.x, startPoint.y),
			endBox = new Box(endPoint.x, endPoint.y),
			res = getPath(posArr, startBox, endBox);
		console.log(res);
		return res;
	};

	return {
		getPath : getPath,
		initModule　:　initModule
	};
}());