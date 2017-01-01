remove();

var sinks = [];
var sources = [];
var grid = [];

var WIDTH;
var HEIGHT;
var sourceLocation;

var air_index = 0.000000597125 / 100;
var mineralWater_index = 0.00000329613 / 100;
var lead_index = 0.00084314 / 100;
var water_index = 0.00014331 / 100;
var gold_index = 0.00759543 / 100;
var graphene_index = 0.1381 / 100;

var index = air_index;
var k, u;

var mode3D = false;
var init = false;

var textElement;

var kSlider;
var uSlider;

var timer = 0;

var clicks = 0;

var resetButton;
var modeButton;
var pressed = false;

var start;
var canvas;
var elementCanvas;

function setupMode() {
    if (mode3D) {
        canvas = createCanvas(windowWidth, windowHeight-100, WEBGL);
        perspective(60 / 180 * PI, width/height, 0.1, 100);
    }
    else {
        canvas = createCanvas(windowWidth, windowHeight-100, P2D);
    }
}

function setup() {
    frameRate(30);

    kSlider = createSlider(1, 10, 2);
    uSlider = createSlider(1, 200, 100);

    textElement = createDiv("U: \t K: \t Cycles: ");
    textElement.position(0, 20);

    createDiv("Information: Press start to run simulation (updates every half second),<br>" +
              "The air, mineral water... buttons indicate what index to run (it presumes every square was made out of that material),<br>" +
              "The reset will reset the simulation,<br>" +
              "3D toggles 3D and 2D simulation,<br>" +
              "3D Controls: Press shift to pan, and Control to rotate the camera."
        ).position(0, windowHeight-100);

    u = 100;
    k = 0.5;

    start = createButton('Start');

    start.mousePressed(() => {
        pressed = !pressed;

        if (pressed) {
            start.html("Stop");
        }
        else {
            start.html("Start");
        }
    });

    createButton('Air').mousePressed(() => { index = air_index; });
    createButton('Mineral Water').mousePressed(() => { index = mineralWater_index; });
    createButton('Water').mousePressed(() => { index = water_index; });
    createButton('Lead').mousePressed(() => { index = lead_index; });
    createButton('Gold').mousePressed(() => { index = gold_index; });
    createButton('Graphene').mousePressed(() => { index = graphene_index; });

    resetButton = createButton('Reset');
    resetButton.mousePressed(() => { reset(); })

    modeButton = createButton('3D');
    modeButton.mousePressed(() => {
        mode3D = !mode3D;

        if (mode3D) {
            modeButton.html("2D");
        }
        else {
            modeButton.html("3D");

        }
        canvas.remove();
        canvas = null;

        remove();

        new p5();
    });

    if (init == false) {
        // Create Sinks and Sources
        // Get width of map and height of map
        WIDTH = createVector(0, int(windowWidth/125));
        HEIGHT = createVector(0.2, int(windowHeight/125));

        console.log(WIDTH.y + "x" + HEIGHT.y + " area");
        console.log(WIDTH.x + " " + HEIGHT.x);

        sourceLocation = createVector(int(random(0, WIDTH.y)), int(random(0, HEIGHT.y)));

        // We plus one caues 0 indexed
        console.log("Source at (" + (sourceLocation.x+1) + ", " + (sourceLocation.y+1) + ")");

        for (var x = 0; x < WIDTH.y; x++) {
            grid.push([]);
            for (var y = 0; y < HEIGHT.y; y++) {
                if (sourceLocation.x == x && sourceLocation.y == y) {
                    sources.push(new Source(createVector((sourceLocation.x + WIDTH.x) * 100, (sourceLocation.y + HEIGHT.x) * 100), sourceLocation));
                    grid[x][y] = new Sink();
                    sources[sources.length-1].temperature = u;
                    // console.log(sources[sources.length-1].pos);
                }
                else {
                    sinks.push(new Sink(createVector((x + WIDTH.x)*100, (y + HEIGHT.x)*100)));
                    grid[x][y] = sinks[sinks.length-1];
                    // console.log(sinks[sinks.length-1].pos);
                }
            }
        }
    }

    init = true;

    setupMode();
}

