(function() {
    var btn = document.getElementById('button');
    var inputEles = document.getElementsByTagName('input');
    var previous;
    var checkRes = {
    	nameArr : ["名称不能为空","名称必须为4~16位的中英文字符","名称可用","请输入4~16位的中英文字符"],
    	passwordArr : ["密码不能为空","密码必须为4~16位的中英文字符","密码可用","请输入4~16位的中英文字符密码"],
    	againArr : ["密码不能为空","两次输入的密码不一样","密码一致","请输入与之前一样的密码"],
    	emailArr : ["邮箱不能为空","邮箱格式错误","邮箱格式正确","请输入正确的邮箱"],
    	phoneArr : ["手机号码不能为空","手机号码为11位的数字","手机号码格式正确","请输入11位的手机号"]
    }
    
    var validate = {
    		//检查名字
    	nameCheck : function(name) {
		    //检查是否为中英文组成的正则表达式
		    var reg =  /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
		    return validate._isValidate(name,reg);
		},
		//检查密码
		passwordCheck : function(pwd) {
    		//检查是否为中英文组成的正则表达式
		    var reg =  /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
		    return validate._isValidate(pwd,reg);
    	},
    	//再次检查密码
    	againCheck : function(pwd,lastInput) {
    		//检查是否为中英文组成的正则表达式
		    var reg =  /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
		    if(validate._inputNull(pwd)) {
		        return 0;
		    }
		    else if(pwd != lastInput) {
    			return 1;
    		}
    		else {
    			return 2;
    		}
    	},
    	//检查邮箱
    	emailCheck : function(mail) {
    		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		if(validate._inputNull(mail)) {
		        return 0;
		    }
    		else if(!validate._inputReg(mail,reg)) {
    			return 1;
    		}
    		else {
    			return 2;
    		}
    	},
    	//检查电话
    	phoneCheck : function(phone) {
    		 var reg =  /^1\d{10}$/;
			 return validate._isValidate(phone,reg);
    	},
    	//输入是否为空
		_inputNull : function(inputValue) {
			if(inputValue == "" || inputValue == null ) {
		        return true;
		    }
			return false;
		},
    	//输入长度是否符合
    	_inputLength : function(inputValue) {
    		if(inputValue.length < 4 || inputValue.length >16) {
		        return false;
		    }
			return true;
    	},
		//输入是否符合正则表达式
		_inputReg : function(inputValue,reg) {
	    	if(reg.test(inputValue)) {
	    		return true;
	    	}
	    	return false;
	    },
		//检查输入是否合法
		_isValidate : function(name,reg) {
			var match = name+"Arr";
			if(validate._inputNull(name)) {
		        return 0;
		    }
		    else if( !validate._inputLength(name) || !validate._inputReg(name,reg)) {
		    	return 1;
		    }
		    else {
		    	return 2;
		    }
		}
	}
    
    function addEvent(target,type,handler) {
    	if(target.addEventListener) {
    		target.addEventListener(type,handler,false);
    	}
    	else if(target.attachEvent) {
    		target.attachEvent('on'+type,function(event) {
    			return handler.call(target,window.event);
    		});
    	}
    	else {
    		target['on'+type] = function() {
    			return handler.call(target);
    		}
    	}
    }
    addEvent(btn, "click", function() {
    	var p = document.getElementsByTagName("p");
    	for(var i=0;i<p.length;i++) {
    		if(p[i].className == "error" || p[i].className== null || p[i].className == "") {
    			console.log(p[i].className);
        		alert("提交失败");
        		return false;
        	}
    	}
    	alert("提交成功");
    });
    for(var i=0;i<inputEles.length;i++) {
    	addEvent(inputEles[i],"focus",function(e) {
    		return function(e) {
    			var match = this.id+"Arr";
    			var p = this.nextElementSibling;
    			this.style.borderColor = "blue";
    			p.innerHTML = (checkRes[match])[3];
    			p.className = "checking";
    		}
    	}(i));
    	addEvent(inputEles[i],"blur",function(e) {
    		return function(e) {
    			var value = this.value.trim();
    			var match = this.id+"Check";
    			console.log(match);
    			var res;
    			if(this.id == "password") {
    				res = (validate[match])(value);
    				this.parentNode.nextElementSibling.firstElementChild.nextElementSibling.focus();
    			}
    			else if(this.id == "again") {
    				//获取上次密码输入的值
    				res = (validate[match])(value,this.parentNode.previousElementSibling.firstElementChild.nextElementSibling.value);
    			}
    			else {
    				res = (validate[match])(value);
    			}
    			var p = this.nextElementSibling;
    			if( res === 2) {
    				this.style.borderColor = "green";
    				p.className = "right";
    			}
    			else {
    				this.style.borderColor = "red";
    				p.className = "error";
    			}
    			this.nextElementSibling.innerHTML = (checkRes[this.id+"Arr"])[res];
    		}
    	}(i));
    }
})();