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

    wordPhrase = new p5.Phrase('word', playNote, pattern);
    
    wordPart = new p5.Part();
    wordPart.addPhrase(wordPhrase);
    wordPart.setBPM(60);
    // wordPart.noLoop();
}

function draw(){
    background(0);
    fill(255);
    // ellipse(width/2, height/2, 200);
    textSize(42);
    textAlign(CENTER);
    text(letter, width/2, height/2);

}

function keyTyped(){
    console.log(key, ' ', keyCode);
    letter = key;
    // letters.push(letter);
    
    makeWord();

    if (keyCode >= 65 && keyCode <= 90){
        playNote(0, keyCode, 2);
    }
}

function keyPressed(){
    if (keyCode == 13){
        // wordPart.start();
    }
}

function keyReleased(){
    makeWord();
}

function makeWord(){
    word = document.getElementById('spellBox').value;
    letters = word.split('');

    for (i=0;i<letters.length;i++){
        if (getKeyCodes(letters[i]) == -1){
            pattern[i] = 0;
        } else {
            pattern[i] = getKeyCodes(letters[i])+65;
        }
        
    }
    
    while (pattern.length > letters.length){
        pattern.pop();
    }

    if (pattern.length == 0){
        wordPart.stop();
    } else {
        wordPart.start();
    }

    console.log(pattern);

}

function phraseStep(time, patternVariable){
    playNote(time, patternVariable, 1);
}

function playNote(time, note, oscSelect){
    userStartAudio();
    var thisScale = currentScale;
    
    var keyCodeNormal = note-65;
    letter = letterArray[keyCodeNormal];
    var j = 0;
    for (i=0;i<keyCodeNormal;i++){
        j+= thisScale[i%thisScale.length];
    }
    var newNote = scales.base[j];

    loopOsc.freq(midiToFreq(newNote), glide, time);
    loopEnv.play(loopOsc, time);

    if (oscSelect == 1){
        loopOsc.freq(midiToFreq(newNote), glide, time);
        loopEnv.play(loopOsc, time);
    } else if (oscSelect == 2) {
        typeOsc.freq(midiToFreq(newNote), glide, time);
        typeEnv.play(typeOsc, time);
    } else {
        loopOsc.freq(midiToFreq(newNote), glide, time);
        loopEnv.play(loopOsc, time);
    }
}

function scaleSelector(x){
    var newScale = x.value;
    if (newScale == 0){
        currentScale = scales.chromatic;
    } else if (newScale == 1){
        currentScale = scales.diatonic;
    } else if (newScale == 2){
        currentScale = scales.pentatonic;
    }
    console.log(currentScale);
}

function bpmSliderChange(slider){
    wordPart.setBPM(slider.value);
}

function getKeyCodes(_letter){
    var thisLetter = _letter;
    return letterArray.indexOf(thisLetter);
}


function startLoop(){
    wordPart.loop();
    wordPart.start();
    
}

function stopLoop(){
    wordPart.noLoop();
    wordPart.stop();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}
