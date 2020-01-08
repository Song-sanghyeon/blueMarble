
$(document).ready(function(){

	// START 버튼 클릭시 START 버튼 비활성화
	$("#notStart").hide();
	// 출벌 지점 플레이어 숨기기
	$("#startPlayer").hide();
	// 우주 여행 select 숨기기
	$("#trip").hide();

	let diceRs = 0; // 주사위 합산 값으로 이동해야 할 칸수가된다.

// --- ▼▼▼▼▼ GAME START ▼▼▼▼▼ --------------------------------------------------------------------------------------------

	let totalNum = 0; // 게임 참가자 인원
	let totalPlayer = new Array(); // 입력한 인원수만큼의 플레이어 객체를 저장할 배열
	
	$("#startBtn").click(function(){
		totalNum = $("#playerCheck").val();
		// 입력한 인원수를 매개변수로 플레이어를 생성하는 함수를 호출하고 배열을 저장
		totalPlayer = $.playerAdd(totalNum);
		// 플레이어 객체 확인
		console.log(totalPlayer);
		$("#start").hide();
		// 게임 시작시 플레이어 인원 수 만큼만 플레이어가 나와야하기떄문에 반복문 사용
		for(let i=0; i<totalNum; i++){
			// 게임 시작시 선택한 플레이어 인원 수 만큼만 플레이어 말판 생성
			$("#c1").append($("#player"+(i+1)));
		}
		$.game(totalPlayer);
	});
});

//--- ▼▼▼▼▼ playerAdd function ▼▼▼▼▼ --------------------------------------------------------------------------------------------

// 입력한 인원수에 맞추어 플레이어 객체 생성 함수
$.playerAdd = function(totalNum){
	let totalPlayer = new Array();
	// 입력한 인원수만큼 객체를 생성하는 반복문
	for(let i=0; i<totalNum; i++){
		let player = {
				money:10000, // 자본
				name:i+1, // 플레이어 이름
				beforePoint:1, // 해당 플레이어의 이동하기 전 위치 값
				afterPoint:1, // 해당 플레이어의 이동한 뒤 위치 값 (계산을 위한 숫자)
				beforeId:null, // 해당 플레이어가 이동하기 전 위치 값
				afterId:null, // 해당 플레이어가 이동한 뒤 위치 값(#c 위치를 이동 시키기위한 문자열)
				item:null // 해당 플레이어가 보유한 아이템(황금 열쇠)
		};
		// 객체를 생성하고 배열에 저장
		totalPlayer[i] = player;
	};
	// 생성된 인원수의 플레이어 객체가 생성된 배열을 리턴
	return totalPlayer;
};

//--- ▲▲▲▲▲ playerAdd function ▲▲▲▲▲ ------------------------------------------------------------------------------------------

// --- ▼▼▼▼▼ game function ▼▼▼▼▼ --------------------------------------------------------------------------------------------

$.game = function(totalPlayer){
	console.log("game function START");
	console.log("플레이어 수 : ",totalPlayer.length);
	let player = -1; // 시작하는 플레이어는 -1부터 시작한다.(리스트는 0부터시작하기떄문에 0으로 시작시키기 위함)
	// START 버튼 클릭시 START 버튼은 사라지고 게임이 시작된다.
	$("#start").hide();
	$("#notStart").show();

	// 주사위 굴리기 버튼 클릭시
	$("#diceBtn").click(function(){
		player += 1; // 순서 넘기기
		console.log(totalPlayer[player]);
		// 플레이어 순서가 인원수보다 초과시 다시 0으로 초기화 시키기 (p1->p2->p3->p4->p1....)
		if(player > totalPlayer.length-1){
			player = 0;
		}
		// 주사위 함수(dice())를 이용하여 랜덤 주사위의 값2개의 데이터를 가지고있는 주사위 배열을 만들어서 저장
		let dice = $.dice();
		console.log(dice); // 주사위 값 확인
		diceRs = dice.dice1+dice.dice2;	// 주사위의 합산 값 (이동해야할 칸수)
		console.log(diceRs);
		// 해당 플레이어 주사위값 저장 (단, 총 40칸이므로 40칸을 넘어가게되면 다시 1칸부터 돌도록 해야한다.
		if(totalPlayer[player].beforePoint + diceRs > 40){
			totalPlayer[player].afterPoint += diceRs-40;
			console.log("완주");
			totalPlayer[player].money += 200000;
			$.move(totalPlayer[player], diceRs);
			totalPlayer[player].beforePoint = totalPlayer[player].afterPoint;
		} else {
			totalPlayer[player].afterPoint+=diceRs;
			console.log(totalPlayer[player]);
			$.move(totalPlayer[player], diceRs);
			totalPlayer[player].beforePoint = totalPlayer[player].afterPoint;
		}
		// 주사위의 값 두개가 같을경우 더블이기때문에 주사위를 한번 더 던질 수 있다.
		if(dice.dice1 == dice.dice2){
			console.log("더블");
			player -= 1; // 순서값을 1 줄임으로써 다시 주사위를 클릭했을때 자신의 차례가 오게 함
		}
	});
};

//--- ▼▼▼▼▼ move function ▼▼▼▼▼ --------------------------------------------------------------------------------------------
	// totalPlayer리스트에서 해당 player객체와 이동해야할 주사위의 값을 매개변수로 받는 move함수
	$.move = function(player, diceRs){
		console.log("무브 : ",player);
		console.log("diceRs : ",diceRs);
		player.afterId = "#c"+player.afterPoint; // 해당 플레이어가 이동하고나서의 지점
		player.beforeId = "#c"+player.beforePoint; // 해당 플레이어가 이동하기 전 지점
		// 해당 플레이어가 이동하고나서의 지점에 해당 플레이어의 이미지를 생성
		$(player.afterId).append($("#player"+player.name));
		// 해당 플레이어가 이동하기전 지점에 이미지가 존재하면 안되니까 이미지 삭제
		$(player.beforeId).find($("#player"+player.name)).remove();
		// 해당 플레이어의 이동이 끝나면 이동하고나서와 이동하기전 지점은 같기떄문에 값을 동일하게 한다.
		player.beforePoint = player.afterPoint;
		$("#now").text(player.beforePoint); // 화면에 해당 플레이어가 이동한 지점이 출력된다.
	};

//--- ▲▲▲▲▲ move function ▲▲▲▲▲ ------------------------------------------------------------------------------------------

// --- ▼▼▼▼▼ dice function ▼▼▼▼▼ --------------------------------------------------------------------------------------------
	// 1부터 6까지 6개의 숫자중 랜덤으로 한개의 숫자가 나와 리턴하는 함수(중복가능 주사위2개)	
	$.dice = function(){
		//console.log("dice function START");
		let dice1 = Math.floor((Math.random()*6)+1); // 1~6 사이의 랜덤 숫자
		let dice2 = Math.floor((Math.random()*6)+1); // 1~6 사이의 랜덤 숫자
		//console.log("dice1 : ",dice1);
		//console.log("dice2 : ",dice2);
		let dice = {dice1, dice2};
		// 주사위2개의 값 리턴
		return dice;
	}
// --- ▲▲▲▲▲ dice function ▲▲▲▲▲ ------------------------------------------------------------------------------------------		