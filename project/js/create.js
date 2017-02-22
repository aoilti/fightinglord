//自定义数组map方法
Array.prototype.map = function(fun){
	var arr=[];
	for(var i = 0,length = this.length;i < length;i++){
		if(i in this){
			var r = fun(this[i],i);
			arr[i] = r;
		}
	}
	return arr;
}

var SuperPerson = function(){
	this.CardList = []; 
}
SuperPerson.prototype = new Card();
SuperPerson.prototype.construct = SuperPerson;
//生成三张底牌
SuperPerson.prototype.assignBaseCard = function(){
	this.baseCard = this.createHandCard(3);
	return this;
}
//生成三幅牌
SuperPerson.prototype.assignPersonsCard = function(){
	for(var i = 0; i < 3; i++){
		this.CardList.push(this.createHandCard(17));
	}
	return this;
}
//创建玩家
SuperPerson.prototype.cretePerson = function(){
	this.showBaseCard();
	var cardsList = this.CardList;
	this.personA = new Person(cardsList[0],$(".personA"));
	this.personA.init();
	this.personB = new Person(cardsList[1],$(".personB"));
	this.personB.init();
	this.personMe = new Person(cardsList[2],$(".myself"));
	this.personMe.init();
	this.personMe.showMyCard();	
	this.observer();
}
SuperPerson.prototype.init = function(){
	this.assignBaseCard().assignPersonsCard().cretePerson();
}
SuperPerson.prototype.observer = function(){
	var observerObj = [this.personMe,this.personB,this.personA];
	console.log(this.personA)
	var take = new taker(next.startGrab,observerObj);
	take.receive("next");	
	var real = new releaser();
	real.msg("next");
}

//获取底牌牌面
SuperPerson.prototype.getBaseCard = function(){	
	return this.baseCard;
}
SuperPerson.prototype.getPersonsCard = function(){
	return this.CardList;
}
SuperPerson.prototype.showBaseCard = function(){
	var baseCard = this.getBaseCard();
	baseCard.map(function(x,index){
		$(".showCard").eq(index).css("background","url(img/card/"+x.icon+")"); 	
	})
}

//玩家类
var Person = function(cards,dom){
	this.card = cards;
	this.dom = dom;
	this.personer = dom.selector.replace(/\./g,"");
	this.sortMyCard();	
}
Person.prototype.init = function(){	
	this.calculateWeight();
}
//排序卡牌
Person.prototype.sortMyCard = function(){
	var card = this.card;
	this.card.sort(function(a,b){
		return b.val - a.val;
	})	
}
//展示牌面
Person.prototype.showMyCard = function(){
	var card = this.card,
		li = "",
		l = card.length,
		i = 0;
	var cardLiHeight = $(".show_myCard").height();
	var cardLiwidth = cardLiHeight*0.7;
	var starInterval = function(){
		var timer = null;
		timer = setInterval(function(){
			var x = card[i];
			var left = i * cardLiwidth * 2 / 5;
			li = "<li style='width:"+cardLiwidth+"px;z-index:"+(i+2)+";left:"+left+"px;'>"+
					"<img src='img/card/"+x.icon+"'>"+
				  "</li>";
			$(".show_myCard").append(li);
			resizeShowCardStage();
			i++;
			if(i >= l){
				// clearInterval(timer);
				timerList();
				clearTimer();
			}
		},200)
		timerList(timer);
	}

	clearTimer(starInterval)
}

Person.prototype.calculateWeight = function(){
	var strage = new strategy();
	var weight = strage.init(this.card);
	this.weight = weight;
}



