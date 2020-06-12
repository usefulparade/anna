var letterArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var Scales = function(){
    this.base = [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
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