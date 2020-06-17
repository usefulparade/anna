var letterArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var Scales = function(){
    this.base = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
    this.chromatic = [1];
    // this.diatonic = [2, 2, 1, 2, 2, 2, 1];
    this.diatonic = [2, 1, 2, 2, 1, 2, 2,];
    this.pentatonic = [2, 2, 3, 2, 3];
};

function controlsToggle(){
    var controls = select("#controlsInner");
    var toggle = select("#controlsToggle");
    if (controls.style('max-height') == "0px"){
      toggle.html("- controls");
      controls.style('max-height', '1000px');
    } else {
      toggle.html("+ controls");
      controls.style('max-height', '0px');
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

Message = function(msg){
    this.newString = msg;
    this.newLetters = this.newString.split('');
    // console.log(this.newLetters);
    this.newMessageArray = [];
    this.newMessage = '';
    this.p = createP();
    this.p.addClass('l');
    this.p.parent(chatParent);
    this.msgCounter = 0;
    this.msgTimer = 0;
    this.finished = false;

    this.typeMsg = function(){

        if (this.msgTimer < 60){
            this.msgTimer+=10;
        } 

        if (this.msgTimer >= 60){
            playNote(0, getKeyCodes(this.newLetters[this.msgCounter])+65, 1);
            this.newMessageArray.push(this.newLetters[this.msgCounter]);
            this.newMessage = this.newMessageArray.toString().replace(/,/g, '');
            this.p.html(this.newMessage);
            // console.log(this.newLetters[this.msgCounter]);
            this.msgCounter += 1;
            this.msgTimer = 0;
            
        }

        if (this.msgCounter >= this.newLetters.length){
            this.finished = true;
            console.log('finished typing: ' + this.newString);
        }
    };
};



// WORD STUFF

function getWordFromBox(){

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

    // wordPart.replaceSequence('word', pattern);
    // console.log(wordPhrase);

    if (pattern.length == 0){
        wordPart.stop();
    } else {
        // wordPart.start();
    }
    // console.log('current pattern: ' + pattern);

}

function makePatternFromWord(_word){
    var word = _word;
    var letters = word.split('');
    var pattern = [];

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

    return(pattern);
}

function getShape(a){
    if (a == 'a' || a == 'e' ||  a == 'i' || a == 'o' || a == 'u' || a == 'y'){
        return 0;
    } else {
        return 1;
    }
}



// MUSIC STUFF

function phraseStep(_time, _patternVariable){
    playNote(_time, _patternVariable, 1);
}

function sightWordStep(_time, _patternVariable){
    playNote(_time, _patternVariable, 2);
}

function playNote(time, note, oscSelect){
    userStartAudio();
    var thisScale = currentScale;
    
    var keyCodeNormal = note-65;
    letter = letterArray[keyCodeNormal];
    // TTS.speak(letter);
    var j = 0;

    for (i=0;i<keyCodeNormal;i++){
        j+= thisScale[i%thisScale.length];
    }

    var newNote = scales.base[j];

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

function startLoop(){
    wordPart.loop();
    wordPart.start();
    // console.log('start');
}

function stopLoop(){
    wordPart.noLoop();
    wordPart.stop(); 
}