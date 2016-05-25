var displayInfo = (function() {
    //学校信息
    var schools = {
        '北京':['北京大学','清华大学','北京邮电大学'],
        '四川':['四川大学','电子科技大学','西南交通大学'],
        '武汉':['武汉大学','武汉理工大学','华中科技大学']
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
    }
    //初始化下拉选项
    function selectInit(select) {
        return select.innerHTML = '<option>请选择</option>';
    }
    //为下拉菜单添加选项，arr为选项的数组
    function addOptions(arr,parent) {
        arr.forEach(function(element) {
            var option = document.createElement('option');
            option.innerHTML = element;
            parent.appendChild(option);
        });
    }
    return {
        addEvent : addEvent,
        selectInit : selectInit,
        addOptions : addOptions,
        schools : schools
    }

})();

var peopleType = document.getElementById('peopleType');
var peoplleTypes = document.getElementsByName('stuType');
var inSchool = document.getElementById('inSchool');
var notSchool = document.getElementById('notSchool');
var city = document.getElementById('city');
var school = document.getElementById('school');
var cities = Object.keys(displayInfo.schools);


displayInfo.addEvent(peopleType,'click',function() {
    var choice;
    for(var i=0,j=peoplleTypes.length;i<j;i++) {
        if(peoplleTypes[i].checked) {
            choice = peoplleTypes[i].value;
            break;
        }
    }
    if(choice === "schlStu") {
        inSchool.style.display = "block";
        notSchool.style.display = "none";
    }
    else {
        inSchool.style.display = "none";
        notSchool.style.display = "block";
    }
});

//初始添加城市选项
displayInfo.addOptions(cities,city);
//城市选择发生改变时改变学校选项
displayInfo.addEvent(city,'change',function() {
    displayInfo.selectInit(school);
    var schools = displayInfo.schools[city.options[city.selectedIndex].text];
    if(schools) {
        displayInfo.addOptions(schools,school);
    }
});
