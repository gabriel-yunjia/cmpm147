"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/
5

let zoom = 1;
let worldSeed;
let tilewidth = 140 * zoom;
let tileheight= 20 * zoom;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return tilewidth;
}
function p3_tileHeight() {
  return tileheight;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}


function p3_drawTile(i, j) {
  
  noStroke();


  let tileHash = XXH.h32("tile-bg:" + [i, j], worldSeed).toNumber();
  let noiseVal = (tileHash % 1000) / 1000; // Convert hash to a 0-1 range
  let bgColor = map(noiseVal, 0, 1, 0, 30); // Dark background for space
  fill(bgColor, bgColor, bgColor + 20, 200); // Slight blue tint

  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Generate static stars
  drawStars(i, j, tileHash);

  // Add occasional circular areas of red tiles
  drawRedCircles(i, j, tileHash);

  // Add occasional planets
  drawPlanets(i, j, tileHash);

  // Add occasional UFOs
  drawUFOs(i, j, tileHash);

  pop();
}

function drawPlanets(i, j, hash) {
  // Define the probability of a planet appearing (e.g., 1 in 200 tiles)
  let planetProbability = 0.005;

  // Use a deterministic hash to decide if this tile should have a planet
  let planetHash = XXH.h32("planet:" + [i, j], hash).toNumber();
  let shouldDrawPlanet = planetHash < planetProbability * 0xFFFFFFFF;

  if (shouldDrawPlanet) {
    // Determine the color of the planet
    let planetColor;
    switch (planetHash % 5) {
    case 0: // Red
      planetColor = color(255, 0, 0);
      break;
    case 1: // Blue
      planetColor = color(0, 0, 255);
      break;
    case 2: // Pink
      planetColor = color(255, 192, 203);
      break;
    case 3: // Green
      planetColor = color(0, 255, 0);
      break;
    case 4: // Orange
      planetColor = color(255, 165, 0);
      break;
    default:
      planetColor = color(255); // White (fallback)
      break;
    }

    let planetSize = tw * 0.75; // Static size, adjust as needed

    let planetX = 0;
    let planetY = 0;


    fill(planetColor);
    ellipse(planetX, planetY, planetSize, planetSize);


    if (planetHash % 10 == 0) { // Example condition for planets with rings
      drawPlanetRing(planetX, planetY, planetSize);
    }
  }
}

function drawPlanetRing(x, y, size) {
  // Define ring properties
  let ringColor = color(255, 255, 255, 100); // White with transparency
  let ringThickness = size * 0.1; // Ring thickness as a percentage of planet size

  // Draw the ring
  noFill();
  stroke(ringColor);
  strokeWeight(ringThickness);
  ellipse(x, y, size * 1.5, size * 1.5); // Adjust the multiplier for ring size
}

function drawRedCircles(i, j, hash) {
  // Define the probability of a red circle appearing (e.g., 1 in 100 tiles)
  let redCircleProbability = 0.01;
  
  // Use a deterministic hash to decide if this tile should have a red circle
  let circleHash = XXH.h32("red-circle:" + [i, j], hash).toNumber();
  let shouldDrawRedCircle = circleHash < redCircleProbability * 0xFFFFFFFF;

  if (shouldDrawRedCircle) {
    // Define the size of the red circle
    let circleSize = tw * 1.5; // Static size, adjust as needed

    // Define the position of the red circle (centered in the tile)
    let circleX = 0;
    let circleY = sin(millis() / 5000) * (circleSize * 0.2);

    // Apply an animated gradient fill to create a moving effect within the circle
    fill(255,0,0);

    // Draw the red circle
    ellipse(circleX, circleY, circleSize, circleSize);
  }
}

// Function to apply a radial gradient fill
function radialGradient(x, y, colors, radius, cx, cy) {
  let halfColors = Math.floor(colors.length / 2);
  for (let i = 0; i < halfColors; i++) {
    let gradient = drawingContext.createRadialGradient(x, y, 0, cx, cy, radius * 2);
    gradient.addColorStop(0, colors[i]);
    gradient.addColorStop(1, colors[colors.length - i - 1]);
    drawingContext.fillStyle = gradient;
    drawingContext.beginPath();
    drawingContext.arc(x, y, radius, 0, TWO_PI);
    drawingContext.fill();
  }
}

function drawUFOs(i, j, hash) {
  // Define the probability of a UFO appearing (e.g., 1 in 200 tiles)
  let ufoProbability = 0.005;

  // Use a deterministic hash to decide if this tile should have a UFO
  let ufoHash = XXH.h32("ufo:" + [i, j], hash).toNumber();
  let shouldDrawUFO = ufoHash < ufoProbability * 0xFFFFFFFF;

  if (shouldDrawUFO) {
    // Define the size of the UFO
    let ufoSize = tw * 0.75; // Static size, adjust as needed

    // Define the position of the UFO
    let ufoX = 0;
    let ufoY = sin(millis() / 1000) * (ufoSize * 0.2); // Adjust the amplitude for the floating motion

    // Draw the UFO body (grey ellipse)
    fill(150); // Grey color
    ellipse(ufoX, ufoY, ufoSize, ufoSize * 0.3); // UFO body

    // Draw the blue glass circle in the middle
    fill(173, 216, 230); // Light blue color
    ellipse(ufoX, ufoY - ufoSize * 0.1, ufoSize * 0.6, ufoSize * 0.2); // Blue glass circle

    // Draw lights on the UFO
    fill(255, 0, 0); // Red color
    ellipse(ufoX - ufoSize * 0.25, ufoY - ufoSize * 0.15, ufoSize * 0.1); // Red light
    fill(0, 0, 255); // Blue color
    ellipse(ufoX + ufoSize * 0.25, ufoY - ufoSize * 0.15, ufoSize * 0.1); // Blue light
  }
}

function drawStars(i, j, hash) {
  let starHash = hash;
  let starCount = starHash % 5 + 1; // Deterministic number of stars (1 to 5)
  for (let n = 0; n < starCount; n++) {
    starHash = XXH.h32("star:" + [i, j, n], starHash).toNumber(); // Rehash for each star
    let starX = (starHash % 100) / 100 * tw - tw / 2;
    let starY = ((starHash / 100) % 100) / 100 * th - th / 2;
    let starSize = ((starHash / 10000) % 3) + 1; // Star size between 1 and 3
    let starBrightness = 200 + (starHash % 55); // Brightness between 200 and 255
    fill(starBrightness);
    ellipse(starX, starY, starSize, starSize);
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}

function registerMouseWheelHandler() {
  canvas.addEventListener('wheel', function(event) {
    console.log('Wheel event triggered'); // Check if the event is triggered
    let deltaY = event.deltaY;
    console.log('deltaY:', deltaY); // Check the deltaY value
    if (deltaY < 0 && zoom < 5) {
      zoom *= 1.1;
      console.log('Zoomed In:', zoom); // Log zoom level after zooming in
    } else if (deltaY > 0 && zoom > 0.2) {
      zoom /= 1.1;
      console.log('Zoomed Out:', zoom); // Log zoom level after zooming out
    }
    event.preventDefault();
  }, { passive: false });
}