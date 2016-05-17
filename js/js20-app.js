//主要定义了事件绑定等全局函数，缓存可能用到的节点方便传递给其他模块调用，对表单配置的选项进行监听
 //方便通过id选择节点
function $(selectorId) {
    return document.getElementById(selectorId);
};

//绑定事件函数
function addEvent(target,type,handler) {
    if(target.addEventListener) {
        target.addEventListener(type,handler);
    }
    else if(target.attachEvent) {
        target.attachEvent('on'+type,function() {
            return handler.call(target,window.event);
        });
    }
    else {
        target['on'+type] = function() {
            return handler.call(target);
        }
    }
};

function preventBubble(e) {
    if(e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        e.cancelBubble = true;
    }
};

var data = {
    type_box : $("type_box"),//创建表单类型
    type_name : $("type_name"),//类型的名字
    style : $("style"),//表格样式
    config_box : $("config_box"),//是否必填
    rule_input : $("rule_input"),//验证规则：数字邮箱密码等
    length_control : $("length_control"),
    min_length : $("min_length"),
    max_length : $("max_length"),
    box_item : $("box_item"),//下面的父元素
    box_item_input : $("box_item_input"),//多选或者下拉框添加选项
    box_item_show : $("box_item_show"),
    createForm :$("createForm"),
    displayArea : $("displayArea"),
    commitForm :$("commitForm")
};

var util = {
    hideEle : function(ele) {
        ele.style.display = 'none';
    },
    displayEle : function(ele) {
        ele.style.display = 'block';
    },
    formArr : []
};

var dataForm = new DataModule(data);

addEvent($('data_create'),'click',function(e) {
    preventBubble(e);
    var ele = e.target;
    if(ele.type === "radio") {
        var parent = ele.parentElement;
        parent.setAttribute("data-"+parent.id,ele.id);
        if(parent.id === "type_box") {
            data.type_name.value = ele.nextElementSibling.innerHTML;
            if(ele.id === "input") {
                util.hideEle(data.box_item);
                util.displayEle(data.length_control);
                util.displayEle(data.rule_input);
            }
            else {
                if(ele.id === "textarea") {
                    util.hideEle(data.box_item);
                    util.displayEle(data.length_control);
                }
                else {
                    util.hideEle(data.length_control);
                    util.displayEle(data.box_item);
                }
                util.hideEle(data.rule_input);
            }
        }
        else if(parent.id === "rule_input") {
            data.type_name.value = ele.nextElementSibling.innerHTML;
            if(ele.id === "text" || ele.id === "password") {
                util.displayEle(data.length_control);
            }
            else {
                util.hideEle(data.length_control);
            }
        }
    }
});

addEvent(data.style,'change',function(e) {
    var style = e.target.selectedIndex;
    data.displayArea.className = ('style'+style);
});

addEvent(data.createForm,'click',function(e) {
    preventBubble(e);
    var ele = e.target;
    dataForm.init();
    if(data.commitForm.style.display === 'none') {
        util.displayEle(data.commitForm);
    }
});

addEvent(data.commitForm,'click',function(e) {
    preventBubble(e);
    var ele = e.target;
    var flag = true;
    for(var i=0,j=util.formArr.length;i<j;i++) {
        util.formArr[i].validator();
        if (util.formArr[i].tipType != 2) {
            flag = false;
        }
    }
    flag ?  alert("提交成功！"): alert("提交失败！");
});

addEvent(tagAbout.tagInput,'keyup',function(e) {
    var str = this.value;
    if(/(,| |\，|\t|\r|\n)$/.test(str)||e.keyCode===13) {
        if(e.keyCode===13) {
            var newTag = str;
        }
        else {
            var newTag = str.slice(0,-1);
        }
        if(tagAbout.tagList.queue.indexOf(newTag)=== -1 && newTag!=="") {
            tagAbout.tagList.push(newTag);
            if(tagAbout.tagList.queue.length>10){
                tagAbout.tagList.shift();
            }
            tagAbout.tagList.paint();
        }
    this.value="";
    }
});





