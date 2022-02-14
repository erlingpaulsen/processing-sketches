let epsilon = 0.00001;
let C0, A0, An;
let circles = [];
let checkedCombs = [];
let k = 4;
let n = 0;
let iterations = 7;

function setup() {
  createCanvas(1200, 1200);
  frameRate(2);
  background(0);
  colorMode(HSB, 100, 100, 100, 100);
  noStroke();
  fill(7.3 + n*1.8, 100, 100, 90);
  
  // Create and draw initial circles
  C0 = {x: 0, y: 0, r: 1, s: -1};
  //A0 = PI*pow(C0.r, 2);
  //An = 0;
  circles.push(C0);
  createInitialCircles(k);
  for (let i = 0; i < circles.length; i++) {
    if (i > 0) {
      ellipse(map(circles[i].x, -1, 1, 0, width), map(circles[i].y, -1, 1, 0, height), 2*map(circles[i].r, 0, 1, 0, width/2));
    }
  }
  n++;
}

function draw() {
  if (n < iterations) {
    fill(7.3 + n*1.8, 100, 100, 90);
    
    // Find each comibnation of three mutually tangent circles
    let combs = k_combinations(circles, 3);
    
    // For each combination of three circles
    for (let c of combs) {
      // Check if we have not processed this combination previously
      if (!checkedCombs.includes(c)) {
        // Compute the two circles mutually tangent to the three circles (Apollonius' problem)
        let circlePair = computeMutuallyTangentCircle(c[0], c[1], c[2]);
        
        // Only draw and add the new circles to the list if they are unique and smaller than the three input circles
        if (!isCircleInList(circlePair[0], circles)[0] && circlePair[0].r < c[0].r && circlePair[0].r < c[1].r && circlePair[0].r < c[2].r) {
          circles.push(circlePair[0]);
          //An += PI*pow(circlePair[0].r, 2);
          ellipse(map(circlePair[0].x, -1, 1, 0, width), map(circlePair[0].y, -1, 1, 0, height), 2*map(circlePair[0].r, 0, 1, 0, width/2));
          
          if (n == iterations - 1) {
            checkedCombs.push([c[0], c[1], circlePair[0]]);
            checkedCombs.push([c[0], c[2], circlePair[0]]);
            checkedCombs.push([c[1], c[2], circlePair[0]]);
          }
        }
        if (!isCircleInList(circlePair[1], circles)[0] && circlePair[1].r < c[0].r && circlePair[1].r < c[1].r && circlePair[1].r < c[2].r) {
          circles.push(circlePair[1]);
          //An += PI*pow(circlePair[1].r, 2);
          ellipse(map(circlePair[1].x, -1, 1, 0, width), map(circlePair[1].y, -1, 1, 0, height), 2*map(circlePair[1].r, 0, 1, 0, width/2));
          
          if (n == iterations - 1) {
            checkedCombs.push([c[0], c[1], circlePair[1]]);
            checkedCombs.push([c[0], c[2], circlePair[1]]);
            checkedCombs.push([c[1], c[2], circlePair[1]]);
          }
        }
        // Add the combination to a list, so that we don't compute it again
        checkedCombs.push(c);
      }
    }
    //print("An: " + An);
    //let Adiff = A0 - An;
    //print("A0 - An: " + Adiff);
    n++;
  } else {
    /*noFill();
    strokeWeight(5);
    stroke(0, 0, 0, 100);
    for (let c of circles) {
      point(map(c.x, -1, 1, 0, width), map(c.y, -1, 1, 0, height));
    }*/
    /*stroke(10, 20, 100, 10);
    for (let i = 1; i < 9; i++) {
      stroke(2*i, 10, 100, 10);
      for (let j = i; j < circles.length; j++) {
        line(map(circles[i].x, -1, 1, 0, width), map(circles[i].y, -1, 1, 0, height), map(circles[j].x, -1, 1, 0, width), map(circles[j].y, -1, 1, 0, height));
      }
    }*/
    /*
    stroke(10, 30, 90, 20);
    for (let c of checkedCombs) {
      line(map(c[0].x, -1, 1, 0, width), map(c[0].y, -1, 1, 0, height), map(c[1].x, -1, 1, 0, width), map(c[1].y, -1, 1, 0, height));
      line(map(c[0].x, -1, 1, 0, width), map(c[0].y, -1, 1, 0, height), map(c[2].x, -1, 1, 0, width), map(c[2].y, -1, 1, 0, height));
      line(map(c[1].x, -1, 1, 0, width), map(c[1].y, -1, 1, 0, height), map(c[2].x, -1, 1, 0, width), map(c[2].y, -1, 1, 0, height));
    }*/
    print("done");
    noLoop();
  }
}

