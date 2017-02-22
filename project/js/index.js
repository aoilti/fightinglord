/**
 * create in 2016/12/21
 */
$(function(){
//	document.webkitRequestFullScreen();
	/*$(".btn").click(function(){
		$(".begin").hide();
	})	*/

	FastClick.attach(document.body);
	var SuperPersonClass = new SuperPerson();
	SuperPersonClass.init();
	$(".out_card").on("click","button",function(){
		var val = $(this).val();
		// console.log(val)
		if(!isNaN(val)){
			var Manage = new manageMsg("next");
			Manage.setMyselfGrade(val);
			Manage.init();
			/*var obj = {};
			obj.person = "myselef";
			obj.grade = val;
			saveGrade.push(obj);*/
			clearTimer();
		}
		$(".out_card").html("");
	})
	// var cardsList = SuperPersonClass.getPersonsCard();
/*	$(document).mousedown(function(){
		console.log(new Date().getTime(),"down")
	})
	$(document).mouseup(function(){
		console.log(new Date().getTime(),"up")
	})
	$(document).on("tap",function(){
		console.log(new Date().getTime(),"click")
		// console.log(12)
		// clearTimer();
	})*/
})
