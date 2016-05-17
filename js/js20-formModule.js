//对所有创建出的表单进行验证的逻辑，以及提示信息的显示放在这里
function FormModule(data) {
	this.data = data;
	this.ele = $(data.id);
	this.tipType = 0;//0默认，1错误，2正确
	this.tip = data.defalut_text;
	this.tipEle = this.ele.nextElementSibling;//非单选框，多选框的tip区域
	this.tipEleRSC = this.ele.lastChild;//单选框，多选框的tip区域
	this.init();
}

FormModule.prototype = {
	constructor : FormModule,
	init : function() {
		addEvent(this.ele,'focus',this.default_tip.bind(this));
		addEvent(this.ele,'blur',this.validator.bind(this));
		addEvent(this.ele,'change',this.validator.bind(this));
	},
	default_tip : function() {
		var area = (this.tipEle.nodeName === "SPAN") ? this.tipEle : this.tipEleRSC;
		this.tipType = 0;
        this.tip = this.data.defalut_text;
        this.ele.className = 'checking-border';
        area.className = 'checking';
        this.dislay_tip(area);
	},
	right_tip : function(area) {
		var area = area || this.tipEle;
		this.tipType = 2;
        this.tip = this.data.success_text;
		this.ele.className = 'right-border';
        area.className = 'right';
        this.dislay_tip(area);
	},
	error_tip : function(area) {
		var area = area || this.tipEle;
		this.tipType = 1;
        this.ele.className = 'error-border';
        area.className = 'error';
        this.dislay_tip(area);
	},
	dislay_tip : function(area) {
		area.innerHTML = this.tip;
	},
	validator : function() {
		if(this.data.isMust === "must") {
			switch (this.data.type_box) {
				case "input":
					this.value = ($(this.data.id)).value;
					switch (this.data.rule_input) {
						case "number":
							this.number_control(this.value);
							break;
						case "email":
							this.email_control(this.value);
							break;
						case "phone":
							this.phone_control(this.value);
							break;
						default:
							this.length_control(this.value);
							break;
					}
					break;
				case "select":
					this.select_control();
					break;
				case "textarea":
					this.value = ($(this.data.id)).value;
					this.length_control(this.value);
				default:
					this.tag_conrtol();
					break;
			}
        }
        else {
        	this.right_tip();
        }
	},
    length_control : function(cur) {
        if(cur.length < this.data.min_length) {
        	this.tip = this.data.error_text[0];
        	this.error_tip();
        }
        else if(cur.length > this.data.max_length) {
        	this.tip = this.data.error_text[1];
        	this.error_tip();
        }
        else {
        	this.right_tip();
        }
	},
	email_control : function(cur) {
		if(cur === "" || !/^[0-9a-z]+([._\\-]*[a-z0-9])*@([a-z0-9]+[a-z0-9]+.){1,63}[a-z0-9]+$/.test(cur)) {
			this.tip = this.data.error_text;
        	this.error_tip();
		}
		else {
			this.right_tip();
		}
	},
	number_control : function(cur) {
		if(cur === "" || !/^\d*$/.test(cur)) {
			this.tip = this.data.error_text;
        	this.error_tip();
		}
		else {
			this.right_tip();
		}
	},
	phone_control : function(cur) {
		if(cur === "" || !/^1[3|4|5|7|8]\d{9}$/.test(cur)) {
			this.tip = this.data.error_text;
        	this.error_tip();
		}
		else {
			this.right_tip();
		}
	},
	tag_conrtol : function() {
		var item = this.ele.getElementsByTagName('input');
		var passed = false;
		for(var i = 0,len=item.length; i < len; i++) {
			if (item[i].checked) {
                passed = true;
                break;
            }
		}
		if(!passed) {
			this.tip = this.data.error_text;
			this.error_tip(this.tipEleRSC);
		}
		else {
			this.right_tip(this.tipEleRSC);
		}
	},
	select_control : function() {
		var item = this.ele.getElementsByTagName('option');
		var passed = false;
		for(var i = 0,len=item.length; i < len; i++) {
			if (item[i].selected) {
                passed = true;
                break;
            }
		}
		if(!passed) {
			this.tip = this.data.error_text;
			this.error_tip();
		}
		else {
			this.right_tip();
		}
	}
};