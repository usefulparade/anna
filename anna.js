var canvWidth, canvHeight;
var c, cParent;
var letter;
var letters = [];
var pattern = [];
var word;
var osc, env, freq;
var scales, currentScale;
var glide;
var wordPhrase, wordPart;

var messages = [];

var chatParent;


function setup(){
    c = createCanvas(windowWidth, windowHeight);
    cParent = document.getElementById('game');
    c.parent(cParent);
    
    letter = '';
    word = '';

    glide = 0;

    // make envelopes
    loopEnv = new p5.Envelope();
    loopEnv.setADSR(0.01, 0.01, 0.5, 0.2);

    typeEnv = new p5.Envelope();
    typeEnv.setADSR(0.01, 0.01, 0.5, 0.2);

    // make oscillators
    loopOsc = new p5.TriOsc();
    loopOsc.freq(440);
    loopOsc.amp(loopEnv);
    loopOsc.start();

    typeOsc = new p5.TriOsc();
    typeOsc.freq(440);
    typeOsc.amp(typeEnv);
    typeOsc.start();

    scales = new Scales();
    currentScale = scales.diatonic;

    chatParent = select('#chatText');

    var firstMessage = new Message('hi anna!');
    var secondMessage = new Message('how are you feeling today?');
    messages.push(firstMessage);
    messages.push(secondMessage);

    // phrase & part 

    wordPhrase = new p5.Phrase('word', phraseStep, pattern);
    
    wordPart = new p5.Part();
    wordPart.addPhrase(wordPhrase);
    wordPart.setBPM(60);
    wordPart.noLoop();
    // wordPart.start();
    console.log(wordPart);
}

function draw(){
    clear();
    fill(255);
    // ellipse(width/2, height/2, 200);
    textSize(42);
    textAlign(CENTER);
    // text(letter, width/2, height/2);

    for (i=0;i<messages.length;i++){
        if (i==0){
            if (!messages[i].finished){
                messages[i].typeMsg();
            }
        } else {
            if (messages[i-1].finished && !messages[i].finished){
                messages[i].typeMsg();
            }
        }
    }

}

function keyTyped(){
    // console.log(key, ' ', keyCode);
    letter = key;
    // letters.push(letter);

    if (keyCode >= 65 && keyCode <= 90){
        playNote(0, keyCode, 2);
    }
}

function keyPressed(){
    if (keyCode == 13){
        wordPart.start();
    }
}

function keyReleased(){
    getWordFromBox();
}

function sendChat(){
    var newChat = createP();
    var msg = document.getElementById('spellBox').value;
    document.getElementById('spellBox').value = '';
    newChat.addClass('r');
    newChat.parent(chatParent);
    newChat.html(msg);

    var chatText = document.getElementById("chatText");
    chatText.scrollTop = chatText.scrollHeight;
}
