// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 100; //how long to hold each clue's light/sound
var gameStrike = 0; // strikes that the user has per game.

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  pattern.length = 0;
  gameStrike = 3;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  randPattern();
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
  
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay -= clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn) {//checks to see if user selected right button
    if(guessCounter == progress) {
      if(progress == pattern.length - 1) {
        //checks if user completed all steps in the pattern
        winGame();
      }
      else {
        //continues to the next clue
        progress++;
        playClueSequence();
      }
    }
    else { 
      //increments guessCounter if the turn is Not Over.
      guessCounter++;
    }
  }
  else {//if guess is incorrect, reduces a strike and lets user know to repick the most recent button
    if(gameStrike != 0) {
      gameStrike--
      wrongMessage()
      }  
    else {//if they lose all their strikes they lose
      loseGame();
      }
    }
}    

function randomVal() {//creates a random value between 1 and 6
  var min = Math.ceil(1);
  var max = Math.floor(6);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randPattern() {//appends the random value to the pattern array
  for(let i=0;i<=8;i++) {
    var x = randomVal(); //calls random val function 
    pattern.push(x); //adds the random button value to the pattern array
  }
    
}

function wrongMessage() { //lets user know how many guesses they have left
  alert("Oops, try again! You have: " + gameStrike + " guesses left!");
}

// Sound Synthesis Functions
const freqMap = {
  1: 323.5,
  2: 129.3,
  3: 435,
  4: 222.2,
  5: 196.4,
  6: 375.2,
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)