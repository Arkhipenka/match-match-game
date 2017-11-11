var numberOfGames = 0;
function Game() {}
Game.prototype.settingSkirt = function(n) {
	// add shadow for new choice and remove in previous, if it exists 
	if (this.prevShadowSkin == undefined) {
		document.getElementById("skin"+n).classList.add("shadowForSkin");
	} else if(this.prevShadowSkin != n) {
		document.getElementById("skin"+n).classList.add("shadowForSkin");
		document.getElementById("skin"+this.prevShadowSkin).classList.remove("shadowForSkin");
	} 
	this.prevShadowSkin = n; 
	this.skirt = n; // set the value for the field generator
	this.unlockStartButton(); //try to unlock start button
}
Game.prototype.settingDifficulty = function(n) {
	// add shadow for new choice and remove in previous, if it exists
	if (this.prevShadowDiff == undefined) {
		document.getElementById("diff"+n).classList.add("shadowForDiff");
	} else if(this.prevShadowDiff != n) {
		document.getElementById("diff"+n).classList.add("shadowForDiff");
		document.getElementById("diff"+this.prevShadowDiff).classList.remove("shadowForDiff");
	}
	this.prevShadowDiff = n;
	this.difficulty = n; // set the value for the field generator
	this.unlockStartButton(); //try to unlock start button
}
Game.prototype.unlockStartButton = function() {
	if(this.difficulty > 0 && this.skirt > 0) {
		document.getElementById('startButton').disabled = false;	
	}
}
Game.prototype.getRandomImageNumbersArray = function(numberOfCards) {
	const variantsOfImages = 12; // maximum number of different pictures in this game

	function shuffleArray(array) {
	    for (let i = array.length - 1; i > 0; i--) {
	        let j = Math.floor(Math.random() * (i + 1));
	        [array[i], array[j]] = [array[j], array[i]];
	    }
	} 

	var imagesArray = [];
	while (imagesArray.length < numberOfCards) {
	  var randmomImageNumber = 1 + Math.floor(Math.random() * variantsOfImages);
	  if( imagesArray.indexOf(randmomImageNumber) == -1 ) {
	     imagesArray.push(randmomImageNumber); 
	     imagesArray.unshift(randmomImageNumber);  // Adding one value twice to the end and beginning of the array
	  }
	}
	shuffleArray(imagesArray);
	return imagesArray;
}
Game.prototype.timer = function(n) {
	var timer = document.getElementById("timer");
	timer.className = "timer";
	var min = 0, sec = 0;
	timer.innerHTML = "0"+min+":0"+sec;
	function startTimer() {
		if (sec == 59) {
			min++;
			sec = 0;
			if (min < 10) min = "0" + min;
		} else {
			sec++;
			if (sec < 10) sec = "0" + sec;
		}
		if(min == 60 && sec == 0) { min = 0;}
		if(sec == 0) sec = "0" + 0;
		if(min == 0) min = "0" + 0;
		timer.innerHTML = min+":"+sec;
	}
	varForStop = setInterval(startTimer, 1000);  // the timer counts an hour only, then repeat
} 
Game.prototype.generatorField = function(fieldSize) {
	this.field = fieldSize;

	var gameFiledSection = document.createElement('section'); //  all our cards will be in this section in  quantity  'fieldSize'
	gameFiledSection.id = "fieldDifficulty"+this.difficulty;
	gameFiledSection.className = "fieldDifficulty"+this.difficulty;
	var main = document.getElementById("main");
	main.appendChild(gameFiledSection); // set the  right class and id for section and added in id 'main' 

	this.secretImageNumbersArray = this.getRandomImageNumbersArray(fieldSize); // received an array with a random location of image numbers
	for(var i = 1; i <= fieldSize; i++) {
		var newCard = document.createElement('div'); 
		newCard.id = "flipper"+i;
		newCard.className = "flipper"; 
		gameFiledSection.appendChild(newCard);
		var frontDiv = document.createElement('div');
		frontDiv.id = "front"+i;
		frontDiv.className = "front";
		frontDiv.setAttribute("onclick", "checkTrueAnswer("+i+")");
		newCard.appendChild(frontDiv);
		var backDiv = document.createElement('div');
		backDiv.id = "back"+i+"";
		backDiv.className = "back";
		//backDiv.setAttribute("onclick", "flipback("+i+")");
		newCard.appendChild(backDiv);
		frontDiv.classList.add("skinbackground"+this.skirt);
		backDiv.style.background= "#FFF url('img/game" +  this.skirt +"/"+this.secretImageNumbersArray[i-1]+".png')  center center no-repeat";
		backDiv.style['background-size'] = "80%"; 
		
	}	
}
Game.prototype.congratulations = function() {
	var deletSection = document.getElementById("fieldDifficulty"+this.difficulty);
	deletSection.style.display="none";
	var congratulationsCard = document.getElementById('congratulationsCard');
	congratulationsCard.style.display="block";
	function opacity() {
		document.getElementById("congratulationsCard").style.opacity = "1";
	}
	setTimeout(opacity, 1500);
	var flipBackCongratulations = function() {
		document.getElementById('congratulationsCard').style.transform = 'rotateY(0deg)'; 
	}
	function rotateCongratulationsCard() {
		document.getElementById('congratulationsCard').style.transform = 'rotateY(180deg)';
		setTimeout(flipBackCongratulations, 1500);
	}
	var intervalRotateCongratulationsCard = setInterval(rotateCongratulationsCard, 3000);
	function deleteCongratulationsCard(n) {
		if(n != numberOfGames) return;
		congratulationsCard.style.display="none";
	}
	this.numberOfGames = numberOfGames;
	setTimeout(deleteCongratulationsCard, 10000, this.numberOfGames);
	setTimeout(endGame, 10000, this.numberOfGames);


}
Game.prototype.newGame = function() {
	var deletDiff = document.getElementById("fieldDifficulty"+this.difficulty); 
	var main = document.getElementById("main");
	main.removeChild(deletDiff);
	clearInterval(varForStop);
	timer.innerHTML = "";
	timer.classList.remove("timer");
	buttonNewGame.style.display = "none";
	description.style.display = "block";
	this.difficulty = undefined;
	this.skirt = undefined;
	document.getElementById('startButton').disabled = true;
	document.getElementById("congratulationsCard").style.display="none";
	this.lastToWin = 0;
	document.getElementById("congratulationsCard").style.opacity = "0";
	document.getElementById("skin"+this.prevShadowSkin).classList.remove("shadowForSkin");
	document.getElementById("diff"+this.prevShadowDiff).classList.remove("shadowForDiff");
	this.prevShadowSkin = undefined;
	this.prevShadowDiff = undefined;
	setDefault();
	
}
var prevCardNumber, prevCardId;
var numberOfClicks = 0;
var setDefault = function() {
	prevCardNumber = undefined;
	prevCardId = undefined;
	numberOfClicks = 0;
}



