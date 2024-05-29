const FPS = 30; // Frames per Second

const SHIP_SIZE = 30; // Ship height in pixels
const SHIP_THRUST = 8; // Acceleration of ship in pixels per second every second
const FRICTION = 0.7; // Friction coefficient of space (0 = no friction, 1 = ton of friction)
const TURN_SPEED = 360; //Turn speed in degrees per second

const ASTEROIDS_NUM = 3; //Number of asteroids at the starting level.
const ASTEROIDS_SIZE = 100; // Starting size of asteroids in pixels
const ASTEROIDS_SPEED = 50; // Max starting speed in pixels per second.
const ASTEROIDS_VERT = 10; // Average number of vertices of the asteroids.
const ASTEROIDS_JAGGEDNESS = 0.4; //Jaggeness of asteroids. ( 0 = none, 1 = ton of)

/** @type {HTMLCanvasElement} */
let canv = document.getElementById('gameCanvas');
let context = canv.getContext('2d');

let ship = {
  x: canv.width / 2,
  y: canv.height / 2,
  r: SHIP_SIZE / 2,
  a: (90 / 180) * Math.PI, //Convert Degree to Radians
  rot: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0
  }
};

let asteroids = [];
createAsteroidBelt();

// set up event handlers
document.addEventListener('keydown', keyPress);
document.addEventListener('keyup', keyRelease);

//Set up the Game loop
setInterval(update, 1000 / FPS);

function keyPress(/** @type {KeyboardEvent} */ ev) {
  switch (ev.key) {
    // Left arrow event (rotate ship left)
    case 'ArrowLeft':
      ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;

    //Up arrow event (Ship flies forward)
    case 'ArrowUp':
      ship.thrusting = true;
      break;

    //Right arrow event (rotate ship right)
    case 'ArrowRight':
      ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;
  }
}

function keyRelease(/** @type {keyboardEvent} */ ev) {
  switch (ev.key) {
    // Left arrow event (Stop rotate ship left)
    case 'ArrowLeft':
      ship.rot = 0;
      break;

    //Up arrow event (Stop Ship flies forward)
    case 'ArrowUp':
      ship.thrusting = false;
      break;

    //Right arrow event (Stop rotate ship right)
    case 'ArrowRight':
      ship.rot = 0;
      break;
  }
}

// Function to create the Asteroid belt
function createAsteroidBelt() {
  //Clear the asteroids array
  asteroids = [];
  //Declare X and Y of asteroids.
  let x, y;
  for (let i = 0; i < ASTEROIDS_NUM; i++) {
    do {
      x = Math.floor(Math.random() * canv.width);
      y = Math.floor(Math.random() * canv.height);
    } while (
      distBetweenPoints(ship.x, ship.y, x, y) <
      ASTEROIDS_SIZE * 2 + ship.r
    );
    asteroids.push(newAsteroid(x, y));
  }
  // Calculate points until the asteriod is a certain distance fro the ship.
}

function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

function update() {
  // draw space
  context.fillStyle = 'black';
  context.fillRect(0, 0, canv.width, canv.height);

  //Thrust the ship
  if (ship.thrusting) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS;

    // draw the thruster
    context.fillStyle = 'yellow';
    context.strokeStyle = 'red';
    context.lineWidth = SHIP_SIZE / 10;
    context.beginPath();

    // Starting at the rear left of the ship
    context.moveTo(
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
    );

    // Drawing a line to the rear center of the ship
    context.lineTo(
      ship.x - ((ship.r * 6) / 3) * Math.cos(ship.a),
      ship.y + ((ship.r * 6) / 3) * Math.sin(ship.a)
    );

    // Next, drawing a line to the rear right of the ship
    context.lineTo(
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
    );

    context.closePath();
    context.fill();
    context.stroke();
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }

  // draw triangle ship
  context.strokeStyle = 'white';
  context.lineWidth = SHIP_SIZE / 20;
  context.beginPath();

  // Starting the stroke at the nose of the ship
  context.moveTo(
    ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
    ship.y - (4 / 3) * ship.r * Math.sin(ship.a)
  );

  // Drawing a line to the bottom left
  context.lineTo(
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))
  );

  // Next, drawing a line to the bottom right
  context.lineTo(
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))
  );

  // Finally, Drawing the line back to the nose of the ship
  context.closePath();
  context.stroke();

  //rotate ship
  ship.a += ship.rot;

  //move the ship
  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;

  // handle edge of screen X
  if (ship.x < 0 - ship.r) ship.x = canv.width + ship.r;
  else if (ship.x > canv.width + ship.r) ship.x = 0 - ship.r;

  // handle edge of screen Y
  if (ship.y < 0 - ship.r) ship.y = canv.height + ship.r;
  else if (ship.y > canv.height + ship.r) ship.y = 0 - ship.r;

  // Center dot
  context.fillStyle = 'red';
  context.fillRect(ship.x - 1, ship.y - 1, 2, 2);

  //Draw Asteroids
  context.strokeStyle = 'slategrey';
  context.lineWidth = SHIP_SIZE / 20;
  let x, y, r, a, vert, offs;
  for (let i = 0; i < asteroids.length; i++) {
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
    // Move the asteroid
    // Handle edge of screen
  }
}
