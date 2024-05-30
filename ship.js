class Ship {
  constructor() {
    //Canvas / document related attributes
    this.canv = document.getElementById('gameCanvas');
    this.context = canv.getContext('2d');

    //Positional Attributes
    this.x = canv.width / 2; // Ship always starts in the middle of the screen
    this.y = canv.height / 2;
    this.size = 30; // Ship height in pixels
    this.r = SIZE / 2;
    this.a = (90 / 180) * Math.PI; // Convert degree to radians
    this.rot = 0;

    //State / Utility Attributes
    this.turnSpeed = 360; // Turn speed in degrees per second.
    this.explodeTime = 0;
    this.friction = 0.7; // Level of friction (0 = none, 1 = Heavy)
    this.thrustConst = 8; // Acceleration of the ship in pixels per second
    this.thrusting = false;
    this.thrust = {
      x: 0,
      y: 0
    };

    //Event Listeners for keyboard commands
    document.addEventListener('keydown', this.keyPress.bind(this));
    document.addEventListener('keyup', this.keyRelease.bind(this));
  }

  // Handling when keys are pressed
  keyPress(ev) {
    switch (ev.key) {
      case 'ArrowLeft':
        this.rot = ((360 / 180) * Math.PI) / 30; // TURN_SPEED / FPS
        break;
      case 'ArrowUp':
        this.thrusting = true;
        break;
      case 'ArrowRight':
        this.rot = ((-360 / 180) * Math.PI) / 30; // TURN_SPEED / FPS
        break;
    }
  }

  //Handling when keys are released.
  keyRelease(ev) {
    switch (ev.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        this.rot = 0;
        break;
      case 'ArrowUp':
        this.thrusting = false;
        break;
    }
  }

  update(FPS) {
    //Thrust the ship
    if (this.thrusting) {
      this.thrust.x += (SHIP_THRUST * Math.cos(this.a)) / FPS;
      this.thrust.y -= (SHIP_THRUST * Math.sin(this.a)) / FPS;
    } else {
      this.thrust.x -= (FRICTION * this.thrust.x) / FPS;
      this.thrust.y -= (FRICTION * this.thrust.y) / FPS;
    }

    // Update ship rotation
    this.a += this.rot;

    // Move the ship
    this.x += this.thrust.x;
    this.y += this.thrust.y;

    // Handle edge of screen
    if (this.x < 0 - this.r) this.x = this.canv.width + this.r;
    else if (this.x > this.canv.width + this.r) this.x = 0 - this.r;
    if (this.y < 0 - this.r) this.y = this.canv.height + this.r;
    else if (this.y > this.canv.height + this.r) this.y = 0 - this.r;
  }
}