Game.prototype.startGame = function() {
	const lowGameFiledSize = 10;
	const mediumGameFieldSize = 18;
	const hightGameFiledSize = 24;
	var descriptionSection = document.getElementById("description");
	descriptionSection.style.display="none";
	switch (this.difficulty) {
  		case 1:
			this.generatorField(lowGameFiledSize);
    		break;
  		case 2:
    		this.generatorField(mediumGameFieldSize);
    		break;
  		case 3:
    		this.generatorField(hightGameFiledSize);
    		break;
  		default:
    	alert( 'Something going wrong' );
	}
	this.timer();
	document.getElementById('buttonNewGame').style.display = 'block';
	this.lastToWin = 0;
    setDefault();
    numberOfGames++;
}
var game = new Game();
// Something strange  happens here, but it is works  
var endGame = function(n) {    
	if(n != numberOfGames) return;  
	game.newGame();
}
var checkTrueAnswer = function(clickedCardId) {
	if(prevCardId != clickedCardId && numberOfClicks < 2) {
		document.getElementById('flipper'+clickedCardId).style.transform = 'rotateY(180deg)';
	    var flipback = function(n) {
			document.getElementById('flipper'+n).style.transform = 'rotateY(0deg)'; 
		}

		if(prevCardNumber == undefined) {
			prevCardNumber = game.secretImageNumbersArray[clickedCardId-1];	
			prevCardId = clickedCardId;
		} else if(game.secretImageNumbersArray[clickedCardId-1] == prevCardNumber)  {
		  var card1 = document.getElementById("flipper"+prevCardId);
		  var card2 = document.getElementById("flipper"+clickedCardId);
		  setTimeout(flipback, 800, prevCardId);
		  setTimeout(flipback, 800, clickedCardId);
		  function func() {
  			card1.style.visibility = "hidden";
		  	card2.style.visibility = "hidden";
		  	card1.style.transition = "opacity 0.4s, visibility 0s linear 0.4s";
		  	card2.style.transition = "opacity 0.4s, visibility 0s linear 0.4s";
		  	card1.style.opacity = "0";
		  	card2.style.opacity = "0";
		  }
		  setTimeout(func, 1200);
		  setTimeout(setDefault, 1800);
		  game.lastToWin++;
		  function stop() {
		  	clearInterval(varForStop);
		  	game.congratulations();	 	
		}
		  if(game.lastToWin == game.field / 2) { setTimeout(stop, 1900); }
		} else {	setTimeout(flipback, 1200, clickedCardId);
					setTimeout(flipback, 1200, prevCardId);
		 			setTimeout(setDefault, 1800);			
				}
		   numberOfClicks++;	
    } 
}















