import Ship from './ship.js';
import AsteroidBelt from './asteroid-belt.js'; // Import the AsteroidBelt class

// Game Settings
const FPS = 60; // Frames per Second

// Ship Related Settings
const SHIP_SIZE = 30; // Ship height in pixels.
const SHIP_THRUST = 8; // Acceleration of ship in pixels per second every second.
const FRICTION = 0.7; // Friction coefficient of space (0 = no friction, 1 = ton of friction).
const TURN_SPEED = 360; // Turn speed in degrees per second.
const SHIP_EXPLODE_DURATION = 0.3; // Duration of ship explosion in seconds.
const LASERS_MAX = 3; //Maximum number of lasers on the screen at once.
const LASERS_SPEED = 500; // Speed of the lasers in pixels per second.
const LASERS_DIST = 0.5; // Maximum distance the laser can travel as a percentage of the width of the screen.
const LASER_EXPLODE_DURATION = 0.1; // For how long in seconds the laser explosion will last.

// Development Tools
const SHOW_CENTER_DOT = false; //Development tool for visualizing ship center and trajectory.
const SHOW_BOUNDING = false; // Development tool to visualize collision bounding.

// Asteroid Related Settings
const ASTEROIDS_NUM = 3; //Number of asteroids at the starting level.
const ASTEROIDS_SIZE = 100; // Starting size of asteroids in pixels.
const ASTEROIDS_SIZE_MIN = 25; // The minimum size an asteroid can be.
const ASTEROIDS_SPEED = 100; // Max starting speed in pixels per second.
const ASTEROIDS_VERT = 10; // Average number of vertices of the asteroids.
const ASTEROIDS_JAGGEDNESS = 0.4; //Jaggeness of asteroids. ( 0 = none, 1 = ton of).
const ASTEROID_LINE_WIDTH = 1.5; // Width of the lines drawn for the asteroids.
const NUM_OF_SPLITS = 2; // The number of asteroids an asteroid splits into when destroyed

//Defining the canvas and context for drawing the game.
/** @type {HTMLCanvasElement} */
let canv = document.getElementById('gameCanvas');
let context = canv.getContext('2d');

// Set up the Game loop
setInterval(gameLoop, 1000 / FPS);

//Creating a ship
let ship = new Ship(
  canv,
  context,
  SHIP_SIZE,
  SHIP_THRUST,
  FRICTION,
  TURN_SPEED,
  FPS,
  SHIP_EXPLODE_DURATION,
  LASERS_MAX,
  LASERS_SPEED,
  LASERS_DIST,
  LASER_EXPLODE_DURATION
);

// Create an instance of AsteroidBelt after the ship object is fully initialized
let asteroidBelt = new AsteroidBelt(
  canv,
  context,
  FPS,
  ASTEROIDS_NUM,
  ASTEROIDS_SIZE,
  ASTEROIDS_SIZE_MIN,
  ASTEROIDS_SPEED,
  ASTEROIDS_VERT,
  ASTEROIDS_JAGGEDNESS,
  ASTEROID_LINE_WIDTH,
  NUM_OF_SPLITS,
  ship
);

function gameLoop() {
  // Draw Outer Space Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, canv.width, canv.height);

  // Updating ship positional and logical data.
  ship.update();

  // Update Asteroid belt positional and logical data.
  asteroidBelt.update();

  // Perform collision detection if the ship has not been exploded
  if (!ship.exploding) {
    detectCollisions();
  }

  //Drawing the ship
  ship.draw(SHOW_CENTER_DOT, SHOW_BOUNDING);

  //Drawing the asteroid belt
  asteroidBelt.draw(SHOW_BOUNDING);
}

// Function for detecting collisions with asteroids
function detectCollisions() {
  let ax, ay, ar, lx, ly;
  for (let i = asteroidBelt.asteroids.length - 1; i >= 0; i--) {
    // Grabbing the asteroid properties
    ax = asteroidBelt.asteroids[i].x;
    ay = asteroidBelt.asteroids[i].y;
    ar = asteroidBelt.asteroids[i].r;
    // Looping over lasers checking for asteroid collisions
    for (let j = ship.lasers.length - 1; j >= 0; j--) {
      //Grabbing the laser properties
      lx = ship.lasers[j].x;
      ly = ship.lasers[j].y;

      // If the laser collides, remove the laser
      if (distBetweenPoints(ax, ay, lx, ly) < ar) {
        // remove the laser
        ship.lasers.splice(j, 1);

        // remove the asteroid
        asteroidBelt.destroyAsteroid(i);
        //asteroidBelt.asteroids.splice(i, 1);
        break;
      }
    }

    // If the asteroids collide with a ship the ship explodes
    if (distBetweenPoints(ship.x, ship.y, ax, ay) < ship.r + ar) {
      ship.explode();
    }
  }
}

// Utility function for checking the distance between 2 objects
export function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
