window.changedValues = {};
(function (win,doc){
	if(!win.addEventListener)return;
	var html = document.documentElement;
	function setFont(){
		var cliWidth = html.clientWidth;
		html.style.fontSize=100*(cliWidth/750)+"px";
		console.log(html.style.fontSize);
	}
	win.addEventListener("resize",setFont,false)
	setFont();
})(window,document);
/*
$(function() {
	const items = document.querySelectorAll('[data-click-to-edit]');
	$(items).forEach(function(elem) {
		const target = elem[0];
		const identifier = target.id;
		window['get_'+identifier] = function() {
			return $(target).text();
		};
		$(elem[0]).click(function() {
			window.location.href="tencare://edit/"+identifier;
			if (typeof(window['set_'+identifier]) == 'undefined') {
				window['set_'+identifier] = function(text) {
					window.changedValues[identifier] = text;
					$(elem[0]).text(text);
				}
			}
		});
	});
});
*/
Vue.use(VueTouch)
window.app = new Vue({
	el: '#page',
	data: {
		name: '医生姓名',
		title: '主治医师',
		avatar: 'http://placekitten.com/128/128',
		background: '',
		avatar_mode: false,
		hospital: '儿童医院',
		working_age: '10',
		tags: ['鞘膜积液', '先天畸形', '肠胃', '肛门'],
		expert_at: '儿科、小儿科常见疾病的诊治。尤其是新生儿及普遍外科常见疾病，比如儿童腹股沟疝，鞘膜积液，先天畸形，肠胃，肛门等。',
		introduction: '从事儿科临床工作12年。',
		qrcode:'images/barc-code.png',
		history: [
			{hospital:'广东中山医院深圳博德 ', title:'主治医师'},
			{hospital:'广东中山医院深圳博德', title:'主治医师'},
		]
	},
	methods: {
		edit: function(event) {
			var node = event.target;
			if (node.tagName == 'IMG') {
				method='pick_image';
			} else {
				method = 'edit';
			}
			var id = node.getAttribute('id');
			while (node && id == null) {
				node = node.parentNode;
				id = node.getAttribute('id')
			}
			if (id) {
			window.location.href="tencare://"+method+"/"+id;
			}
		},
		edit_list_item: function(index, event) {
			var node = event.target.parentNode;
			while (typeof(node) != 'undefined' && node.tagName != 'UL') {
				node = node.parentNode;
			}
			if (typeof(node) == 'undefined') {
				return;
			}
            const model = node.getAttribute('id');
			window.location.href="tencare://edit_list_item/"+model+"/"+index;
		},
		switch: function() {
			this.avatar_mode = !this.avatar_mode;
		}
	}
});
function update_data(json) {
	for (var key in json) {
		app[key] = json[key];
	}
}