function cycleSources() {
    clicks++;

    for (var i = 0; i < sources.length; i++) {
        cycle(sources[i].sourcePos, sources[i].temperature, 0.5);
    }
}

function keyPressed() {
    if (keyCode == 32) {
        cycleSources();
    }
}

function reset() {
    for (var i = 0; i < sinks.length; i++) {
        sinks[i].reset();
    }

    clicks = 0;
}

function cycle(sourceOfHeat, startingEnergy, deltaTime) {
    console.log("Cycling by one second/iteration");
    var energy = startingEnergy || u;
    var distanceOutwards = 0.0;
    var effect = 1;

    source = sourceOfHeat || sourceLocation;

    while (energy > 0.1) {
        if (distanceOutwards != 0) {
            for (var x = -distanceOutwards; x <= distanceOutwards; x++) {
                if (abs(x) == distanceOutwards) {
                    for (var y = -distanceOutwards; y <= distanceOutwards; y++) {
                        if (source.x + x >= 0 && source.x + x < WIDTH.y && source.y + y >= 0 && source.y + y < HEIGHT.y) {
                            grid[source.x + x][source.y + y].cycle((energy * deltaTime) * effect);
                        }
                    }
                }
                else {
                    if (source.x + x >= 0 && source.x + x < WIDTH.y && source.y + distanceOutwards >= 0 && source.y + distanceOutwards < HEIGHT.y) {
                        grid[source.x + x][source.y + distanceOutwards].cycle((energy * deltaTime) * effect);
                    }

                    if (source.x + x >= 0 && source.x + x < WIDTH.y && source.y - distanceOutwards >= 0 && source.y - distanceOutwards < HEIGHT.y) {
                        grid[source.x + x][source.y - distanceOutwards].cycle((energy * deltaTime) * effect);
                    }
                }
            }
        }

        if (distanceOutwards/2 + source.x > WIDTH.y && source.x - distanceOutwards/2 <= 0 || distanceOutwards/2 + source.y > HEIGHT.y && source.y - distanceOutwards/2 <= 0) {
            break;
        }

        distanceOutwards++;
        var amountToTake = (startingEnergy || u) / (Math.E * abs(log(index)) * k);
        energy -= amountToTake;
    }
}

function draw() {
    background(255);
    timer -= 2;
    // orbitControl();

    if (mode3D) {
        if (keyIsDown(SHIFT)) {
            camera(mouseX, mouseY, (height/2) / tan(PI/6));
        }
        else if (keyIsDown(CONTROL)) {
            scale(0.5);
            rotateY(radians(mouseX/2));
            rotateX(radians(mouseY/2));
        }

        translate(-width/3, -height/4, 0);
        rotateX(HALF_PI);
    }

    if (u != uSlider.value()) {
        u = uSlider.value();

        for (var i = 0; i < sources.length; i++) {
            sources[i].temperature = u;
        }
    }

    k = kSlider.value()/10;

    textElement.html(". . . . k: " + kSlider.value()/10 + ". . . . Cycles: " + clicks + ". . . . U: " + uSlider.value(), true);

    if (timer <= 0) {
        timer = 30;
        if (pressed) {
            cycleSources();
        }
    }

    for (var i = 0; i < sinks.length; i++) {
        if (mode3D) {
            push();
            translate(sinks[i].pos.x, sinks[i].pos.y, 0);
            sinks[i].draw(true);
            pop();
        }
        else {
            sinks[i].draw(false);
        }
    }

    for (var i = 0; i < sources.length; i++) {
        if (mode3D) {
            push();
            translate(sources[i].pos.x, sources[i].pos.y, 0);
            sources[i].draw(true);
            pop();
        }
        else {
            sources[i].draw(false);
        }
    }
}
