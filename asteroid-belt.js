import { distBetweenPoints } from './asteroid-game.js'; // Importing this utility function for calculating asteroid distance from ship.

class AsteroidBelt {
  constructor(
    canv,
    context,
    fps,
    numAsteroids,
    asteroidSize,
    asteroidSpeed,
    asteroidVert,
    asteroidJaggedness,
    ship
  ) {
    this.canv = canv;
    this.context = context;
    this.fps = fps;
    this.numAsteroids = numAsteroids;
    this.asteroidSize = asteroidSize;
    this.asteroidSpeed = asteroidSpeed;
    this.asteroidVert = asteroidVert;
    this.asteroidJaggedness = asteroidJaggedness;
    this.asteroids = [];
    this.createAsteroids(ship);
  }

  createAsteroids(ship) {
    for (let i = 0; i < this.numAsteroids; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * this.canv.width);
        y = Math.floor(Math.random() * this.canv.height);
      } while (
        distBetweenPoints(ship.x, ship.y, x, y) <
        this.asteroidSize * 2 + ship.r
      );
      this.asteroids.push(this.newAsteroid(x, y));
    }
  }

  newAsteroid(x, y) {
    let asteroid = {
      x: x,
      y: y,
      xvelocity:
        ((Math.random() * this.asteroidSpeed) / this.fps) *
        (Math.random() < 0.5 ? 1 : -1),
      yvelocity:
        ((Math.random() * this.asteroidSpeed) / this.fps) *
        (Math.random() < 0.5 ? 1 : -1),
      r: this.asteroidSize / 2,
      a: Math.random() * Math.PI * 2,
      vertices: Math.floor(
        Math.random() * (this.asteroidVert + 1) + this.asteroidVert / 2
      ),
      offset: []
    };

    for (let i = 0; i < asteroid.vertices; i++) {
      asteroid.offset.push(
        Math.random() * this.asteroidJaggedness * 2 +
          1 -
          this.asteroidJaggedness
      );
    }

    return asteroid;
  }

  update() {
    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].x += this.asteroids[i].xvelocity;
      this.asteroids[i].y += this.asteroids[i].yvelocity;

      // Handle edge of screen
      if (this.asteroids[i].x < 0 - this.asteroids[i].r) {
        this.asteroids[i].x = this.canv.width + this.asteroids[i].r;
      } else if (this.asteroids[i].x > this.canv.width + this.asteroids[i].r) {
        this.asteroids[i].x = 0 - this.asteroids[i].r;
      }
      if (this.asteroids[i].y < 0 - this.asteroids[i].r) {
        this.asteroids[i].y = this.canv.height + this.asteroids[i].r;
      } else if (this.asteroids[i].y > this.canv.height + this.asteroids[i].r) {
        this.asteroids[i].y = 0 - this.asteroids[i].r;
      }
    }
  }

  draw(SHOW_BOUNDING) {
    let x, y, r, a, vert, offs;
    for (let i = 0; i < this.asteroids.length; i++) {
      this.context.strokeStyle = 'slategrey';
      this.context.lineWidth = 1.5;

      x = this.asteroids[i].x;
      y = this.asteroids[i].y;
      r = this.asteroids[i].r;
      a = this.asteroids[i].a;
      vert = this.asteroids[i].vertices;
      offs = this.asteroids[i].offset;

      this.context.beginPath();
      this.context.moveTo(
        x + r * offs[0] * Math.cos(a),
        y + r * offs[0] * Math.sin(a)
      );

      for (let j = 0; j < vert; j++) {
        this.context.lineTo(
          x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
          y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
        );
      }
      this.context.closePath();
      this.context.stroke();

      // Draw bounding circle
      if (SHOW_BOUNDING) {
        this.context.strokeStyle = 'lime';
        this.context.beginPath();
        this.context.arc(x, y, r, 0, Math.PI * 2, false);
        this.context.stroke();
      }
    }
  }
}

export default AsteroidBelt;
