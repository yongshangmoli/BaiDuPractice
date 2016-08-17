/*var fibonacci = function(n) {
	console.log(n);
	return n < 2 ? n : fibonacci(n-1)+fibonacci(n-2);
}
fibonacci(5);*/
var fibonacci = function(n) {
	var memo = [0,1];
	var fib = functon(n) {
		var result = memo[n];
		if(!result) {
			result = fib(n-1) + fib(n-2);
			memo[n] = result;
		}
		return result;
	}
	return fib;
}();