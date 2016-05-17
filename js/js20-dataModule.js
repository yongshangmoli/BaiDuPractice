//搜集将要创建的表单的各种属性，以及他们的配置提示信息，还有创建表单的动作都放在这里
function DataModule(data) {
	this.data=data;
	this.id=0;
}

DataModule.prototype = {
	constructor : DataModule,
	init : function() {
		this.formData();
	},
	getValue : function(ele) {
		return this.data[ele].getAttribute("data-"+ele);
	},
	formData : function() {

		var finalData = {
			type_box : this.getChooseValue("type_box"),
			label : this.getInputValue("type_name"),
			style : this.data.style.selectedIndex,
			isMust : this.getChooseValue("config_box"),
			rule_input : this.getChooseValue("rule_input"),
			min_length : this.getInputValue("min_length"),
			max_length : this.getInputValue("max_length"),
			box_item_input : this.getInputValue("box_item_input"),
			id : 0,
			defalut_text : '',
			error_text : '',
			tags : [],
			success_text : '格式正确'
		};
		switch (finalData.type_box) {
			case "input":
				switch (finalData.rule_input) {
					case "number":
						finalData = this.getNumberRequiredData(finalData);
						this.addInput(finalData);
						util.formArr.push(new FormModule(finalData));
						break;
					case "email" :
						finalData = this.getEmailRequiredData(finalData);
						this.addInput(finalData);
						util.formArr.push(new FormModule(finalData));
						break;
					case "phone" :
						finalData = this.getPhoneRequiredData(finalData);
						this.addInput(finalData);
						util.formArr.push(new FormModule(finalData));
						break;
					default:
						finalData = this.getLengthRequiredData(finalData);
						this.addInput(finalData);
						util.formArr.push(new FormModule(finalData));
						break;
				}
				break;
			case "textarea":
				finalData = this.getLengthRequiredData(finalData);
				this.addTextarea(finalData);
				util.formArr.push(new FormModule(finalData));
				break;
			case "select":
				finalData = this.getTagsRequiredData(finalData);
				this.addSelect(finalData);
				util.formArr.push(new FormModule(finalData));
				break;
			default:
				finalData = this.getTagsRequiredData(finalData);
				this.addRadioOrCheckbox(finalData);
				util.formArr.push(new FormModule(finalData));
				break;
		}

		return finalData;
	},
	getChooseValue : function(ele) {
		return this.data[ele].getAttribute("data-"+ele);
	},
	getInputValue : function(ele) {
		return this.data[ele].value;
	},
	getLengthRequiredData : function(data) {
		console.log('in===getLengthRequiredData')
		data.id = 'form'+this.id++;
		data.error_text = [
			data.label+'长度不能小于'+data.min_length+'个字符',
			data.label+'长度不能大于'+data.max_length+'个字符'
		];
		data.defalut_text = (data.isMust === "must" ? '必填项':'选填项')+'长度为'+data.min_length+'-'+data.max_length+'个字符';
		return data;
	},
	getNumberRequiredData : function(data) {
		data.id = 'form'+this.id++;
		data.error_text = data.label+'必须是数字';
		data.defalut_text = (data.isMust === "must" ? '必填项':'选填项')+"请输入数字";
		return data;
	},
	getEmailRequiredData : function(data) {
		data.id = 'form'+this.id++;
		data.error_text = data.label+'邮箱格式不正确';
		data.defalut_text = (data.isMust === "must" ? '必填项':'选填项')+data.label+"请输入合法的邮箱";
		return data;
	},
	getPhoneRequiredData : function(data) {
		data.id = 'form'+this.id++;
		data.error_text = data.label+'手机号码格式不正确';
		data.defalut_text = (data.isMust === "must" ? '必填项':'选填项')+data.label+"请输入手机号";
		return data;
	},
	getTagsRequiredData : function(data) {
		data.id = 'form'+this.id++;
		var tags = tagAbout.tagList.queue;
		for(var i=0,len=tags.length;i<len;i++) {
			data.tags.push(tagAbout.tagList.queue[i]);
		}
		var isMust = (data.isMust === "must" ? '必填项':'选填项');
		switch (data.type_box) {
			case "checkbox":
				data.error_text = data.label+'请至少选择一个选项';
				data.defalut_text = isMust+",请做多项选择";
				break;
			default:
				data.error_text = data.label+'请选择一个选项';
				data.defalut_text = isMust+",请做单向选择";
				break;
		}
		return data;
	},
	addTextarea : function(finalData) {
		console.log("textarea"+finalData.style);
		var div = document.createElement('div');
		div.setAttribute("data-type", finalData.type_box+"-"+finalData.id);
		div.innerHTML = '<label for="'+finalData.id+'">'+finalData.label+'</label><textarea id="'+finalData.id+'" placeholder="'+finalData.defalut_text+'"></textarea><span></span>';
		data.displayArea.insertBefore(div,data.commitForm);
	},
	addInput : function(finalData) {
		var div = document.createElement('div');
		div.setAttribute("data-type", finalData.type_box+"-"+finalData.id);
		if(finalData.rule_input === "text" || finalData.rule_input === "password" || finalData.rule_input === "email") {
			div.innerHTML = '<label for="'+finalData.id+'">'+finalData.label+'</label><input type="'+finalData.rule_input+'" id="'+finalData.id+'" placeholder="'+finalData.defalut_text+'"></input><span></span>';
		}
		else {
			div.innerHTML = '<label for="'+finalData.id+'">'+finalData.label+'</label><input type="number" id="'+finalData.id+'" placeholder="'+finalData.defalut_text+'"></input><span></span>';
		}
		data.displayArea.insertBefore(div,data.commitForm);
	},
	addRadioOrCheckbox : function(finalData) {
		var tags = finalData.tags;
		if(tags.length === 0) {
			alert("请输入要添加的选项");
			return false;
		}
		else {
			var div = document.createElement('div');
			div.setAttribute("data-type", finalData.id);
			div.setAttribute("id", finalData.id);
			var tagEle = finalData.label;
			for(var i=0,len=tags.length;i<len;i++) {
				tagEle += '<input name="'+finalData.id+'" id="'+finalData.id+i+'" type="'+finalData.type_box+'"><label for="'+finalData.id+i+'">'+tags[i]+'</label>';
			}
			tagEle += "<span></span>";
			div.innerHTML = tagEle;
			data.displayArea.insertBefore(div,data.commitForm);
		}
	},
	addSelect : function(finalData) {
		var tags = finalData.tags;
		if(tags.length === 0) {
			alert("请输入要添加的选项");
			return false;
		}
		else {
			var div = document.createElement('div');
			div.setAttribute("data-type", finalData.id);
			var tagEle = '<label for="'+finalData.id+'">'+finalData.label+'</label><select id="'+finalData.id+'">';
			for(var i=0,len=tags.length;i<len;i++) {
				tagEle += '<option>'+tags[i]+'</option>';
			}
			tagEle += "</select><span></span>";
			div.innerHTML = tagEle;
			data.displayArea.insertBefore(div,data.commitForm);
		}
	}
}