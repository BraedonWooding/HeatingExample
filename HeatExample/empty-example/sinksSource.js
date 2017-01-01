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
            this.temperature = 0;
        }
    }

    draw(is3D) {
        this.timer -= 1;
        fill(this.color);

        if (is3D) {
            box(100, 100, 100);
            this.text = null;
        }
        else {
            rect(this.pos.x, this.pos.y, 100, 100);

            textSize(23);
            textAlign(CENTER);
            fill('white');
            text(int(this.temperature), this.pos.x+5, this.pos.y+25, 100, 100);
        }
    }

    reset() {
        this.temperature = 0;
        this.color = color('blue');
    }

    cycle(temperatureChange) {
        if (this.temperature < 5) {
            this.temperature += u/temperatureChange;
            this.color = color(this.temperature, green(this.color), blue(this.color)-temperatureChange);
        }
        else {
            this.temperature += temperatureChange/(this.temperature);
            this.color = color(this.temperature, green(this.color), blue(this.color)-temperatureChange/(this.temperature));
        }
    }
}

class Source {
    constructor(position, sourcePosition) {
        this.pos = position;
        this.sourcePos = sourcePosition;
        this.color = color('red');
        this.temperature = 100;
    }

    draw(is3D) {
        fill(this.color);
        if (is3D) {
            box(100, 100, 100);
        }
        else {
            rect(this.pos.x, this.pos.y, 100, 100);
            textSize(23);
            textAlign(CENTER);
            fill('white');
            text(int(this.temperature) + "  (Source)", this.pos.x+5, this.pos.y+25, 100, 100);
        }
    }

    cycle(temperatureChange) {
        this.temperature += temperatureChange;
    }
}
