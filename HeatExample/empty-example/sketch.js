var sinks = [];
var sources = [];
var grid = [];

var WIDTH;
var HEIGHT;
var sourceLocation;

var air_index = 0.000000597125;
var mineralWater_index = 0.00000329613;
var lead_index = 0.00084314;
var water_index = 0.00014331;
var gold_index = 0.00759543;
var graphene_index = 0.1381;

var index = air_index;
var k, u;

var kSlider;
var uSlider;

var clicks = 0;

var resetButton;
var pressed = false;

function setup() {
    createCanvas(windowWidth, windowHeight-100);

    frameRate(1);

    kSlider = createSlider(1, 10, 5);
    uSlider = createSlider(1, 200, 100);

    u = 100;
    k = 0.5;

    createButton('Start').mousePressed(() => { pressed = !pressed; });

    createButton('Air').mousePressed(() => { index = air_index; });
    createButton('Mineral Water').mousePressed(() => { index = mineralWater_index; });
    createButton('Water').mousePressed(() => { index = water_index; });
    createButton('Lead').mousePressed(() => { index = lead_index; });
    createButton('Gold').mousePressed(() => { index = gold_index; });
    createButton('Graphene').mousePressed(() => { index = graphene_index; });

    resetButton = createButton('Reset');
    resetButton.mousePressed(() => { reset(); })

    // Create Sinks and Sources
    // Get width of map and height of map
    WIDTH = createVector(0, int(windowWidth/150));
    HEIGHT = createVector(0, int(windowHeight/150));

    console.log(WIDTH.y + "x" + HEIGHT.y + " area");
    console.log(WIDTH.x + " " + HEIGHT.x);

    sourceLocation = createVector(int(random(0, WIDTH.y)), int(random(0, HEIGHT.y)));

    // We plus one caues 0 indexed
    console.log("Source at (" + (sourceLocation.x+1) + ", " + (sourceLocation.y+1) + ")");

    for (var x = 0; x < WIDTH.y; x++) {
        grid.push([]);
        for (var y = 0; y < HEIGHT.y; y++) {
            if (sourceLocation.x == x && sourceLocation.y == y) {
                sources.push(new Source(createVector((sourceLocation.x + WIDTH.x) * 100, (sourceLocation.y + HEIGHT.x) * 100)));
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

function keyPressed() {
    if (keyCode == 32) {
        cycle(undefined, undefined, 1/frameRate());
        clicks++;
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

    source = sourceOfHeat || sourceLocation;

    while (energy > 0.1) {
        if (distanceOutwards != 0) {
            // Can be more optimal but will work for now :D
            for (x = -distanceOutwards; x <= distanceOutwards; x++) {
                for (y = -distanceOutwards; y <= distanceOutwards; y++) {
                    if (x == -distanceOutwards || x == distanceOutwards || y == -distanceOutwards || y == distanceOutwards) {
                        if (source.x + x >= 0 && source.x + x < WIDTH.y && source.y + y >= 0 && source.y + y < HEIGHT.y) {
                            grid[source.x + x][source.y + y].cycle(energy * deltaTime);
                        }
                    }
                }
            }
        }

        if (distanceOutwards/2 + source.x > WIDTH.y && source.x - distanceOutwards/2 <= 0 || distanceOutwards/2 + source.y > HEIGHT.y && source.y - distanceOutwards/2 <= 0) {
            break;
        }

        distanceOutwards++;
        energy -= (index * pow(energy, 2)) / k + 1;
    }
}

function draw() {
    background(255);

    if (u != uSlider.value()) {
        u = uSlider.value();

        for (var i = 0; i < sources.length; i++) {
            sources[i].temperature = u;
        }
    }

    k = kSlider.value()/10;

    textSize(16);
    fill('green');
    text("U: " + uSlider.value(), uSlider.position().x + uSlider.size().width/2.5, uSlider.position().y - 10);
    text("K: " + kSlider.value()/10, kSlider.position().x + kSlider.size().width/2.5, kSlider.position().y - 10);
    text("Cycles : " + clicks, (kSlider.position().x + uSlider.position().x + kSlider.size().width/1.25)/2, kSlider.position().y - 25);

    if (pressed) {
        cycle(undefined, undefined, 1/frameRate());
        clicks++;
    }

    for (var i = 0; i < sinks.length; i++) {
        sinks[i].draw();
    }

    for (var i = 0; i < sources.length; i++) {
        sources[i].draw();
    }
}
