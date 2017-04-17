game.util = (function() {
	var makeRandPos, makeError,/* setBlockSize,*/ setConfigMap;

	makeRandPos = function(lowBound, upBound) {
		return lowBound + Math.floor( Math.random() * (upBound - lowBound) );
	};

	makeError = function(name, msg, data) {
		var error = new Error();
		error.name = name;
		error.message = msg;

		if(data) {
			error.data = data;
		}

		return error;
	};

	setConfigMap = function(argMap) {
		var inputMap = argMap.inputMap,
			settableMap = argMap.settableMap,
			configMap = argMap.configMap,
			keyName, error;

		for (keyName in inputMap) {
			if(inputMap.hasOwnProperty(keyName)) {
				if(settableMap.hasOwnProperty(keyName)) {
					configMap[keyName] = inputMap[keyName];
				}
				else {
					error = makeError('Bad Input', 'Setting config key [' + keyName + '] is not supported');
				}
				throw error;
			}
		}
	};

	return {
		setConfigMap : setConfigMap,
		// setBlockSize : setBlockSize,
		makeRandPos : makeRandPos,
		makeError : makeError
	};
}());