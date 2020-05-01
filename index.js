var boxSize = 200;

function setup() {
  let cnv = createCanvas(800, 640, WEBGL);
  cnv.parent("canvas");
  colorMode(HSB, 100);
  while (boids.length < 250) {
    new Boid();
  }
}

function draw() {
  orbitControl();
  background(0,0,15);
  boids.forEach(b => b.update());

  // stroke(50, 100, 100);
  // boids[0].localBoids.forEach(b => {
  //   line(boids[0].pos.x, boids[0].pos.y, boids[0].pos.z,
  //   b.pos.x, b.pos.y, b.pos.z);
  // })
}
