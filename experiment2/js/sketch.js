/* exported setup, draw */
let seed = 0;

// Color pallette
const tree1 = "#042414";
const tree2 = "#1a4d39";
const mountain1 = "#5e9381";
const mountain2 = "#73a697";
const mountain3 = "#87b4a7";
const skyColorTop = "#6ed3da";
const skyColorBottom = "#d8e0c9";




function setup() {
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

 $("#reimagine-button").click(() => seed++);
 
}

 

function draw() {
  randomSeed(seed);
  background(100);
  
  noStroke();
  
  //sky color
  for (let y = 0; y < height / 2; y++) {
    let inter = map(y, 0, height / 2, 0, 1); // Calculate the interpolation value
    let c = lerpColor(color(skyColorTop), color(skyColorBottom), inter); // Interpolate between two colors
    stroke(c); // Set the current color as the stroke color
    line(0, y, width, y); // Draw a horizontal line across the canvas
  }
  
  const scrub = mouseX/width;
  
  //Moutains
  noStroke();
  fill(mountain3);
  beginShape();
  vertex(0, height);
  const steps = 10;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y =
      height / 2 - (random() * random() * random() * height) / 4 - height / 50;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  fill(mountain2);
  beginShape();
  vertex(0, height);  
  const m2steps = 20;
  for (let i = 0; i < m2steps + 1; i++) {
    let x = (width * i) / m2steps;
    let y = (height * 0.6) - (random() * random() * random() * (height - (height * 0.6))) - height / 50;
    vertex(x, y);
  }
  vertex(width, height);  // End at the same higher y value
  endShape(CLOSE);
  
  fill(mountain1);
  beginShape();
  vertex(0, height); 
  const m3steps = 30;
  for (let i = 0; i < m3steps + 1; i++) {
    let x = (width * i) / m2steps;
 
    let y = (height * 0.7) - (random() * random() * random() * (height - (height * 0.7))) - height / 50;
    vertex(x, y);
  }
  vertex(width,height);  // End at the same higher y value
  endShape(CLOSE);

  fill(tree2);
  beginShape()
  for (let i = 0; i < 4000; i++) {
    noStroke();
    let t2z = random(-3,1);
    let t2x = width * ((random() + (scrub/50 + millis() / 500000.0) / 0.1) % 1);
    let t2s = width / 50 / 0.2;
    let t2y = (height / 2 + height / 20 + (height*.5)) / t2z  ;
    triangle(t2x, t2y - t2s - random ((height*.1), (height*.4)), t2x - t2s / 4, t2y, t2x + t2s / 4, t2y);
  }
  endShape(CLOSE);
  fill(tree1);

  for (let i = 0; i < 2000; i++) {
    noStroke();
    let t1z = random(-5,1);
    let t1x = width * ((random() + (scrub/50 + millis() / 500000.0) / 0.1) % 1);
    let t1s = width / 50 / 0.2;
    let t1y = (height / 2 + height / 20 + (height*.45)) / t1z ;
    triangle(t1x, t1y - t1s - random(0,(height*.25)), t1x - t1s / 4, t1y, t1x + t1s / 4, t1y);
  }

  
}
