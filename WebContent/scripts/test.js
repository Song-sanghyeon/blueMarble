
$(document).ready(function(){

	// START 버튼 클릭시 START 버튼 비활성화
	$("#notStart").hide();
	// 출벌 지점 플레이어 숨기기
	$("#startPlayer").hide();
	// 우주 여행 select 숨기기
	$("#trip").hide();
	$("#cityPay").hide();

	let diceRs = 0; // 주사위 합산 값으로 이동해야 할 칸수가된다.
	
	let tex = 0; // 사회복지기금(c39)에 도착하게되면 150000원씩 쌓인다.
	
	let trip = 0; // 우주여행에 도착했을때 플레이어가 선택한 좌표값.

// --- ▼▼▼▼▼ GAME START ▼▼▼▼▼ --------------------------------------------------------------------------------------------

	let totalNum = 0; // 게임 참가자 인원
	
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

//--- ▼▼▼▼▼ playerAdd function ▼▼▼▼▼ --------------------------------------------------------------------------------------------

// 입력한 인원수에 맞추어 플레이어 객체 생성 함수
$.playerAdd = function(totalNum){
	let totalPlayer = new Array(); // 입력한 인원수만큼의 플레이어 객체를 저장할 배열
	// 입력한 인원수만큼 객체를 생성하는 반복문
	for(let i=0; i<totalNum; i++){
		let player = {
				money:3000000, // 자본
				name:i+1, // 플레이어 이름
				beforePoint:1, // 해당 플레이어의 이동하기 전 위치 값
				afterPoint:1, // 해당 플레이어의 이동한 뒤 위치 값 (계산을 위한 숫자)
				beforeId:null, // 해당 플레이어가 이동하기 전 위치 값
				afterId:null, // 해당 플레이어가 이동한 뒤 위치 값(#c 위치를 이동 시키기위한 문자열)
				item:null, // 해당 플레이어가 보유한 아이템(황금 열쇠)
				event:0 // 해당 플레이어가 지나간 이벤트 (무인도, 우주여행, 사회 복지 기금)
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
	
	$("#tripBtn").click(function(){
		$("#trip").hide();
		$("#diceBtn").show();
		totalPlayer[player].event = 10;
		trip = $("#space").val();
		console.log("trip :", trip);
	});
	
	// 주사위 굴리기 버튼 클릭시
	$("#diceBtn").click(function(){
		player += 1; // 순서 넘기기
		// 플레이어 순서가 인원수보다 초과시 다시 0으로 초기화 시키기 (p1->p2->p3->p4->p1....)
		if(player > totalPlayer.length-1){
			player = 0;
		}
		console.log(totalPlayer[player]);
		
		// 주사위 함수(dice())를 이용하여 랜덤 주사위의 값2개의 데이터를 가지고있는 주사위 배열을 만들어서 저장
		let dice = $.dice();
		console.log(dice); // 주사위 값 확인
		diceRs = dice.dice1+dice.dice2;	// 주사위의 합산 값 (이동해야할 칸수)
		//diceRs = 1;
		
	// --- ▼▼▼▼▼ 우주 여행 ▼▼▼▼▼ --------------------------------------------------------------------------------------------	
		if(totalPlayer[player].event == 10){
			setTimeout(function(){
				alert("선택한곳으로 이동되었습니다.")
			}, 0);
			// 해당 플레이어를 시작점인 1에서부터 시작시킨다.
			totalPlayer[player].event = 0;
			totalPlayer[player].afterPoint = 1;
			totalPlayer[player].beforePoint = 1;
			
			// 우주여행으로 선택한값을 주사위 합산값에 대입해줌으로 이동시킨다.
			if(trip > 31 && trip < 40){
				diceRs = trip-1;
			} else if(trip == 40){
				// 출발점으로 선택한 경우에는 월급을 받아야하기때문에 200000원 증가
				diceRs = trip;
				totalPlayer[player].money += 200000;
			} else {
				// 우주여행 기준으로 출발점을 지나서 도착하는 곳이라면 월급을 받아야하기때문에 200000원 증가
				diceRs = trip-1;
				totalPlayer[player].money += 200000;
			}
		}
	// --- ▲▲▲▲▲ 사회 복지 기금 ▲▲▲▲▲ ------------------------------------------------------------------------------------------
		
		// event = 4 : 플레이어가 3턴을 기다려서 다음 자신차례부터 시작할 수 있다.
		if(totalPlayer[player].event == 4){
			totalPlayer[player].event = 0;
		}
		
		// event값이 1, 2, 3인 무인도에 갇혀있어야하는 플레이어 일 경우 조건
		if(totalPlayer[player].event == 1 || totalPlayer[player].event == 2 || totalPlayer[player].event == 3){
			if(dice.dice1 == dice.dice2){
				setTimeout(function(){
					alert("주사위 더블로 무인도 탈출에 성공하였습니다. 주사위를 다시한번 굴려주세요.")
				}, 0);
				totalPlayer[player].event = 5;
				player -= 1;
			} else {
				if(totalPlayer[player].event == 3){
					setTimeout(function(){
						alert("3턴을기다려 무인도 탈출에 성공하였습니다. 다음차례부터 이동할수있습니다.")
					}, 0);
					totalPlayer[player].event = 4;
				} else {
					setTimeout(function(){
						alert("무인도 탈출에 실패하였습니다. 다음차례에 다시 도전하세요.")
					}, 0);
					totalPlayer[player].event += 1;
				}
			}
		} else if(totalPlayer[player].event == 0 || totalPlayer[player].event == 5) {
			// 해당 플레이어 주사위값 저장 (단, 총 40칸이므로 40칸을 넘어가게되면 다시 1칸부터 돌도록 해야한다.
			if(totalPlayer[player].beforePoint + diceRs > 40){
				totalPlayer[player].afterPoint += diceRs-40;
				console.log("완주 + 200000");
				// 한바퀴 완주해서 월급으로 200000원 획득
				totalPlayer[player].money += 200000;
				// 플레이어 이동 함수 실행
				$.move(totalPlayer[player], diceRs);
			} else if(totalPlayer[player].beforePoint + diceRs < 40) {
				totalPlayer[player].afterPoint += diceRs;
				console.log(">>>",totalPlayer[player]);
				// 플레이어 이동 함수 실행
				$.move(totalPlayer[player], diceRs);
			}
			
			// 이벤트값이 5일경우 (무인도에 갇혀있는 플레이어가 주사위를 던졌을때 더블이 나온경우)
			if(totalPlayer[player].event == 5){
				// 이벤트값을 0으로 초기화시켜 플레이어가 무인도에서 탈출한상태로 변경
				totalPlayer[player].event = 0;
			}
			
			if(dice.dice1 == dice.dice2){
				// 주사위의 값 두개가 같을경우 더블이기때문에 주사위를 한번 더 던질 수 있다.
				player -= 1; // 순서값을 1 줄임으로써 다시 주사위를 클릭했을때 자신의 차례가 오게 함
			}
		} 
	});
};

//--- ▼▼▼▼▼ move function ▼▼▼▼▼ --------------------------------------------------------------------------------------------
	// totalPlayer리스트에서 해당 player객체와 이동해야할 주사위의 값을 매개변수로 받는 move함수
	$.move = function(player, diceRs){
		console.log("무브 : ",player);
		console.log("diceRs : ",diceRs);
		console.log(">>>>>>>>>>>>>>", player);

		player.afterId = "#c"+player.afterPoint; // 해당 플레이어가 이동하고나서의 지점
		player.beforeId = "#c"+player.beforePoint; // 해당 플레이어가 이동하기 전 지점
		// 해당 플레이어가 이동하고나서의 지점에 해당 플레이어의 이미지를 생성
		$(player.afterId).append($("#player"+player.name));
		// 해당 플레이어가 이동하기전 지점에 이미지가 존재하면 안되니까 이미지 삭제
		$(player.beforeId).find($("#player"+player.name)).remove();
		// 해당 플레이어의 이동이 끝나면 이동하고나서와 이동하기전 지점은 같기떄문에 값을 동일하게 한다.
		player.beforeId = player.afterId;
		player.beforePoint = player.afterPoint;
		
		// $.moveCity(player);
		
		// 플레이어이 이동이 끝난 뒤 플레이어가 무인도에 도착했을때 event값을 1 증가시킨다.
		if(player.event == 0 && player.beforePoint == 11){
			setTimeout(function(){
				alert("무인도에 도착하였습니다! (주사위 더블이나 3턴을 기다려야 탈출할 수 있습니다.)")
			}, 0);
			player.event += 1;
			$("#now").text("무인도");
		} else {
			$("#now").text(player.beforePoint); // 화면에 해당 플레이어가 이동한 지점이 출력된다.	
		}
		
	// --- ▼▼▼▼▼ 사회 복지 기금 ▼▼▼▼▼ --------------------------------------------------------------------------------------------
		// 플레이어가 사회복지기금(c39)에 도착하게되면 150000원을 지불해야한다.
		if(player.beforePoint == 39){
			setTimeout(function(){
				alert("사회복지기금을 지불해야합니다. -150000")
			}, 0);
			player.money -= 150000;
			tex += 150000; // 사회복지기금에 150000원을 더해준다.
			console.log("tex :",tex);
		}
		// 플레이어가 사회복지기금 접수처(c21)에 도착하게되면 사회복지기금(tex)의 값을 받는다.
		if(player.beforePoint == 21){
			setTimeout(function(){
				alert("사회복지기금접수처에 모인 사회복지기금을 받습니다.")
			}, 0);
			player.money += tex;
			tex = 0; // 사회복지기금 초기화
		}
	// --- ▲▲▲▲▲ 사회 복지 기금 ▲▲▲▲▲ ------------------------------------------------------------------------------------------
		// 우주여행 도착했을경우
		if(player.beforePoint == 31){
			setTimeout(function(){
				alert("우주여행에 도착하였습니다! 다음차례에 이동하고싶은 곳을 선택해서 클릭해주세요.");
			}, 0);
			// 이동하고자하는곳을 선택할 수 있는 select가 나온다.
			$("#trip").show();
			// 선택하기까지 차례를 넘길수없도록 주사위버튼을 비활성화시킨다.
			$("#diceBtn").hide();
		}
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
	
	$.moveCity = function(player){
		console.log("moveCity ------------------------------");
		console.log(player);
		
		switch (player.beforeId) {
		case "#c2":
			console.log("타이페이");
			$("#diceBtn").hide();
			$("#cityPay").show();
			$("#cityName").text("타이페이");
			break;

		default:
			console.log(";;;");
			break;
		}
	}
	
	
});

/*
	땅 구입
	대지료를 지불하여 땅의 소유권을 구입하거나, 대지료+주택의 가격을 지불하여 주택을 구입하거나
	대지료+빌라의 가격을 지불하여 빌라를 구입하거나, 대지료+호텔의 가격을 지불하여 호텔을 구입할 수 있는
	23개의 땅과
	대지료를 지불하여 땅의 소유권만 구입이 가능한 6개의 섬을 구입할 수 있다.
	
	플레이어가 이동하였을때 다른 플레이어의 소유권을 가진 땅을 밟을경우 해당하는 지불액만큼 돈을 지불하여야한다.
	플레이어가 이동하였을때 자신이 소유권을 가진 땅을 밟을경우 이미 생성한 건물을 제외하고 새로 건물을 지을수있다.
	
 */

/*
	우주여행
	우주여행으로 선택한 값이 32~40사이에 경우 월급x 이동
	우주여행으로 선택한 값이 32~40을 제외한 경우 월급을받고 이동
	우주여행으로 가게된 이벤트도 실행해야함.
 */

/*
	사회복지기금 접수처 && 사회복지기금
	사회복지기금 (c39)에 플레이어가 도착하게되면 해당 플레이어의 money값이 150000원 감소
	돈이 감소하게되면 사회복지기금 접수처 (c21)에 money값이 150000원 상승
	플레이어가 사회복지기금 접수처에 도착하게되면 해당 플레이어는 사회복지기금 접수처 money값 만큼 상승
	또한 사회복지기금 접수처의 money값은 0으로 초기화

*/	

/*
	무인도 함수 
	event=0 : 무인도에 도착하지않은 상태
	event=1 : 무인도에 도착한 상태
	event=1->2 : 주사위를 굴리고 더블이 나오지않은상태 (첫번째)
	event=2->3 : 주사위를 굴리고 더블이 나오지않은상태 (두번째)
	event=3->4 : 주사위를 굴리고 더블이 나오지않은상태 (세번째)
	event=4 : 3번의 턴을 기다려서 무인도를 탈출해서 자신 차례에 주사위만 굴리면 되는 상태
	event=5->0 : 갇혀있는 상태에서 주사위 더블이나오게되면 차례를 다시시작하고 event값은 0으로 바꾸어주어야한다.
*/
	