//计算权重类
var strategy = function(){
	var weight = 17;			//权重		默认17张单张权重17
	var isBoom = function(arr,index = 0){
		var i = 0;
		var boom = {};
		if(arr[0].val == 17 && arr[1].val == 16){
			// boom.kingBoom = arr.splice(0,2);
			weight += 30;
		}
		while(index != arr.length - 3){
			if(arr[index].val == arr[index + 3].val){
				// index = -1;
				weight += 25;
			}					
			index++;
		}
		/*if(boom.commonBoom.length > 0 || boom.hasOwnProperty("kingBoom")){
			return boom;
		}*/
	}
	var isFlying = function(arr){
		var index = 0;
		var fly = {};
		fly.flyArr = []
		while(index != arr.length - 2){
			if(arr[index].val == arr[index + 2].val){
				weight += 13;
				if(arr[index + 6] && arr[index + 3].val == arr[index + 6].val){
					weight += 15;
				}
			}
			index++;
		}
	}
	var doubleCard = function(arr,index){
		var index = index || 0;
		if (index == arr.length - 1){
			return;
		};
		if(arr[index] == arr[index + 1] && arr[index].val != 15 && arr[index].val !== 17 && arr[index].val !== 16){
			index += 2;
			weight += 5;
			doubleCard(arr,index);
		}		
	}
	var linkCard = function(arr,index = 0){
		var flag = 0;
		arr = arr;
		var caluculaWeigth = function(index = 0){
			if(index == arr.length){
				return;
			}
			if(arr[index + 1] && arr[index].val == arr[index+1].val){
				index++;
				caluculaWeigth(arr,index);
			}
			if(arr[index] && arr[index].val + 1 == arr[index+1].val){
				flag++;
				if(flag >= 5){
					weight += 15;
				}
				index++;
				caluculaWeigth(arr,index);
			}
		}
		return caluculaWeigth;
	}
	return {
		init : function(arr){
			this.arr = arr;
			weight = 17;
			this.isBoom(arr);
			this.isFlying(arr);
			this.doubleCard(arr);
			this.linkCard(arr)();
			console.log(weight)
			return weight;
		},
		isBoom : isBoom,
		isFlying : isFlying,
		doubleCard : doubleCard,
		linkCard : linkCard
	}
}

//使自己牌面居中类
var resizeShowCardStage = function(){
	var $showCardEle = $(".show_myCard");
	var cardLi = $showCardEle.find("li");
	var liWidth = $(".show_myCard").height() * 0.7;
	var width = (cardLi.length - 1) * liWidth * 2/5 + liWidth;
	$showCardEle.width(width);
}

var Observer = (function(){
	var _messages = {};
	return {
		regist : function(type,fn){
			if(typeof _messages[type] === "undefined"){
				_messages[type] = [fn];
			}
			else{
				_messages[type].push(fn);
			}
		},fire : function(type,args){
			//如果事件未注册则返回
			if(!_messages[type]){
				return;
			}
			var events = {
				type : type,
				args : args || {}
			},
			i = 0,
			len = _messages[type].length;
			for(;i < len;i++){
				_messages[type][i].call(this,events);
			}
		},remove : function(type,fn){
			if(_messages[type] instanceof Array){
				var i = _messages[type].length - 1;
				for(;i >= 0;i--){
					_messages[type][i] === fn && _messages[type].splice(i,1);
				}
			}
		}
	}
})();

//发布者类
var releaser = function(){}
releaser.prototype.msg = function(type){
	Observer.fire(type);
}

//订阅者类
var taker = function(fn,arrayClass){
	var that = this;
	that.result = fn;
	that.active = function(){
		that.result(arrayClass);
	}
}
taker.prototype.receive = function(type){
	Observer.regist(type,this.active);
}
taker.prototype.sleep = function(type){
	Observer.remove(type,this.active);
}	
//addBUtton
var addButton = function(){
	var btn = "";
	btn = '<button class="one_btn" value="1">1分</button>' +
		  '<button class="two_btn" value="2">2分</button>' +
		  '<button class="three_btn" value="3">3分</button>' + 
		  '<button class="none_btn" value="0">不叫</button>';
	return btn;
}
//钟表倒计时类
var startClock = function(endTime = 0){
	var timerSatr = null;
	var timer = null;
	timerSatr = 30;
	timer = setInterval(function(){
		timerSatr--;
		console.log(timerSatr,endTime)
		if(timerSatr < endTime){
			// clearInterval(timer);		
			timerList();
			clearTimer();			//清除定时器数组
			var Manage = new manageMsg("next");
			Manage.init();
		}else{
			$(".timer").html(timerSatr);
		}		
	},1000);
	timerList(timer);
	return timer;
}

