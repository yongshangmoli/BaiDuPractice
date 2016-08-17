var text = "text Constructor";
var word;
var words = text.toLowerCase().split(/[\s,.]+/);
var count = {};
for (var i = 0; i < words.length; i++) {
	word = words[i];
	if(typeof(count[word]) === 'number') {
		count[word] += 1;
	} else {
		count[word] = 1;
	}
}
console.log(count);