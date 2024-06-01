class Ship {
  constructor(
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
    this.dead = false;
    this.thrust = {
      x: 0,
      y: 0
    };
    this.color = SHIP_COLOR;
    this.numOfPeices = 3;
    this.pieces = []; // An array of the broken peices of an exploded ship.

    // Ship laser settings
    this.lasersMax = LASERS_MAX;
    this.lasersSpeed = LASERS_SPEED;
    this.lasersDist = LASERS_DIST;
    this.laserExplodeDuration = LASER_EXPLODE_DURATION;
    this.canShoot = true;
    this.lasers = [];
    this.numOfFragments = 10; //Number of exploded laser fragments

    //Event Listeners for keyboard commands
    document.addEventListener('keydown', this.keyPress.bind(this));
    document.addEventListener('keyup', this.keyRelease.bind(this));
  }

  // Handling when keys are pressed
  keyPress(ev) {
    switch (ev.key) {
      case 'ArrowLeft': // Rotate ship left
        this.rot = ((this.turnSpeed / 180) * Math.PI) / this.fps; // TURN_SPEED / FPS
        break;
      case 'ArrowUp': // Move ship forward
        this.thrusting = true;
        break;
      case 'ArrowRight': // Rotate ship right
        this.rot = ((-this.turnSpeed / 180) * Math.PI) / this.fps; // TURN_SPEED / FPS
        break;
      case ' ': //When the spacebar is pressed shoot
        this.canShoot = true;
        this.shootLaser();
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

  // Ship shooting logic
  shootLaser() {
    //Create the laser object
    if (this.canShoot && this.lasers.length < this.lasersMax) {
      this.lasers.push({
        // Creating the laser from the nose of the ship
        x: this.x + (4 / 3) * this.r * Math.cos(this.a),
        y: this.y - (4 / 3) * this.r * Math.sin(this.a),
        xvelocity: (this.lasersSpeed * Math.cos(this.a)) / this.fps,
        yvelocity: (this.lasersSpeed * Math.sin(this.a)) / this.fps,
        dist: 0, // Distance the laser has traveled.
        explodeTime: 0,
        canExplode: true,
        fragments: [] // Array of the laser fragments for exploding
      });
    }
    // Prevent further shooting
    this.canShoot = false;
  }

  //Explode the laser
  explodeLaser(laser) {
    for (let i = 0; i < this.numOfFragments; i++) {
      laser.fragments.push({
        // Creating laser fragments with random velocities
        x: laser.x,
        y: laser.y,
        xvelocity:
          ((Math.random() * this.lasersSpeed) / 2 / this.fps) *
          (Math.random() < 0.5 ? 1 : -1),
        yvelocity:
          ((Math.random() * this.lasersSpeed) / 2 / this.fps) *
          (Math.random() < 0.5 ? 1 : -1)
      });
    }
    laser.canExplode = false;
  }

  // Ship exploding logic
  explode() {
    // Adding peices to the array of ship pieces
    for (let i = 0; i < this.numOfPeices; i++) {
      this.pieces.push({
        // Pushing pieces of the ship
        x: this.x,
        y: this.y,
        r: this.r,
        a: Math.random() * Math.PI * 2,
        rot:
          (((this.turnSpeed / 360) * Math.PI) / this.fps) *
          (Math.random() < 0.5 ? 1 : -1),
        xvelocity:
          ((Math.random() * this.lasersSpeed) / 2 / this.fps) *
          (Math.random() < 0.5 ? 1 : -1),
        yvelocity:
          ((Math.random() * this.lasersSpeed) / 2 / this.fps) *
          (Math.random() < 0.5 ? 1 : -1)
      });
    }
    // Adding an explode time to the ship
    this.explodeTime = Math.ceil(this.explodeDuration * this.fps);
  }

  //Updating logic and positional data related to the ship.
  update() {
    //Checking if the ship explosion time has gone off.
    this.exploding = this.explodeTime > 0;

    if (!this.exploding) {
      //Thrust the ship utilizing an acceleration algorithm
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

      // Handle edge of screen for ship
      if (this.x < 0 - this.r) this.x = this.canv.width + this.r;
      else if (this.x > this.canv.width + this.r) this.x = 0 - this.r;
      if (this.y < 0 - this.r) this.y = this.canv.height + this.r;
      else if (this.y > this.canv.height + this.r) this.y = 0 - this.r;

      // Lasers Update Logic
      for (let i = this.lasers.length - 1; i >= 0; i--) {
        // If the laser has traveled too far, remove it.
        if (this.lasers[i].dist > this.lasersDist * this.canv.width) {
          this.lasers.splice(i, 1);
          continue;
        }

        // Moving the laser
        this.lasers[i].x += this.lasers[i].xvelocity;
        this.lasers[i].y -= this.lasers[i].yvelocity;

        // Calculate distanced traveled across the canvas.
        this.lasers[i].dist += Math.sqrt(
          Math.pow(this.lasers[i].xvelocity, 2) +
            Math.pow(this.lasers[i].yvelocity, 2)
        );

        // If the laser is exploding, stop moving.
        if (this.lasers[i].explodeTime > 0) {
          this.lasers[i].xvelocity = 0;
          this.lasers[i].yvelocity = 0;
        }

        // If fragments are present, update the positioning
        for (let j = 0; j < this.lasers[i].fragments.length; j++) {
          let fragment = this.lasers[i].fragments[j];
          fragment.x += fragment.xvelocity;
          fragment.y += fragment.yvelocity;
          this.lasers[i].explodeTime--;
        }
        // Once the timer has counted down, remove the laser and it's fragments
        if (this.lasers[i].explodeTime < 0) {
          this.lasers.splice(i, 1);
          continue;
        }
      }
    } else {
      //Update peices of the ship
      for (let i = 0; i < this.pieces.length; i++) {
        let piece = this.pieces[i];
        piece.x += piece.xvelocity;
        piece.y += piece.yvelocity;
        piece.a += piece.rot;
      }
      this.explodeTime--;
      if (this.explodeTime === 1) this.dead = true;
    }
  }

  // Drawing aspects related to the ship
  draw(SHOW_CENTER_DOT, SHOW_BOUNDING) {
    if (!this.exploding) {
      // Beginning Draw triangle ship
      this.context.strokeStyle = this.color;
      this.context.lineWidth = this.size / 30; // SHIP_SIZE / 20
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
        this.context.lineWidth = this.size / 10; // SHIP_SIZE / 10
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

      //Drawing the lasers
      for (let i = 0; i < this.lasers.length; i++) {
        if (this.lasers[i].explodeTime === 0 && this.lasers[i].canExplode) {
          this.context.fillStyle = 'white ';
          this.context.beginPath();
          this.context.arc(
            this.lasers[i].x,
            this.lasers[i].y,
            this.size / 15,
            0,
            Math.PI * 2,
            false
          );
          this.context.fill();
        }
        // Otherwise, flag the laser and explode it. Finally, draw the laser.
        else {
          if (this.lasers[i].canExplode) this.explodeLaser(this.lasers[i]);
          // Draw the laser explosion fragments
          for (let j = 0; j < this.lasers[i].fragments.length; j++) {
            let fragment = this.lasers[i].fragments[j];
            this.context.fillStyle = 'white ';
            this.context.beginPath();
            this.context.arc(
              fragment.x,
              fragment.y,
              this.size / 40,
              0,
              Math.PI * 2,
              false
            );
            this.context.fill();
          }
        }
      }
    }
    // Else, the ship is exploding
    else {
      let color = this.color;
      let lineWidth = this.size / 30; // SHIP_SIZE / 30
      let pieces = this.pieces;

      // Drawing first piece of the ship
      this.drawLine(
        pieces[0].x + (4 / 3) * pieces[0].r * Math.cos(pieces[0].a),
        pieces[0].y - (4 / 3) * pieces[0].r * Math.sin(pieces[0].a),
        pieces[0].x -
          pieces[0].r *
            ((2 / 3) * Math.cos(pieces[0].a) + Math.sin(pieces[0].a)),
        pieces[0].y +
          pieces[0].r *
            ((2 / 3) * Math.sin(pieces[0].a) - Math.cos(pieces[0].a)),
        color,
        lineWidth
      );

      //Drawing second piece of the ship
      this.drawLine(
        pieces[1].x -
          pieces[1].r *
            ((2 / 3) * Math.cos(pieces[1].a) + Math.sin(pieces[1].a)),
        pieces[1].y +
          pieces[1].r *
            ((2 / 3) * Math.sin(pieces[1].a) - Math.cos(pieces[1].a)),
        pieces[1].x -
          pieces[1].r *
            ((2 / 3) * Math.cos(pieces[1].a) - Math.sin(pieces[1].a)),
        pieces[1].y +
          pieces[1].r *
            ((2 / 3) * Math.sin(pieces[1].a) + Math.cos(pieces[1].a)),
        color,
        lineWidth
      );

      // Drawing third piece of the ship
      this.drawLine(
        pieces[2].x -
          pieces[2].r *
            ((2 / 3) * Math.cos(pieces[2].a) - Math.sin(pieces[2].a)),
        pieces[2].y +
          pieces[2].r *
            ((2 / 3) * Math.sin(pieces[2].a) + Math.cos(pieces[2].a)),
        pieces[2].x + (4 / 3) * pieces[2].r * Math.cos(pieces[2].a),
        pieces[2].y - (4 / 3) * pieces[2].r * Math.sin(pieces[2].a),
        color,
        lineWidth
      );
    }

    //Developer Tools
    //Draw Ship Center dot
    if (SHOW_CENTER_DOT) {
      this.context.fillStyle = 'red';
      this.context.fillRect(this.x - 1, this.y - 1, 2, 2);
    }

    // Draw bounding circle for ship collision detection
    if (SHOW_BOUNDING) {
      this.context.strokeStyle = 'lime';
      this.context.lineWidth = this.size / 20; // SHIP_SIZE / 10
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      this.context.stroke();
    }
  }

  //Function for drawing a single line between two points.
  drawLine(x1, y1, x2, y2, color, lineWidth) {
    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.closePath();
    this.context.stroke();
  }
}
export default Ship;
