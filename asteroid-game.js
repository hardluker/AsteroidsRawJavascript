import Ship from './ship.js';
import AsteroidBelt from './asteroid-belt.js'; // Import the AsteroidBelt class

// Game Settings
const FPS = 60; // Frames per Second

// Ship Related Settings
const SHIP_SIZE = 30; // Ship height in pixels.
const SHIP_COLOR = 'white';
const SHIP_THRUST = 4; // Acceleration of ship in pixels per second every second.
const FRICTION = 0.7; // Friction coefficient of space (0 = no friction, 1 = ton of friction).
const TURN_SPEED = 360; // Turn speed in degrees per second.
const SHIP_EXPLODE_DURATION = 1.3; // Duration of ship explosion in seconds.
const LASERS_MAX = 3; //Maximum number of lasers on the screen at once.
const LASERS_SPEED = 400; // Speed of the lasers in pixels per second.
const LASERS_DIST = 0.5; // Maximum distance the laser can travel as a percentage of the width of the screen.
const LASER_EXPLODE_DURATION = 2; // For how long in seconds the laser explosion will last.

// Development Tools
const SHOW_CENTER_DOT = false; //Development tool for visualizing ship center and trajectory.
const SHOW_BOUNDING = false; // Development tool to visualize collision bounding.

// Asteroid Related Settings
const ASTEROIDS_NUM = 1; //Number of asteroids at the starting level.
const ASTEROIDS_SIZE = 100; // Starting size of asteroids in pixels.
const ASTEROIDS_SIZE_MIN = 25; // The minimum size an asteroid can be.
const ASTEROIDS_SPEED = 75; // Max starting speed in pixels per second.
const ASTEROIDS_VERT = 10; // Average number of vertices of the asteroids.
const ASTEROIDS_JAGGEDNESS = 0.35; //Jaggeness of asteroids. ( 0 = none, 1 = ton of).
const ASTEROID_LINE_WIDTH = 1.5; // Width of the lines drawn for the asteroids.
const NUM_OF_SPLITS = 2; // The number of asteroids an asteroid splits into when destroyed

//General Game Parameters Constants
const TEXT_FADE_TIME = 2.5; // In seconds
const TEXT_SIZE = 20; //Height in pixels

// General Game Parameters variables
export let level = 0;
let text = 'Level ' + (level + 1);
let textAlpha = 1.0;
let gameOver = false;

//Defining the canvas and context for drawing the game.
/** @type {HTMLCanvasElement} */
let canv = document.getElementById('gameCanvas');
let context = canv.getContext('2d');

// Initializing the ship and asteroid belt
let ship;
let asteroidBelt;

// Set up the Game loop
setInterval(gameLoop, 1000 / FPS);

// Initialize the game
newGame();

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

  checkForLevelUp();

  checkForGameOver();

  drawText();
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
        //ship.lasers.splice(j, 1);
        ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DURATION * FPS);

        // remove the asteroid
        if (ship.lasers[j].canExplode) asteroidBelt.destroyAsteroid(i);
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

function checkForGameOver() {
  if (ship.explodeTime === 1) {
    newGame();
  }
}

function newGame() {
  level = 0;
  //Creating a ship
  ship = new Ship(
    canv,
    context,
    SHIP_SIZE,
    SHIP_COLOR,
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

  // Creating an instance of the asteroid belt
  asteroidBelt = new AsteroidBelt(
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
}

function checkForLevelUp() {
  if (asteroidBelt.asteroids.length === 0) {
    levelUp();
  }
}

function levelUp() {
  level++;
  asteroidBelt.createAsteroids(ship);
  text = 'Level ' + (level + 1);
  textAlpha = 1.0;
}

function drawText() {
  if (textAlpha >= 0) {
    context.fillStyle = 'rgba(255, 255, 255, ' + textAlpha + ')';
    context.font = 'small-caps ' + TEXT_SIZE + 'px "Press Start 2P"';
    context.fillText(text, canv.width / 1.5, canv.height * 0.9);
    textAlpha -= 1.0 / TEXT_FADE_TIME / FPS;
  }
}

// Utility function for checking the distance between 2 objects
export function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
