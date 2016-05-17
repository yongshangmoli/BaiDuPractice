/**
 * 1，定义一个枚举类，方便表示牌的花色和点数（用到了自定义的继承函数）
 * 2，定义一个牌类，属性值包括花色和点数
 * 3，定义一个扑克类，属性值包括牌数组（含52张牌），方法包括洗牌和发牌
 * 4，定义一个玩家类，属性值包括当前手牌总点数、手牌数组、手牌是否含有A（因为它可以表示两个值，所以备注下方便最后计算分数），
 * 		 玩家的方法包括hit(要一张牌)、计算最终得分、判断输赢、是否burst(点数超过21点)。
 * 5，定义事件绑定函数与取消事件冒泡函数，分别为点击按键(开始游戏，要一张牌，停止要牌，重新开始游戏)添加事件处理函数
 * 6，定义游戏结束（玩家分出输赢后），恢复现场的函数（比如按键复位，重新洗牌，玩家手牌状态清理为空等）
 * 
 * 注：仅当玩家未爆掉且停止要牌之后，庄家才自动开始要牌行为。庄家的策略简单设置为手牌点数超过16点就停止要牌。
 * 			庄家停止要牌之后判断双方输赢，仅当游戏玩家点数大于庄家点数是才判做玩家赢
 */
