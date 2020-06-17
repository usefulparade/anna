
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

var sightWordOne;

var TTS;

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

    // phrase & part 

    wordPhrase = new p5.Phrase('word', phraseStep, pattern);
    
    wordPart = new p5.Part();
    wordPart.addPhrase(wordPhrase);
    wordPart.setBPM(60);
    wordPart.noLoop();
    // wordPart.start();
    console.log(wordPart);

    TTS = new p5.Speech();
    TTS.interrupt = true;
    TTS.setRate(3);

    sightWordOne = new SightWord("supernova");

}


function draw(){
    clear();

    sightWordOne.show();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
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

var SightWord = function(_word){
    this.pos = new p5.Vector(width/2, height/3);
    this.word = _word;
    this.letterArray = this.word.split('');
    this.letterShapeArray = [];

    for (i=0;i<this.letterArray.length;i++){
        this.letterShapeArray[i] = new LetterShape(this.letterArray[i]);
    }

    this.length = this.letterArray.length;
    this.spacing = width/12;
    this.halves = this.spacing*(this.length*0.5);

    this.pattern = makePatternFromWord(this.word);
    this.phrase = new p5.Phrase('phrase' + this.word, sightWordStep, this.pattern);
    wordPart.addPhrase(this.phrase);

    this.show = function(){
        push();
        translate(this.pos);
        for(j=0;j<this.letterShapeArray.length;j++){
            this.letterShapeArray[j].pos = new p5.Vector(map(j, 0, this.letterShapeArray.length-1, -(this.halves), (this.halves)), 
                                                        map(this.letterShapeArray[j].index, 0, 25, height/4, -height/4));
            if (j>0){
            push();
                stroke(0);
                strokeWeight(10);
                line(this.letterShapeArray[j-1].pos.x, this.letterShapeArray[j-1].pos.y, this.letterShapeArray[j].pos.x, this.letterShapeArray[j].pos.y);
            pop();
            }

            this.letterShapeArray[j].show();
        }

        pop();
    };

    this.play = function(){

    };

};

var LetterShape = function(_letter){
    this.pos = new p5.Vector(0,0);
    this.size = random(width/8, width/6);
    this.rot = random(-(PI/12), PI/12);
    this.letter = _letter;
    this.shape = getShape(this.letter);
    this.index = getKeyCodes(this.letter);
    this.hue = map(this.index, 0, 25, 0, 255);

    this.show = function(){
        push();
            translate(this.pos);
            rotate(this.rot);
            colorMode(HSB);
            noStroke();
            fill(this.hue, 200, 200);
            if (this.shape == 0){
                ellipse(0, 0, this.size);
            } else {
                beginShape();
                    vertex(0, -this.size/2);
                    vertex(this.size/2, this.size/3);
                    vertex(-this.size/2, this.size/3);
                endShape(CLOSE);
            }
            textSize(48);
            textAlign(CENTER, CENTER);
            fill(255);
            // text(this.letter, 0, 0);
        pop();
    };
};