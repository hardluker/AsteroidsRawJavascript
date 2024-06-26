import { distBetweenPoints } from './asteroid-game.js'; // Importing this utility function for calculating asteroid distance from ship.
import { level } from './asteroid-game.js';

// This class is for managing all of the asteroids in the game in real time.
class AsteroidBelt {
  constructor(
    canv,
    context,
    fps,
    numAsteroids,
    asteroidSize,
    asteroidSizeMin,
    asteroidSpeed,
    asteroidVert,
    asteroidJaggedness,
    asteroidLineWidth,
    numOfSplits,
    ship
  ) {
    this.canv = canv;
    this.context = context;
    this.fps = fps;
    this.numAsteroids = numAsteroids;
    this.asteroidSize = asteroidSize;
    this.asteroidSizeMin = asteroidSizeMin;
    this.asteroidSpeed = asteroidSpeed;
    this.asteroidVert = asteroidVert;
    this.asteroidJaggedness = asteroidJaggedness;
    this.asteroidLineWidth = asteroidLineWidth;
    this.numOfSplits = numOfSplits;
    this.asteroids = [];
    this.createAsteroids(ship); // Passing the ship through to ensure new asteroids are not near the ship.
  }

  // This function creates the asteroids and ensures they are not spawned closer than (ship radius + asteroid radius * 2)
  createAsteroids(ship) {
    for (let i = 0; i < this.numAsteroids + level; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * this.canv.width);
        y = Math.floor(Math.random() * this.canv.height);
      } while (
        distBetweenPoints(ship.x, ship.y, x, y) <
        this.asteroidSize * 2 + ship.r
      );
      this.asteroids.push(
        this.newAsteroid(x, y, Math.ceil(this.asteroidSize / 2))
      );
    }
  }

  // This function creates an asteroid object.
  // The direction, speed, and jaggedness are random bound by the global variables.
  newAsteroid(x, y, r) {
    let levelMult = 1 + 0.1 * level; //For scaling the speed based on what the level is
    let asteroid = {
      x: x,
      y: y,
      xvelocity:
        ((Math.random() * this.asteroidSpeed * levelMult) / this.fps) *
        (Math.random() < 0.5 ? 1 : -1),
      yvelocity:
        ((Math.random() * this.asteroidSpeed * levelMult) / this.fps) *
        (Math.random() < 0.5 ? 1 : -1),
      r: r,
      a: Math.random() * Math.PI * 2,
      vertices: Math.floor(
        Math.random() * (this.asteroidVert + 1) + this.asteroidVert / 2
      ),
      offset: []
    };

    // This for loop is apply offseted jaggedness to reference when the polygon is drawn
    for (let i = 0; i < asteroid.vertices; i++) {
      asteroid.offset.push(
        Math.random() * this.asteroidJaggedness * 2 +
          1 -
          this.asteroidJaggedness
      );
    }

    return asteroid;
  }

  destroyAsteroid(index) {
    //Grabbing asteroid properties
    let x = this.asteroids[index].x;
    let y = this.asteroids[index].y;
    let r = this.asteroids[index].r;

    // Adding smaller asteriods if the asteroid is big enough
    if (r > this.asteroidSizeMin / 2) {
      for (let i = 0; i < this.numOfSplits; i++)
        this.asteroids.push(this.newAsteroid(x, y, r / 2));
    }
    this.asteroids.splice(index, 1);
  }

  // This is the function for continually updating asteroid logic.
  // No drawing should be contained in this function.
  update() {
    for (let i = 0; i < this.asteroids.length; i++) {
      // Continually applying velocity to the asteroids
      this.asteroids[i].x += this.asteroids[i].xvelocity;
      this.asteroids[i].y += this.asteroids[i].yvelocity;

      // Handle edge of screen positioning.
      // They will pop up on the opposite side of the screen
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

  // This function is for all real-time drawing of the asteroids.
  // No update logic should be contained in this function.
  draw(SHOW_BOUNDING) {
    // Shortcut variables
    let x, y, r, a, vert, offs;

    // Looping through the asteroids and drawing them
    for (let i = 0; i < this.asteroids.length; i++) {
      this.context.strokeStyle = 'slategrey';
      this.context.lineWidth = this.asteroidLineWidth;

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

      // Draw bounding circle if enabled
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
