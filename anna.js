var canvWidth, canvHeight;
var c, cParent;


function setup(){
    c = createCanvas(windowWidth, windowHeight);
    cParent = document.getElementById('game');
    c.parent(cParent);
}

function draw(){
    background(0);
    fill(255);
    ellipse(width/2, height/2, 200);

}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}