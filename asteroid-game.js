import Ship from './ship.js';
import AsteroidBelt from './asteroidBelt.js'; // Import the AsteroidBelt class

// Game Settings
const FPS = 30; // Frames per Second

const SHIP_SIZE = 30; // Ship height in pixels
const SHIP_THRUST = 8; // Acceleration of ship in pixels per second every second
const FRICTION = 0.7; // Friction coefficient of space (0 = no friction, 1 = ton of friction)
const TURN_SPEED = 360; // Turn speed in degrees per second
const SHIP_EXPLODE_DURATION = 0.3; // Duration of ship explosion in seconds

const SHOW_CENTER_DOT = false; //Development tool for visualizing ship center and trajectory.
const SHOW_BOUNDING = true; // Development tool to visualize collision bounding

const ASTEROIDS_NUM = 3; //Number of asteroids at the starting level.
const ASTEROIDS_SIZE = 100; // Starting size of asteroids in pixels
const ASTEROIDS_SPEED = 50; // Max starting speed in pixels per second.
const ASTEROIDS_VERT = 10; // Average number of vertices of the asteroids.
const ASTEROIDS_JAGGEDNESS = 0.4; //Jaggeness of asteroids. ( 0 = none, 1 = ton of)

/** @type {HTMLCanvasElement} */
let canv = document.getElementById('gameCanvas');
let context = canv.getContext('2d');

//Creating a ship
let ship = new Ship(canv, context);

// Set up the Game loop
setInterval(update, 1000 / FPS);

// Create an instance of AsteroidBelt after the ship object is fully initialized
let asteroidBelt = new AsteroidBelt(
  canv,
  context,
  FPS,
  ASTEROIDS_NUM,
  ASTEROIDS_SIZE,
  ASTEROIDS_SPEED,
  ASTEROIDS_VERT,
  ASTEROIDS_JAGGEDNESS,
  ship // Pass ship object
);

function explodeShip() {
  ship.explodeTime = Math.ceil(SHIP_EXPLODE_DURATION * FPS);
}

export function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function update() {
  ship.exploding = ship.explodeTime > 0;

  // Draw Outer Space Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, canv.width, canv.height);

  // Updating ship positional and logical data.
  ship.update(FPS);

  // Check for asteroid collisions
  for (let i = 0; i < asteroidBelt.asteroids.length; i++) {
    if (
      distBetweenPoints(
        ship.x,
        ship.y,
        asteroidBelt.asteroids[i].x,
        asteroidBelt.asteroids[i].y
      ) <
      ship.r + asteroidBelt.asteroids[i].r
    ) {
      explodeShip();
    }
  }

  //Drawing the ship
  ship.draw(SHOW_CENTER_DOT, SHOW_BOUNDING);

  // Update and draw the asteroid belt
  asteroidBelt.update();
  asteroidBelt.draw(SHOW_BOUNDING);
}
