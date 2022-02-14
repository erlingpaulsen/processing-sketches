// Parameters
let x_0 = 0.5;
let R_min = 3.4;
let R_max = 4.0;
let R_step = 0.0001;
let R_i;
let n = 500;
let k = 200;
let alpha = 10;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, height, 100, 100, 100);
  background(0);
  noFill();
  R_i = R_min;
}

function draw() {
  if (R_i <= R_max) {
    for (let j = 0; j < 15; j++) {
      let bifurcation = log_map(x_0, R_i, n).slice(k);
      
      for(let i = 0; i < bifurcation.length; i++) {
        xi = map(R_i, R_min, R_max, 0, width);
        yi = map(bifurcation[i], 0, 1, 0, height);
        stroke(yi, 100, 100, alpha);
        point(xi, yi);
      }
      
      R_i += R_step;
    }
  }
}

// Logistic map function
function log_map(x_0, R, n) {
  let xs = [];

  let x_n = x_0;
  for(i = 0; i < n + 1; i++) {
    xs.push(x_n);
    x_n = float(R) * float(x_n) * (1 - float(x_n));
  }

  return xs;
}