/*
  Get k-sized combinations of mutually tangent circles
*/
function k_combinations(set, k) {
  let i, j, combs, head, tailcombs;
  
  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }
  
  // K-sized set has only one K-sized subset.
  if (k == set.length) {
    return [set];
  }
  
  // There is N 1-sized subsets in a N-sized set.
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    head = set.slice(i, i + 1);
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j++) {
      // Only add the combination if the member circles are mutually tangent
      // This greatly improves performance, as most combinations are never returned
      if (isMutuallyTangent2C(head[0], tailcombs[j][0])) {
        if (tailcombs[j].length == 2) {
          if (isMutuallyTangent3C(head[0], tailcombs[j][0], tailcombs[j][1])) {
            combs.push(head.concat(tailcombs[j]));
          }
        } else {
          combs.push(head.concat(tailcombs[j]));
        }
      }
    }
  }
  return combs;
}

/*
  Creates the first set of k inscribed circles, with the centers equally spaced around the center of C0
*/
function createInitialCircles(k) {
  if (k == 2) {
    let C1 = {x: 1/2, y: 0, r: 1/2, s: 1};
    let C2 = {x: -1/2, y: 0, r: 1/2, s: 1};
    //let A1 = PI*pow(C1.r, 2);
    //let A2 = PI*pow(C2.r, 2);
    //An = An + A1 + A2;
    circles.push(C1);
    circles.push(C2);
  } else if (k == 3) {
    
  } else if (k == 4) {
    let r = 1/(1 + sqrt(2));
    let r2 = 1 - 2*r;
    let C1 = {x: 1 - r, y: 0, r: r, s: 1};
    let C2 = {x: r - 1, y: 0, r: r, s: 1};
    let C3 = {x: 0, y: 1 - r, r: r, s: 1};
    let C4 = {x: 0, y: r - 1, r: r, s: 1};
    let C5 = {x: 0, y: 0, r: r2, s: 1};
    circles.push(C1);
    circles.push(C2);
    circles.push(C3);
    circles.push(C4);
    circles.push(C5);
  }
}

/*
  Checks if two circles are equal based on its center, as no two circles will have the same center
  Based on the circle center and a threshold epsilon
*/
function isEqualCircle(C1, C2) {
  return (abs(C1.x - C2.x) + abs(C1.y - C2.y) < epsilon);
}

/*
  Checks if the circle C is already present in the list circles
  Based on the circle center and a threshold epsilon
*/
function isCircleInList(C, circles) {
  let hit = 0;
  let index = -1;
  for (let i = 0; i < circles.length; i++) {
    if (isEqualCircle(C, circles[i])) {
      hit = 1;
      index = i;
    }
  }
  return [hit, index];
}

/*
  Checks if two circles are mutually tangent within a threshold epsilon
*/
function isMutuallyTangent2C(C1, C2) {
  let s = C1.s * C2.s;
  let A = pow(C1.x - C2.x, 2);
  let B = pow(C1.y - C2.y, 2);
  let C = pow(C1.r + (s * C2.r), 2);
  
  if (abs(A + B - C) < epsilon) {
    return 1;
  } else {
    return 0;
  }
}

/*
  Checks if three circles are mutually tangent by using isMutuallyTangent2C
*/
function isMutuallyTangent3C(C1, C2, C3) {
  return (isMutuallyTangent2C(C1, C2) && isMutuallyTangent2C(C1, C3) && isMutuallyTangent2C(C2, C3));
}

