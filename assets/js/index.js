document.getElementById("start").addEventListener("click",startTimer);
document.getElementById("pause").addEventListener("click",pauseTimer);
document.getElementById("stop").addEventListener("click",stopTimer);
document.getElementById("nap").style.display = "none";

var currentTime="",minutes="",seconds="",ret,messageReturn,breakButton = document.getElementById("nap"),isBreak=0,message,messageMoveReturn, alarm = new Audio("assets/sounds/gong.mp3");;

var messages = ["Keep going, you're doing great !","I'm so proud of you !", "You can do it !", "I believe in you !", "You are amazing !", "Carpe diem !", "You go, girl/boy !", "Go get that task done !","Work hard so you can play later.","Good going !","Don't bail on yourself !","I'm so happy you chose to work today!"];

function randomMessageGenerator(){ //returns a random message from the messages array
	var randomNumber = Math.floor(Math.random()*messages.length);
	document.getElementById("message").innerHTML = messages[randomNumber];
	message = document.getElementById("message");
	return message;
}

function messageMove(){
	setTimeout(function(){
		message.classList.add("messagetransitiondown");
	},3);
	setTimeout(function(){
		message.classList.add("messagetransitionup");
	},6700);
	message.classList.remove("messagetransitionup");
	message.classList.remove("messagetransitiondown");
}

function displayMessage(){  //displays the random message generated by randomMessageGenerator every 7 seconds
	messageReturn = setInterval(randomMessageGenerator,7000);
	messageMoveReturn = setInterval(messageMove,7000);
} 
function hideMessage(){ //hides the message
	clearInterval(messageReturn);
	document.getElementById("message").innerHTML = "";
}  

function startTimer(){ //gets activated on clicking the start button
	currentTime = document.getElementById("time").innerHTML; 
	if(currentTime === "00:00"){
		document.getElementById("time").innerHTML="25:00";
		currentTime = "25:00";
	}
	minutes = currentTime.substring(0,2);
	seconds = currentTime.substring(3,6);
	ret = setInterval(startCountdown,1000);
	document.getElementById("start").removeEventListener("click",startTimer);
	console.log("is Break is " + isBreak);
	if(isBreak===0)
	{
		displayMessage();
		hideBreakButton();
	}
}

function changeTime(time){ //to display the changing time on the screen
	document.getElementById("time").innerHTML = time;
}

function startCountdown(){  //describes logic of the countdown
	if(seconds==="00"){ //this can happen in two situations, when the timer has run out or when one minute is over
			if((minutes==="00")&&(isBreak===0)){  //this means that the time is over, now stop the countdown and play the alarm
				clearInterval(ret);
				clearInterval(messageReturn);
				document.getElementById("message").innerHTML = "Congratulations ! Take a break, you deserve it !";
				
				alarm.play();
				document.activeElement.blur();
				document.getElementById("start").addEventListener("click",startTimer);
				showBreakButton();
				clearInterval(messageMoveReturn);
			}else if((minutes==="00")&&(isBreak===1)){
				clearInterval(ret);
				clearInterval(messageReturn);document.activeElement.blur();
				document.getElementById("start").addEventListener("click",startTimer);
				alarm.play();
				document.getElementById("message").innerHTML = "Time to get back to work !";
				isBreak = 0;
			}else{  //one minute is over, now change seconds to 59 in the previous minute
				seconds="59";
				if(minutes<="10"){  //we need always display minutes in two digits
					minutes--;
					minutes = "0" + minutes;
				}
				else{
					minutes--; 
				}
			}
	    }//end of first major if statement that describes what to do when seconds is 00
	else if (seconds<="10"){  //to always display seconds in two digits, even when it is less than 10
		seconds--;
		seconds = "0" + seconds;
	}
	else{ //when seconds is any number between 10 and 59, we simply need to decrement by one 
		seconds--;
	}
	currentTime = minutes + ":" + seconds;
	changeTime(currentTime);	
}

function stopTimer(){  //gets activated on clicking stop button
	pauseTimer();
	document.getElementById("time").innerHTML="00:00";
	document.getElementById("start").addEventListener("click",startTimer);  //reactivating the start button to sense when it is clicked
	clearInterval(messageReturn);
	hideMessage();
	isBreak=0; //if user clicks on stop button during a break, we need to changew isBreak from 1 to 0
}

function pauseTimer(){  //gets activated on clicking pause button
	clearInterval(ret);
	clearInterval(messageReturn);
	clearInterval(messageMoveReturn);
	document.getElementById("start").addEventListener("click",startTimer);
}

function showBreakButton(){ //break button to be displayed when timer finishes 25 minutes
	breakButton.style.display = "inline-block";
	breakButton.addEventListener("click",takeABreak);
}

function hideBreakButton(){
	breakButton.style.display = "none";
}

function takeABreak(){
	document.getElementById("time").innerHTML = "05:00";
	document.getElementById("nap").removeEventListener("click",takeABreak);
	isBreak = 1;
	startTimer();
	hideBreakButton();
	
	// document.getElementById("start").addEventListener("click",startTimer);
}