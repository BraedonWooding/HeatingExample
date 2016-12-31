new p5();

class Sink {
    constructor(position) {
        if (position == undefined) {
            this.pos = createVector(100, 100);
            this.color = color('white');
            this.temperature = -100;
        }
        else {
            this.pos = position;
            this.color = color('blue');
            this.temperature = -100;
        }
    }

    draw() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, 100, 100);
        textSize(32);
        textAlign(CENTER);
        fill('white');
        text(int(this.temperature), this.pos.x+5, this.pos.y+25, 100, 100);
    }

    reset() {
        this.temperature = 0;
        this.color = color('blue');
    }

    cycle(temperatureChange) {
        if (this.temperature < 5) {
            this.temperature += temperatureChange;
        }
        else {
            this.temperature += temperatureChange/log(this.temperature);
            console.log(this.temperature);
        }

        this.color = color(this.temperature, blue(this.color)-temperatureChange, green(this.color));
    }
}

class Source {
    constructor(position) {
        this.pos = position;
        this.color = color('red');
        this.temperature = 100;
    }

    draw() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, 100, 100);
        textSize(25);
        textAlign(CENTER);
        fill('white');
        text(int(this.temperature) + "  (Source)", this.pos.x+5, this.pos.y+25, 100, 100);
    }

    cycle(temperatureChange) {
        this.temperature += temperatureChange;
    }
}