//钟表模板类
var clockTemplate = function(){
	var html = "";
	html = '<div class="clock">' +
				'<img src="img/clock.png" alt="" />' +
				'<span class="timer">30</span>' +
			'</div>';
	return html;
}
//说话模板类
var sayTemplate = function(say){
	var sayElement = '<div class="say">' + say + '</div>';
	return sayElement;
}
//出牌区居中
var outCardResize = function(){
	var outCard = $(".out_card").width();
	$(".out_card").css({marginLeft:-outCard/2});
}

var next = (function(){
	var index = -1;
	var arrayPerson = "";
	var saveGrades = [];			//保存当前分数
	return {
		startGrab : function(arrayClass){
			index++;
			arrayPerson = arrayClass;
			console.log(index,arrayClass.length)
			if(index >= arrayClass.length){
				setTimeout(function(){
					$(".say").remove();
				},3000);
				var take = new taker(next.startGrab);
				take.sleep("next");
			}
			else{
				var personer = arrayClass[index].personer;
				var weightInfo = {};
				if(personer != "myself"){
					var weight = arrayClass[index].weight;
					clearTimer(aiClock)
				}
				else{
					clearTimer(personClock);
				}		
			}			
		},
		getArrayPerson : function(){
			return arrayPerson[index];
		},
		saveGrade : function(obj){
			console.log(saveGrades)
			saveGrades.push(obj);
		}
	}
})()
var personClock = function(){
	var btn = addButton();
	var clock = clockTemplate();
	addClock(btn + clock,$(".out_card"));
}
var aiClock = function(){
	var clock = clockTemplate();
	var person = next.getArrayPerson();
	var personClass = person.personer;
	addClock(clock,$("." + personClass),26);
}
var addClock = function(clock,selector,time=0){
	selector.append(clock);
	outCardResize();
	startClock(time);
}


//存放带有定时器的函数定时器队列
var clearTimer = function(){
	var fnList = [];
	return function(fn){
		if(!fn && fnList.length > 0){
			fnList.shift();
			timerList();				//移除定时器
			if(fnList.length >= 1){
				fnList[0]()
			}
		}
		else{
			fnList.push(fn);
			if(fnList.length <= 1){
				fnList[0]();
			}
		}
	}
}()
var timerList = function(){
	var timer = [];
	return function () {
		if(arguments.length > 0){
			timer.push(arguments[0]);
		}
		else{			
			clearInterval(timer[0]);
			timer.shift();
		}
	}
}()
var manageMsg = function(msgType){
	this.msgType = msgType;
	this.grade = 0;
}
manageMsg.prototype = {
	init : function(){
		this.manageGrade();
		this.realMsg();
	},
	realMsg : function(){
		var type = this.msgType;
		var real = new releaser();
		real.msg("next");
	},
	getPerson : function(){
		this.person = next.getArrayPerson();
		return this.person;
	},
	setMyselfGrade : function(grade){
		this.grade = grade;
	},
	saveGrade : function(obj){
		next.saveGrade(obj);
	},
	manageWeight : function(weight){
		var weightObj = {}
		if(weight <= 17){
			weightObj.grade = 0;
			weightObj.say = "不叫";
		}
		else if(weight > 17 && weight < 25){
			weightObj.grade = 1;
			weightObj.say = "一分";
		}
		else if(weight >= 25 && weight < 37){
			weightObj.grade = 2;
			weightObj.say = "二分";
		}
		else{
			weightObj.grade = 3;
			weightObj.say = "三分";
		}
		return weightObj;
	},
	manageGrade : function(){
		var person = this.getPerson();
		var obj = {};
		if(person.personer != "myself"){
			var weight = person.weight;
			obj = this.manageWeight(weight);
			$(".clock").remove();
				$(".out_card").html("");
		}
		else{
			obj = this.manageWeight(this.grade);
		}		
		obj.person = person.personer;
		var sayWord = obj.say;
		var sayPerson = obj.person;
		this.sayIn(sayWord,sayPerson);
		this.saveGrade(obj);
	},
	sayIn : function(say,person){	
		$(".say").remove();	
		var sayMsg = sayTemplate(say);
		$("." + person).append(sayMsg);
	}
}
