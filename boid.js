var boids = [];

class Boid {
  constructor() {
    this.pos = p5.Vector.random3D().mult(300);
    this.vel = p5.Vector.random3D().mult(2);//createVector(0,0,0);
    this.acc = createVector(0,0,0);
    boids.push(this);
    this.localBoids = [];
  }

  draw() {
    stroke(0, 70, 100);
    noFill();
    box(boxSize*2);
    noStroke();
    fill((this.localBoids.length / boids.length) * 90, 70, 70);

    push();
      let r = Math.sqrt(this.vel.x * this.vel.x + this.vel.z * this.vel.z)
      let phi = atan2(this.vel.y, this.vel.z);
      let theta = atan2(this.vel.z, this.vel.x);
      translate(this.pos.x, this.pos.y, this.pos.z);
      rotateZ(-PI/2);
      rotateZ(phi);
      rotateX(theta);

      cone(3,10);
    pop();
  }

  getLocalBoids() {
    this.localBoids = [];
    boids.forEach(b => {
      if (p5.Vector.sub(this.pos, b.pos).mag() < 200) {
        this.localBoids.push(b);
      }
    })
  }

  calcForces() {
    this.acc = createVector(0,0,0);
    this.congregateForce();
    this.separationForce();
    this.alignmentForce();
  }

  congregateForce() {
    let centerOfMass = createVector(0,0,0);
    this.localBoids.forEach(b => centerOfMass.add(b.pos));
    centerOfMass.div(this.localBoids.length);

    let congregateForce = p5.Vector.sub(centerOfMass, this.pos);

    this.acc.add(congregateForce.mult(0.001));
  }

  separationForce() {
    this.localBoids.forEach(b => {
      let separationConstant = 1000;
      let r = p5.Vector.sub(this.pos, b.pos);
      let m = r.mag();

      if (m > 0) {
        r.normalize();
        r.mult(separationConstant / (m*m));
        this.acc.add(r.mult(0.0001));
      }
    });
  }

  alignmentForce() {
    let headingConstant = .00001;
    let averageHeading = createVector(0,0,0);
    this.localBoids.forEach(b => averageHeading.add(b.vel));
    averageHeading.div(this.localBoids.length);
    averageHeading.normalize();
    let headingAdjustment = p5.Vector.sub(averageHeading, this.vel);
    headingAdjustment.mult(headingConstant);
    this.acc.add(headingAdjustment);
  }

  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    if (this.pos.x > boxSize) { this.vel.x = min(this.vel.x, 0); }
    if (this.pos.x < -boxSize) { this.vel.x = max(this.vel.x, 0); }
    if (this.pos.y > boxSize) { this.vel.y = min(this.vel.y, 0); }
    if (this.pos.y < -boxSize) { this.vel.y = max(this.vel.y, 0); }
    if (this.pos.z > boxSize) { this.vel.z = min(this.vel.z, 0); }
    if (this.pos.z < -boxSize) { this.vel.z = max(this.vel.z, 0); }

  }

  update() {
    this.getLocalBoids();
    this.calcForces();
    this.move();
    this.draw();
  }
}
