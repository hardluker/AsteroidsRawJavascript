import Ship from './ship.js';
import AsteroidBelt from './asteroidBelt.js'; // Import the AsteroidBelt class

// Game Settings
const FPS = 30; // Frames per Second

// Ship Related Settings
const SHIP_SIZE = 30; // Ship height in pixels
const SHIP_THRUST = 8; // Acceleration of ship in pixels per second every second
const FRICTION = 0.4; // Friction coefficient of space (0 = no friction, 1 = ton of friction)
const TURN_SPEED = 360; // Turn speed in degrees per second
const SHIP_EXPLODE_DURATION = 0.3; // Duration of ship explosion in seconds

// Development Tools
const SHOW_CENTER_DOT = false; //Development tool for visualizing ship center and trajectory.
const SHOW_BOUNDING = false; // Development tool to visualize collision bounding

// Asteroid Related Settings
const ASTEROIDS_NUM = 3; //Number of asteroids at the starting level.
const ASTEROIDS_SIZE = 100; // Starting size of asteroids in pixels
const ASTEROIDS_SPEED = 50; // Max starting speed in pixels per second.
const ASTEROIDS_VERT = 10; // Average number of vertices of the asteroids.
const ASTEROIDS_JAGGEDNESS = 0.4; //Jaggeness of asteroids. ( 0 = none, 1 = ton of)

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
  SHIP_EXPLODE_DURATION
);

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

  // Check for asteroid collisions
  detectCollisions();

  //Drawing the ship
  ship.draw(SHOW_CENTER_DOT, SHOW_BOUNDING);

  //Drawing the asteroid belt
  asteroidBelt.draw(SHOW_BOUNDING);
}

// Function for detecting collisions with the ship and the asteroids
function detectCollisions() {
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
      ship.explode();
    }
  }
}

// Utility function for checking the distance between 2 objects
export function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