/* 
  Solves the set of algebraic equations for three circles mutually tangent to a fourth one
  (1) (xs - x1)^2 + (ys - y1)^2 = (rs + s1*r1)^2
  (2) (xs - x2)^2 + (ys - y2)^2 = (rs + s2*r2)^2
  (3) (xs - x3)^2 + (ys - y3)^2 = (rs + s3*r3)^2

  s = 1  (externally tangent)
  s = -1 (internally tangent)
*/
function computeMutuallyTangentCircle(C1, C2, C3) {
  let C4 = {x: null, y: null, r: null, s: 1};
  let C5 = {x: null, y: null, r: null, s: 1};
  
  
  // Compute constants from the resultants, i.e the two equations (1) - (2) and (2) - (3)
  let A12 = C2.x - C1.x;
  let A23 = C3.x - C2.x;
  let B12 = C2.y - C1.y;
  let B23 = C3.y - C2.y;
  let C12 = C1.s*C1.r - C2.s*C2.r;
  let C23 = C2.s*C2.r - C3.s*C3.r;
  let D12 = 0.5 * (pow(C1.x, 2) - pow(C2.x, 2) + pow(C1.y, 2) - pow(C2.y, 2) - pow(C1.r, 2) + pow(C2.r, 2));
  let D23 = 0.5 * (pow(C2.x, 2) - pow(C3.x, 2) + pow(C2.y, 2) - pow(C3.y, 2) - pow(C2.r, 2) + pow(C3.r, 2));
  
  eq1 = (abs(C1.x - C2.x) + abs(C1.x - C3.x) + abs(C2.x - C3.x) < epsilon);
  eq2 = (abs(C1.y - C2.y) + abs(C1.y - C3.y) + abs(C2.y - C3.y) < epsilon);
  
  if (eq1) {
    // Special case where all three cirlces share the same x coordinate
    C4.r = abs((B23*D12 - B12*D23)/(B23*C12 - B12*C23));
    C5.r = r4;
    C4.y = (C23*C4.r - D23)/B23;
    C5.y = C4.y;
    let F = pow(C1.x, 2) + pow(C4.y -  C1.y, 2) - pow(C4.r + C1.s*C1.r, 2);
    C4.x = C1.x + sqrt(pow(C1.x, 2) - F);
    C5.x = C1.x - sqrt(pow(C1.x, 2) - F);
   
  } else if (eq2) {
    // Special case where all three cirlces share the same y coordinate
    C4.r = abs((A12*D23 - A23*D12)/(A23*C12 - A12*C23));
    C5.r = C4.r;
    C4.x = (C12*C4.r - D12)/A12;
    C5.x = C4.x;
    let E = pow(C1.y, 2) + pow(C4.x -  C1.x, 2) - pow(C4.r + C1.s*C1.r, 2);
    C4.y = C1.y + sqrt(pow(C1.y, 2) - E);
    C5.y = C1.y - sqrt(pow(C1.y, 2) - E);
    
  } else {
    /*
      Compute constans M, N, Q and P to be used in the equations:
      (4) xs = M + N*rs
      (5) ys = P + Q*rs
    */
    let M = (B12*D23 - B23*D12)/(A12*B23 - B12*A23);
    let N = (B23*C12 - B12*C23)/(A12*B23 - B12*A23);
    let P = (A23*D12 - A12*D23)/(A12*B23 - B12*A23);
    let Q = (A12*C23 - A23*C12)/(A12*B23 - B12*A23);
    
    /*
      Compute constants U, V and W from inserting (4) and (5) in (1) to get equation:
      (6) U*rs^2 + V*rs + W = 0
    */
    let U = pow(N, 2) + pow(Q, 2) - 1;
    let V = 2*(M*N - N*C1.x + P*Q - Q*C1.y - C1.s*C1.r);
    let W = pow(M, 2) + pow(P, 2) + pow(C1.x, 2) + pow(C1.y, 2) - 2*M*C1.x - 2*P*C1.y - pow(C1.r, 2);
    
    /*
      Computing resulting r4 and r5 from the roots of (6)
      (7) r4,r5 = (-V +- sqrt(V^2 - 4*U*W))/2*U
    */
    C4.r = (-V + sqrt(pow(V, 2) - 4*U*W))/(2*U);
    C5.r = (-V - sqrt(pow(V, 2) - 4*U*W))/(2*U);
    
    //Inserting r1 and r2 in (4) and (5) to get x1, y1 and x2, y2
    C4.x = M + N*C4.r;
    C4.y = P + Q*C4.r;
    C5.x = M + N*C5.r;
    C5.y = P + Q*C5.r;
    
  }
  
  return [C4, C5];
}
