import Ship from './ship.js';
import AsteroidBelt from './asteroid-belt.js'; // Import the AsteroidBelt class
import HttpHandler from './HttpHandler.js';
import { Sound } from './Sound.js';

// Game Settings
const FPS = 60; // Frames per Second
export const AUDIO = false;

// Ship Related Settings
const SHIP_SIZE = 30; // Ship height in pixels.
const SHIP_COLOR = 'white';
const SHIP_THRUST = 3.2; // Acceleration of ship in pixels per second every second.
const FRICTION = 0.7; // Friction coefficient of space (0 = no friction, 1 = ton of friction).
const TURN_SPEED = 280; // Turn speed in degrees per second.
const SHIP_EXPLODE_DURATION = 2; // Duration of ship explosion in seconds.
const LASERS_MAX = 3; // Maximum number of lasers on the screen at once.
const LASERS_SPEED = 400; // Speed of the lasers in pixels per second.
const LASERS_DIST = 0.5; // Maximum distance the laser can travel as a percentage of the width of the screen.
const LASER_EXPLODE_DURATION = 2; // For how long in seconds the laser explosion will last.

// Development Tools
const SHOW_CENTER_DOT = false; // Development tool for visualizing ship center and trajectory.
const SHOW_BOUNDING = false; // Development tool to visualize collision bounding.

// Asteroid Related Settings
const ASTEROIDS_NUM = 3; // Number of asteroids at the starting level.
const ASTEROIDS_SIZE = 100; // Starting size of asteroids in pixels.
const ASTEROIDS_SIZE_MIN = 25; // The minimum size an asteroid can be.
const ASTEROIDS_SPEED = 75; // Max starting speed in pixels per second.
const ASTEROIDS_VERT = 10; // Average number of vertices of the asteroids.
const ASTEROIDS_JAGGEDNESS = 0.35; // Jaggedness of asteroids. (0 = none, 1 = ton of).
const ASTEROID_LINE_WIDTH = 1.5; // Width of the lines drawn for the asteroids.
const NUM_OF_SPLITS = 2; // The number of asteroids an asteroid splits into when destroyed

// General Game Parameters Constants
const TEXT_FADE_TIME = 2.5; // In seconds
const TEXT_SIZE = 20; // Height in pixels

// General Game Parameters variables
export let level = 0;
let levelText;
let score = 0;
let enteredInitials = ''; // Stores the entered initials
let keyPressAllowed = true;
let scoreSubmitted = false; // Flag to ensure score is submitted once
export let startGame = false;

// Http handler for querying the backend/database
const api = new HttpHandler('https://hardcoreasteroids.com');

// Getting the top 5 high scores from the back end.
let highScores = getTopFiveScores(await api.getAllHighScores());

console.log(highScores);

// Audio for the ship
const FX_MUSIC = new Sound('scripts/Sounds/4donald.m4a', 1, 0.25);

// Defining the canvas and context for drawing the game.
/** @type {HTMLCanvasElement} */
let canv = document.getElementById('gameCanvas');
let context = canv.getContext('2d');

// Initializing the ship and asteroid belt
let ship;
let asteroidBelt;

// Set up the Game loop
setInterval(gameLoop, 1000 / FPS);

// Event listener for spacebar to start the game
document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') {
    startGame = true;
    document.removeEventListener('keydown', restartGame); // Prevent restarting if already running
  }
});

// Initialize the game and the starting level.
newGame(level);

// This is the Game Loop where all logic is continually updated per the FPS
function gameLoop() {
  // Draw Outer Space Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, canv.width, canv.height);

  if (startGame) {
    FX_MUSIC.play();
    if (!ship.dead) {
      // Updating ship positional and logical data.
      ship.update();

      // Drawing the ship
      ship.draw(SHOW_CENTER_DOT, SHOW_BOUNDING);

      checkForLevelUp();
    } else {
      if (ship.dead) {
        endGame();
        document.addEventListener('keydown', restartGame);
      }
    }
    // Update Asteroid belt positional and logical data.
    asteroidBelt.update();

    // Perform collision detection if the ship has not been exploded
    if (!ship.exploding) {
      detectCollisions();
    }

    // Drawing the asteroid belt
    asteroidBelt.draw(SHOW_BOUNDING);
    drawLevel();
    drawScore();
  } else {
    drawText(canv.width / 3.5, canv.height / 2, 'Press Enter to play');
  }
}

