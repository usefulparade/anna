
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

var sightWords = [];
var oscillators = [];
var envelopes = [];

var sightWordOne;

// var sightWordList = ['a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for', 'funny', 'go', 'help', 'here', 'in', 'is', 'it', 'jump', 'little', 'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said', 'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'];
var sightWordList;
var TTS;

var level;

function preload(){
    sightWordList = loadTable('sightWords.csv', 'csv');
}

function setup(){
    c = createCanvas(windowWidth, windowHeight);
    cParent = document.getElementById('game');
    c.parent(cParent);
    
    letter = '';
    word = '';

    glide = 0;

    // make envelopes

    for (i=0;i<10;i++){

        envelopes[i] = new p5.Envelope();
        envelopes[i].setADSR(0.01, 0.01, 0.5, 0.2);
        // loopEnv = new p5.Envelope();
        // loopEnv.setADSR(0.01, 0.01, 0.5, 0.2);

        // typeEnv = new p5.Envelope();
        // typeEnv.setADSR(0.01, 0.01, 0.5, 0.2);
    }
    

    // make oscillators

    for (j=0;j<10;j++){

        oscillators[j] = new p5.TriOsc();
        oscillators[j].freq(440);
        oscillators[j].amp(envelopes[j]);
        oscillators[j].start();

        // loopOsc = new p5.TriOsc();
        // loopOsc.freq(440);
        // loopOsc.amp(loopEnv);
        // loopOsc.start();

        // typeOsc = new p5.TriOsc();
        // typeOsc.freq(440);
        // typeOsc.amp(typeEnv);
        // typeOsc.start();
    }

    scales = new Scales();
    currentScale = scales.diatonic;

    // phrase & part 

    wordPhrase = new p5.Phrase('word', phraseStep, pattern);
    
    wordPart = new p5.Part();
    // wordPart.addPhrase(wordPhrase);
    wordPart.setBPM(60);
    wordPart.noLoop();
    wordPart.start();
    console.log(wordPart);

    TTS = new p5.Speech();
    TTS.interrupt = true;
    TTS.setRate(1);

    //load the sight word

    level = 1;

    var randWord = sightWordList.getString(level, int(random(0, sightWordList.getColumnCount()-1)));
    sightWordOne = new SightWord(randWord);
    sightWords.push(sightWordOne);
    speakWord();

    document.getElementById("spellBox").focus();

}


function draw(){
    clear();

    for (i=0;i<sightWords.length;i++){
        sightWords[i].show();
        sightWords[i].layer = i;
        // console.log(sightWords[i].layer)
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

    for (var i in sightWords){
        sightWords[i].pos = new p5.Vector(width/2, height/3);
        sightWords[i].spacing = width/12;
        sightWords[i].halves = sightWords[i].spacing*(sightWords[i].length*0.5);
        for (var j in sightWords[i].letterShapeArray){
            sightWords[i].letterShapeArray[j].size = random(width/8, width/6);
        }
    }
}

function keyTyped(){
    // console.log(key, ' ', keyCode);
    letter = key;
    // letters.push(letter);
    

    if (keyCode >= 65 && keyCode <= 90){
        playNote(0, keyCode, oscillators[0], envelopes[0]);
    }

    
}

function keyPressed(){

    // if ENTER/RETURN

    if (keyCode == 13){

        if (word == sightWords[0].word){
            document.getElementById('spellBox').value = '';
            newWord();
        } else {
            speakWord();
            playOnce();
        }
    }
}

function keyReleased(){
    getWordFromBox();
    // if (word == sightWords[0].word){
    //     setTimeout(newWord, 150);
    // }
}

var SightWord = function(_word){
    this.pos = new p5.Vector(width/2, height/3);
    this.word = _word;
    // TTS.speak(this.word);
    this.letterArray = this.word.split('');
    this.wordLength = this.letterArray.length;
    this.count = 0;
    this.letterShapeArray = [];

    for (i=0;i<this.letterArray.length;i++){
        this.letterShapeArray[i] = new LetterShape(this.letterArray[i]);
    }

    this.length = this.letterArray.length;
    wordPart.length = this.length;
    this.spacing = width/12;
    this.halves = this.spacing*(this.length*0.5);

    this.layer = 0;

    this.env = new p5.Envelope();
    this.env.setADSR(0.01, 0.01, 0.5, 0.1);

    this.osc = new p5.SinOsc();
    this.osc.amp(this.env);
    this.osc.freq(440);
    this.osc.start();

    this.show = function(){

        for (var i in this.letterShapeArray){

            if (this.letterShapeArray[i].letter == letters[i]){
                this.letterShapeArray[i].saturation = 200;
                this.letterShapeArray[i].brightness = 200;
                this.letterShapeArray[i].correct = true;
            } else {
                this.letterShapeArray[i].saturation = 0;
                this.letterShapeArray[i].brightness = 0;
                this.letterShapeArray[i].correct = false;
            }
        }

        push();
        translate(this.pos);
        for(j=0;j<this.letterShapeArray.length;j++){
            this.letterShapeArray[j].pos = new p5.Vector(map(j, 0, this.letterShapeArray.length-1, -(this.halves), (this.halves)), 
                                                        map(this.letterShapeArray[j].index, 0, 25, height/4, -height/4));
            if (j>0){
            push();
                stroke(0);
                strokeWeight(width/120);
                line(this.letterShapeArray[j-1].pos.x, this.letterShapeArray[j-1].pos.y, this.letterShapeArray[j].pos.x, this.letterShapeArray[j].pos.y);
            pop();
            }

            this.letterShapeArray[j].show();
        }

        pop();
    };

    this.step = function(_time, _patternVariable){
        
        this.obj.letterShapeArray[this.obj.count].flash();
        playNote(_time, _patternVariable, this.obj.osc, this.obj.env);
        this.obj.count = (this.obj.count+1)%this.obj.wordLength;

    };

    this.pattern = makePatternFromWord(this.word);
    this.phrase = new p5.Phrase('phrase' + this.word, this.step, this.pattern);
    this.phrase.obj = this;
    wordPart.addPhrase(this.phrase);

};

var LetterShape = function(_letter){
    this.pos = new p5.Vector(0,0);
    this.size = random(width/8, width/6);
    this.rot = random(-(PI/12), PI/12);
    this.letter = _letter;
    this.shape = getShape(this.letter);
    this.index = getKeyCodes(this.letter);
    this.hue = map(this.index, 0, 25, 0, 255);
    this.saturation = 0;
    this.brightness = 0;
    this.correct = false;
    this.flashing = 0;

    this.show = function(){
        push();
            translate(this.pos);
            rotate(this.rot);
            colorMode(HSB);
            noStroke();
            fill(this.hue, this.saturation, this.brightness);
            scale(1+this.flashing);
            // main shape
            if (this.shape == 0){
                ellipse(0, 0, this.size);
            } else {
                beginShape();
                
                    vertex(0, -this.size/2);
                    vertex(this.size/2, this.size/3);
                    vertex(-this.size/2, this.size/3);
                endShape(CLOSE);
            }
            //flash effect

            textSize(width/12);
            textAlign(CENTER, CENTER);
            fill(255);
            if (this.correct){
                text(this.letter, 0, 0);
            }
        pop();

        if (this.flashing > 0){
            this.brightness = 255;
            this.flashing -= 0.01;
        } else {
            this.brightness = 0;
            this.flashing = 0;
        }
    };

    this.flash = function(){
        this.flashing = 0.1;
    };
};