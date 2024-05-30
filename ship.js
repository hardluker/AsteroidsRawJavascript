class Ship {
  constructor(
    canv,
    context,
    SHIP_SIZE,
    SHIP_THRUST,
    FRICTION,
    TURN_SPEED,
    FPS,
    SHIP_EXPLODE_DURATION
  ) {
    //Canvas / document related attributes
    this.canv = canv;
    this.context = context;

    //Positional Attributes
    this.x = canv.width / 2; // Ship always starts in the middle of the screen
    this.y = canv.height / 2;
    this.size = SHIP_SIZE; // Ship height in pixels
    this.r = this.size / 2;
    this.a = (90 / 180) * Math.PI; // Convert degree to radians
    this.rot = 0;

    //State / Utility Attributes
    this.turnSpeed = TURN_SPEED; // Turn speed in degrees per second.
    this.exploding = false;
    this.explodeTime = 0;
    this.explodeDuration = SHIP_EXPLODE_DURATION;
    this.fps = FPS;
    this.friction = FRICTION; // Level of friction (0 = none, 1 = Heavy)
    this.thrustConst = SHIP_THRUST; // Acceleration of the ship in pixels per second
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
        this.rot = ((this.turnSpeed / 180) * Math.PI) / this.fps; // TURN_SPEED / FPS
        break;
      case 'ArrowUp':
        this.thrusting = true;
        break;
      case 'ArrowRight':
        this.rot = ((-this.turnSpeed / 180) * Math.PI) / this.fps; // TURN_SPEED / FPS
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

  explode() {
    this.explodeTime = this.explodeDuration;
  }

  update() {
    //Checking if the ship explosion time has gone off.
    this.exploding = this.explodeTime > 0;

    //Thrust the ship
    if (this.thrusting) {
      this.thrust.x += (this.thrustConst * Math.cos(this.a)) / this.fps;
      this.thrust.y -= (this.thrustConst * Math.sin(this.a)) / this.fps;
    } else {
      this.thrust.x -= (this.friction * this.thrust.x) / this.fps;
      this.thrust.y -= (this.friction * this.thrust.y) / this.fps;
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

  draw(SHOW_CENTER_DOT, SHOW_BOUNDING) {
    if (!this.exploding) {
      // Beginning Draw triangle ship
      this.context.strokeStyle = 'white';
      this.context.lineWidth = this.size / 20; // SHIP_SIZE / 20
      this.context.beginPath();

      // Starting the stroke at the nose of the ship
      this.context.moveTo(
        this.x + (4 / 3) * this.r * Math.cos(this.a),
        this.y - (4 / 3) * this.r * Math.sin(this.a)
      );

      // Drawing a line to the bottom left
      this.context.lineTo(
        this.x - this.r * ((2 / 3) * Math.cos(this.a) + Math.sin(this.a)),
        this.y + this.r * ((2 / 3) * Math.sin(this.a) - Math.cos(this.a))
      );

      // Next, drawing a line to the bottom right
      this.context.lineTo(
        this.x - this.r * ((2 / 3) * Math.cos(this.a) - Math.sin(this.a)),
        this.y + this.r * ((2 / 3) * Math.sin(this.a) + Math.cos(this.a))
      );

      // Finally, Drawing the line back to the nose of the ship
      this.context.closePath();
      this.context.stroke();

      // Drawing the thruster flame
      if (this.thrusting) {
        this.context.fillStyle = 'yellow';
        this.context.strokeStyle = 'red';
        this.context.lineWidth = 30 / 10; // SHIP_SIZE / 10
        this.context.beginPath();

        // Starting at the rear left of the ship
        this.context.moveTo(
          this.x -
            this.r * ((2 / 3) * Math.cos(this.a) + 0.5 * Math.sin(this.a)),
          this.y +
            this.r * ((2 / 3) * Math.sin(this.a) - 0.5 * Math.cos(this.a))
        );

        // Drawing a line to the rear center behind the ship.
        this.context.lineTo(
          this.x - ((this.r * 6) / 3) * Math.cos(this.a),
          this.y + ((this.r * 6) / 3) * Math.sin(this.a)
        );

        // Next, drawing a line to the rear right of the ship
        this.context.lineTo(
          this.x -
            this.r * ((2 / 3) * Math.cos(this.a) - 0.5 * Math.sin(this.a)),
          this.y +
            this.r * ((2 / 3) * Math.sin(this.a) + 0.5 * Math.cos(this.a))
        );

        //Finalizing the drawing
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
      }
    }
    // Else, the ship is exploding
    else {
      //Draw the explosion
      const colors = ['darkred', 'red', 'orange', 'yellow', 'white'];
      const radii = [1.8, 1.4, 1.1, 0.8, 0.5];
      for (let i = 0; i < colors.length; i++) {
        this.context.fillStyle = colors[i];
        this.context.beginPath();
        this.context.arc(
          this.x,
          this.y,
          this.r * radii[i],
          0,
          Math.PI * 2,
          false
        );
        this.context.fill();
      }
    }

    //Developer Tools Drawings
    //Draw Ship Center dot
    if (SHOW_CENTER_DOT) {
      this.context.fillStyle = 'red';
      this.context.fillRect(this.x - 1, this.y - 1, 2, 2);
    }

    // Draw bounding circle for ship collision detection
    if (SHOW_BOUNDING) {
      this.context.strokeStyle = 'lime';
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      this.context.stroke();
    }
  }
}
export default Ship;