(function() {
	/**定义一个枚举的类，它是一个工厂方法，每次调用可以返回一个新的类*/
	function enumeration(namesToValue) {
		var enumeration = function() {
			throw new Error("can not instantiate Enumerations;");
		}
		var proto = enumeration.prototype = {
				constructor : enumeration,
				toString:function() {
					return this.name;
				},
				valueOf:function() {
					return this.value;
				}
		}
		enumeration.values = [];
		for(name in namesToValue) {
			var e = inherit(proto);
			e.name = name;
			e.value = namesToValue[name];
			enumeration[name] = e;
			enumeration.values.push(e);
		}
		enumeration.foreach = function(f,c) {
			for(var i=0;i<this.values.length;i++) {
				f.call(c,this.values[i]);
			}
		}
		return enumeration;
	}
	
	/**通过原型继承创建新对象*/
	function inherit(p) {
		if(p == null) {
			throw TypeError();//p是一个对象，但不能是null
		}
		if(Object.create) {
			return Object.create(p);
		}
		var t = typeof p;
		if(t !== 'object' && t !== 'function') {
			throw TypeError();
		}
		function f() {};
		f.prototype = p;
		return new f();
	}
	
	/**定义牌类*/
	function Cards(style,num) {
		this.style = style;  //牌的花色
		this.num = num;//牌的点数
	}
	/**使用枚举类型来定义牌的花色和点数*/
	Cards.Style = enumeration({
		Hearts:1,//红心
		Clubs:2,//梅花
		Diamonds:3,//方块
		Spades:4//黑桃
	});
	Cards.Num = enumeration({
		Two:2, Three:3, Four:4, Five:5, Six:6, Seven:7, Eight:8, Nine:9, Ten:10, Jack:11, Queen:12, King:13, Ace:14
	});
	
	/**定义一副扑克*/
	function Poker() {
		var cards = this.cards = [];
		Cards.Style.foreach(function(s) {
			Cards.Num.foreach(function(r) {
				cards.push(new Cards(s,r));
			});
		});
	}
	/**定义洗牌，返回洗好的牌数组*/
	Poker.prototype.shuffle = function() {
		var poker = this.cards,len = poker.length;
		for(var i=len-1;i>0;i--) {
			var r = Math.floor(Math.random()*(i+1));//随机找个面值以内的数，然后与当前遍历到的元素交换值
			var temp;
			temp = poker[i];
			poker[i] = poker[r];
			poker[r] = temp;
		}
		return this;
	}
	/**定义发牌，返回剩下的牌的数组*/
	Poker.prototype.deal = function(n) {
		if(this.cards.length < n) {
			throw new Error('cards is not enough');
		}
		return this.cards.splice(this.cards.length-n,n);
	}
	
	/**定义玩家*/
	function Player() {
		this.count = 0;
		this.cards = [];
		this.countA = false;
	}
	/**定义玩家的要牌行为，更新玩家手上的牌，存储现有点数*/
	Player.prototype.hit = function() {
		var card = mypoker.deal(1)[0];
		this.cards.push(card);
		var cardValue = card.num.value;
		if(cardValue === 14) {
			this.countA = true;
			cardValue = 1;//遇到A暂时先把它当做一点看待
		}
		else {
			cardValue = cardValue > 10 ? 10:cardValue;
		}
		this.count += cardValue;
		if(this.count > 21) {
			return false; //表示不能继续hit
		}
		return true;
	}
	/**定义玩家的最终得分，如果有A，看加10是否爆掉，确保取得最高分*/
	Player.prototype.finalScore = function() {
		if(this.countA) {
			var more =  this.count+10;
			if(more <= 21) {
				this.count = more;
			}
		}
		return this.count;
	}
	/**定义玩家是否赢得比赛，仅当自己分数大于另一玩家时赢得比赛*/
	Player.prototype.isWin = function(player) {
		this.finalScore();
		if(this.count > player.count) {
			return true;
		}
		return false;
	}
	/**每次hit后判断是否爆掉*/
	Player.prototype.isBurst = function() {
		if(this.count > 21) {
			return true;
		}
		return false;
	}
	
	/**事件绑定函数*/
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
	/**取消事件冒泡*/
	function stopBubble(e) {
		if(e.stopPropagation) {
			e.stopPropagation();
		}
		else {
			e.cancelBubble = true;
		}
	}
	
	var dealer = document.getElementById("dealer");
	var player = document.getElementById("player");
	var dealerScore = document.getElementById("dealerScore");
	var playerScore = document.getElementById("playerScore");
	var choice = document.getElementById("choice");
	var poker = document.getElementById("poker"); 
	var info = document.getElementById("info"); 

	/**为扑克牌绑定事件处理函数，牌桌上无牌时各发两张牌，有牌时发一张牌*/
	addEvent(poker,'click',function(e) {
		stopBubble(e);
		var src = choice.firstElementChild.firstElementChild.src;
		if(src.indexOf('imgs\/g')>0) {
			var src2 = choice.firstElementChild.nextElementSibling.firstElementChild.src;
			if(src2.indexOf('imgs\/g') < 0) {
				oneMore();
			}
		}
		else {
			start();
			choice.firstElementChild.firstElementChild.src = 'imgs/gstart.png';
			clickable(choice);
			displayDealerScore(p1,dealerScore,false);
			displayPlayerScore(p2,playerScore);
		}
	});
	
	addEvent(choice,'click',function(e) {
		stopBubble(e);
		var title = e.target.title;
		if(title == '开始游戏') {
			if(e.target.src.indexOf('imgs/gstart.png') < 0) {
				start();
				e.target.src = 'imgs/gstart.png';
				displayDealerScore(p1,dealerScore,false);
				displayPlayerScore(p2,playerScore);
				clickable(choice);
			}
		}
		else if(title == '再来一张') {
			if(e.target.src.indexOf('imgs/gmoveon.png') < 0) {
				oneMore();
			}
		}
		else if(title == '停止要牌') {
			if(e.target.src.indexOf('imgs/gnomore.png') < 0) {
				var res = dealerDead();
				e.target.parentNode.previousElementSibling.firstElementChild.src = 'imgs/gmoveon.png';
				setTimeout(function() {
					if(res) {
						setInfo("庄家超过21点，玩家胜！");
					}
					else {
						if(p2.isWin(p1)) {
							setInfo("玩家点数大，玩家胜！");
						}
						else {
							setInfo("庄家点数大，庄家胜！");
						}
					}
					//游戏结束，将背面牌替换为正面
					var back = p1.cards.slice(1,2)[0];
					var imgName = back.style.value.toString()+back.num.value.toString()+".jpg";
					dealer.firstChild.nextSibling.src = "imgs\\"+ imgName;
					dealerScore.innerHTML = p1.finalScore();
					dealerScore.style.display = '';
					e.target.src = 'imgs/gnomore.png';
				}, 1000);
				setTimeout(function() {
					restart();
				},3000);
			}
		}
		else if(title == '重新开始') {
			if(e.target.src.indexOf('imgs/gstand.png') < 0) {
				restart();
			}
		}
	});
	/**点击牌或者start触发开始函数*/
	function start() {
		dealer.innerHTML = '';
		addCardToHand(p1,dealer);
		//	加一张牌背面到桌上
		p1.hit();
		var imgName = "pokerBg.jpg";
		var img = document.createElement('img');
		img.src = "imgs\\"+ imgName;
		img.style.position = 'absolute';
		img.style.top = '0px';
		img.style.left = (p1.cards.length-1)*20+'px';
		dealer.appendChild(img);
		
		player.innerHTML = '';
		addCardToHand(p2,player);
		addCardToHand(p2,player);
	}
	/** 玩家点击再来一张时触发的函数*/
	function oneMore() {
		addCardToHand(p2,player);
		displayPlayerScore(p2,playerScore);
		setTimeout(function() {
			if(p2.isBurst()) {
				setInfo("玩家超过21点，庄家胜！");
				var back = p1.cards.slice(1,2)[0];
				var imgName = back.style.value.toString()+back.num.value.toString()+".jpg";
				dealer.firstChild.nextSibling.src = "imgs\\"+ imgName;
				dealerScore.innerHTML = p1.count;
				dealerScore.style.display = '';
				setTimeout(function() {
					restart();
				},2000);
			}
			else {
				displayPlayerScore(p2,playerScore);
			}
		},1000);
	}
	/**加一张手牌显示在桌面上*/
	function addCardToHand(who,container) {
		who.hit();
		var card = who.cards.slice(-1)[0];
		var imgName = card.style.value.toString()+card.num.value.toString()+".jpg";
		var img = document.createElement('img');
		img.src = "imgs\\"+ imgName;
		img.style.position = 'absolute';
		img.style.top = '0px';
		img.style.left = (who.cards.length-1)*20+'px';
		container.appendChild(img);
	}
	/**将玩家的分数显示在牌桌上*/
	function displayPlayerScore(player,span) {
		var score = player.count;
		span.innerHTML = score;
		span.style.display = '';
	}
	/**将庄家的分数显示在牌桌上，仅当游戏结束回合显示扣住的牌*/
	function displayDealerScore(dealer,span,gameOver) {
		var score;
		if(gameOver) {
			score = dealer.count;
		}
		else {
			var hide = dealer.cards.slice(1,2)[0].num.value;
			if(hide === 14) {
				score = dealer.count-1;
			}
			else if(hide > 10) {
				score = dealer.count-10;
			}
			else {
				score = dealer.count-hide;
			}
		}
		span.innerHTML = score+"";
		span.style.display = '';
	}
	
	/**将所有的图标恢复为初始状态*/
	function iconRestart(container) {
		var child = container.firstElementChild;
		child.firstElementChild.src = 'imgs/start.png';
		child = child.nextElementSibling;
		while(child) {
			var src = child.firstElementChild.src;
			var gindex = src.indexOf('imgs\/g');
			if(gindex < 5) {
				gindex = src.indexOf('img');
				child.firstElementChild.src = src.slice(0,gindex+5).concat('g',src.slice(gindex+5,src.length));
			}
			child = child.nextElementSibling;
		}
	}
	
	/**在点击开始之后后面的图标才能点击*/
	function clickable(container) {
		var child = container.firstElementChild.nextElementSibling;
		while(child) {
			var src = child.firstElementChild.src;
			var gindex = src.indexOf('imgs');
			child.firstElementChild.src = src.slice(0,gindex+5).concat(src.slice(gindex+6,src.length));
			child = child.nextElementSibling;
		}
	}
	/**将玩家手牌清空*/
	function cardsClear(who) {
		who.count = 0;
		who.cards = [];
		who.countA = false;
	}
	/**将分数显示情况*/
	function clearScore(span) {
		span.style.display = 'none';
		span.innerHTML = '';
	} 
	/**设置提示结果的图层*/
	function setInfo(tip) {
		info.innerHTML = tip;
		info.parentNode.style.display = '';
	}
	/**情况提示结果的图层*/
	function noInfo() {
		info.innerHTML = '';
		info.parentNode.style.display = 'none';
	}
	/**将所有状态恢复成游戏初始状态*/
	function restart() {
		iconRestart(choice);
		cardsClear(p1);
		cardsClear(p2);
		dealer.innerHTML = '庄家';
		player.innerHTML = '玩家';
		clearScore(dealerScore);
		clearScore(playerScore);
		noInfo();
		pokerReady();
	}
	/**将牌准备好，并洗牌*/
	function pokerReady() {
		mypoker = new Poker();
		mypoker.shuffle();
	}
	
	/**庄家的行为：当手上点数大于等于17时就不要牌了*/
	function dealerDead( ) {
		while(p1.finalScore() < 17) {
			addCardToHand(p1,dealer);
			displayDealerScore(p1,dealerScore,false);
			if(p1.finalScore() > 21) {
				return true;
			}
		}
		return false;
	}
	
	function introduce() {
		var info = document.getElementById("info"); 
		
	}
	/**初始化，将牌和玩家都就绪*/
	var mypoker;
	var p1 = new Player();
	var p2 = new Player();
	pokerReady();
	restart();
})()