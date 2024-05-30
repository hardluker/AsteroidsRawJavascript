import Ship from './ship.js';

const FPS = 30; // Frames per Second

const SHIP_SIZE = 30; // Ship height in pixels
const SHIP_THRUST = 8; // Acceleration of ship in pixels per second every second
const FRICTION = 0.7; // Friction coefficient of space (0 = no friction, 1 = ton of friction)
const TURN_SPEED = 360; //Turn speed in degrees per second
const SHIP_EXPLODE_DURATION = 0.3; // Duration of ship explosion in seconds

const SHOW_CENTER_DOT = false; //Development tool for visualizing ship center and trajectory.
const SHOW_BOUNDING = false; // Development tool to visualize collision bounding

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

let asteroids = [];
createAsteroidBelt();

//Set up the Game loop
setInterval(update, 1000 / FPS);

// Function to create the Asteroid belt
function createAsteroidBelt() {
  //Clear the asteroids array
  asteroids = [];
  //Declare X and Y of asteroids.
  let x, y;
  for (let i = 0; i < ASTEROIDS_NUM; i++) {
    // Calculate points until the asteriod is a certain distance from the ship.
    do {
      x = Math.floor(Math.random() * canv.width);
      y = Math.floor(Math.random() * canv.height);
    } while (
      distBetweenPoints(ship.x, ship.y, x, y) <
      ASTEROIDS_SIZE * 2 + ship.r
    );
    asteroids.push(newAsteroid(x, y));
  }
}

function newAsteroid(x, y) {
  let asteroid = {
    x: x,
    y: y,
    //Random velocity in the positive or negative direction
    xvelocity:
      ((Math.random() * ASTEROIDS_SPEED) / FPS) *
      (Math.random() < 0.5 ? 1 : -1),
    yvelocity:
      ((Math.random() * ASTEROIDS_SPEED) / FPS) *
      (Math.random() < 0.5 ? 1 : -1),
    r: ASTEROIDS_SIZE / 2,
    a: Math.random() * Math.PI * 2, // Random angle in radians
    // Random number of whole vertices
    vertices: Math.floor(
      Math.random() * (ASTEROIDS_VERT + 1) + ASTEROIDS_VERT / 2
    ),
    offset: []
  };

  for (let i = 0; i < asteroid.vertices; i++) {
    asteroid.offset.push(
      Math.random() * ASTEROIDS_JAGGEDNESS * 2 + 1 - ASTEROIDS_JAGGEDNESS
    );
  }

  return asteroid;
}

function explodeShip() {
  ship.explodeTime = Math.ceil(SHIP_EXPLODE_DURATION * FPS);
}

function distBetweenPoints(x1, y1, x2, y2) {
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
  for (let i = 0; i < asteroids.length; i++) {
    if (
      distBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y) <
      ship.r + asteroids[i].r
    ) {
      explodeShip();
    }
  }

  //Drawing the ship
  ship.draw();

  // Draw asteroids
  let x, y, r, a, vert, offs;
  for (let i = 0; i < asteroids.length; i++) {
    context.strokeStyle = 'slategrey';
    context.lineWidth = SHIP_SIZE / 20;
    // get asteroid properties
    x = asteroids[i].x;
    y = asteroids[i].y;
    r = asteroids[i].r;
    a = asteroids[i].a;
    vert = asteroids[i].vertices;
    offs = asteroids[i].offset;

    // Draw a path
    context.beginPath();
    context.moveTo(
      x + r * offs[0] * Math.cos(a),
      y + r * offs[0] * Math.sin(a)
    );

    // Draw the polygon
    for (let j = 0; j < vert; j++) {
      context.lineTo(
        x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
        y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
      );
    }
    context.closePath();
    context.stroke();

    // Draw bounding circle
    if (SHOW_BOUNDING) {
      context.strokeStyle = 'lime';
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2, false);
      context.stroke();
    }
  }

  //Moving the Asteroids
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].x += asteroids[i].xvelocity;
    asteroids[i].y += asteroids[i].yvelocity;

    // Handle edge of screen
    if (asteroids[i].x < 0 - asteroids[i].r) {
      asteroids[i].x = canv.width + asteroids[i].r;
    } else if (asteroids[i].x > canv.width + asteroids[i].r) {
      asteroids[i].x = 0 - asteroids[i].r;
    }
    if (asteroids[i].y < 0 - asteroids[i].r) {
      asteroids[i].y = canv.height + asteroids[i].r;
    } else if (asteroids[i].y > canv.height + asteroids[i].r) {
      asteroids[i].y = 0 - asteroids[i].r;
    }
  }
}