// Re-instantiating the ship and asteroids with default values.
function newGame(startLevel = 0) {
  level = startLevel;
  score = 0;
  levelText = 'Level ' + (level + 1);
  // Creating a ship
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

// If the asteroids are all gone, level up
function checkForLevelUp() {
  if (asteroidBelt.asteroids.length === 0) {
    levelUp();
  }
}

// When the level up happens, create asteroids, display level.
// NOTE: all asteroids speed and quantity scales with level number.
function levelUp() {
  level++;
  asteroidBelt.createAsteroids(ship);
  levelText = 'Level ' + (level + 1);
}

// This function is async as it deals with HTTP requests.
// Once the game is over, display the high scores on the canvas
// If the player makes it in the top 5, they are able to submit their high score.
async function endGame() {
  drawHighScores();
  let txt = 'Press Space to play again';
  drawText(canv.width / 4, canv.height * 0.9, txt);

  if (score > Number(highScores[4].score)) {
    let txt = 'You made it in the top 5!';
    drawText(canv.width / 4, canv.height * 0.7, txt);

    drawText(
      canv.width / 4,
      canv.height * 0.8,
      `Enter Initials: ${enteredInitials}`,
      1.0
    );

    // Remove existing event listeners to prevent duplicates
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // Add event listeners for entering initials and submitting the score
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }
}

// Function for detecting collisions with the laser and ship with asteroids.
function detectCollisions() {
  let ax, ay, ar, lx, ly;
  for (let i = asteroidBelt.asteroids.length - 1; i >= 0; i--) {
    // Grabbing the asteroid properties
    ax = asteroidBelt.asteroids[i].x;
    ay = asteroidBelt.asteroids[i].y;
    ar = asteroidBelt.asteroids[i].r;
    // Looping over lasers checking for asteroid collisions
    for (let j = ship.lasers.length - 1; j >= 0; j--) {
      // Grabbing the laser properties
      lx = ship.lasers[j].x;
      ly = ship.lasers[j].y;

      // If the laser collides, remove the laser
      if (distBetweenPoints(ax, ay, lx, ly) < ar) {
        // Remove the laser
        ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DURATION * FPS);

        // Remove the asteroid
        if (ship.lasers[j].canExplode) {
          if (asteroidBelt.asteroids[i].r * 2 < 30) score += 5;
          else if (asteroidBelt.asteroids[i].r * 2 < 55) score += 2;
          else score += 1;
          asteroidBelt.destroyAsteroid(i);
        }
        break;
      }
    }

    // If the asteroids collide with a ship the ship explodes
    if (distBetweenPoints(ship.x, ship.y, ax, ay) < ship.r + ar) {
      ship.explode();
    }
  }
}

// After the game has ended, the player is able to restart with the space key.
function restartGame(ev) {
  if (ev.code === 'Space') {
    document.removeEventListener('keydown', restartGame);
    scoreSubmitted = false; // Reset the flag when the game restarts
    newGame();
  }
}

// This is for displaying the real-time updated score on the canvas
function drawScore() {
  let txt = 'Score: ' + String(score);
  drawText(canv.width / 1.5, canv.height * 0.1, txt, 0.75);
}

//This is for displaying the real-time updated score on the canvas
function drawLevel() {
  drawText(canv.width / 10, canv.height * 0.95, levelText, 0.75);
}

// This is for displaying the high scores that are queried from the database.
function drawHighScores() {
  let txt = 'High Scores';
  drawText(canv.width / 4, canv.height * 0.1, txt);
  for (let i = 0; i < highScores.length; i++) {
    let txt = highScores[i].initials + '     ' + highScores[i].score;
    drawText(canv.width / 4, canv.height * (i * 0.1 + 0.2), txt);
  }
}

// A general function for drawing a textbox in the canvas
function drawText(x, y, txt, alpha = 1.0, fade = false) {
  if (alpha >= 0) {
    context.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    context.font = 'small-caps ' + TEXT_SIZE + 'px "Press Start 2P"';
    context.fillText(txt, x, y);
    if (fade) alpha -= 1.0 / TEXT_FADE_TIME / FPS;
  }
}

// A general function for getting the top 5 high scores from the back end.
function getTopFiveScores(data) {
  data.sort((a, b) => b.score - a.score);
  return data.slice(0, 5);
}

// Utility function for checking the distance between 2 objects
export function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to handle the key down event
async function handleKeyDown(event) {
  if (!scoreSubmitted) {
    // Check if the score has already been submitted
    const key = event.key.toUpperCase();
    if (keyPressAllowed) {
      if (
        key.length === 1 &&
        key.match(/[A-Z]/) &&
        enteredInitials.length < 3
      ) {
        enteredInitials += key;
      } else if (event.key === 'Backspace' && enteredInitials.length > 0) {
        enteredInitials = enteredInitials.slice(0, -1);
      } else if (event.key === 'Enter' && enteredInitials.length === 3) {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        await api.addHighScore(enteredInitials, score);
        scoreSubmitted = true; // Set the flag to true after submission
        score = 0;
        highScores = getTopFiveScores(await api.getAllHighScores());
      }
      keyPressAllowed = false;
    }
  }
}

// This prevents repeated inputs when holding down on keys.
function handleKeyUp(event) {
  keyPressAllowed = true;
}
