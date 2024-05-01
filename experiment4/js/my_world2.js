"use strict";

/* global XXH, noiseSeed, randomSeed, noise, fill, noStroke, push, beginShape, vertex, endShape, pop, rect, ellipse, textSize, textAlign, LEFT, text, stroke, background, color, lerpColor, frameCount, sin, translate, vertexMode, dist, rectMode, CENTER, triangle, constrain */

let worldSeed;
let [tw, th] = [p3_tileWidth(), p3_tileHeight()];
let clicks = {};
let ripples = {}; // Object to store ripple effects

function p3_preload() {}

function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 16;
}

function p3_tileHeight() {
  return 16;
}



function p3_tileClicked(i, j) {
  let key = [i, j].toString();
  clicks[key] = 1 + (clicks[key] || 0);

  // Add a ripple effect for the clicked tile
  ripples[key] = frameCount;

  // Optionally propagate the ripple effect to neighboring tiles
  propagateRipple(i, j);
}

function propagateRipple(i, j) {
  let rippleRadius = 3;
  for (let dx = -rippleRadius; dx <= rippleRadius; dx++) {
    for (let dy = -rippleRadius; dy <= rippleRadius; dy++) {
      let ni = i + dx;
      let nj = j + dy;
      let nKey = [ni, nj].toString();
      if (!isSandTile(ni, nj)) {  // Only propagate ripples to non-sand tiles
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= rippleRadius) {
          ripples[nKey] = frameCount + Math.floor(distance * 5);
        }
      }
    }
  }
}
function isSandTile(i, j) {
  let noiseVal = noise(i * 0.10, j * 0.1);
  return noiseVal > 0.7; // Use the same threshold as used for drawing sand tiles
}

function p3_drawBefore() {
  background(0, 80, 160); // Set a darker shade of blue for the background
}

function drawBoats(i, j, hash) {
  // Define the probability of a boat appearing (e.g., 1 in 200 tiles)
  let boatProbability = 0.005;

  // Use a deterministic hash to decide if this tile should have a boat
  let boatHash = XXH.h32("boat:" + [i, j], hash).toNumber();
  let shouldDrawBoat = boatHash < boatProbability * 0xFFFFFFFF;

  if (shouldDrawBoat) {
    // Define the size of the boat
    let boatWidth = tw * 0.8;
    let boatHeight = th * 0.4;

    // Define the position of the boat
    let boatX = 0;
    let boatY = 0;

    // Draw the boat body (lower rectangle)
    fill(139, 69, 19); // Brown color for boat body
    rectMode(CENTER);
    rect(boatX, boatY, boatWidth, boatHeight); // Adjust size as needed

    // Draw the mast
    let mastHeight = th * 1.2; // Height of the mast
    let mastWidth = tw * 0.1; // Width of the mast
    let mastX = boatX;
    let mastY = boatY - boatHeight / 2 - mastHeight / 2;
    fill(0); // Black color for mast
    rect(mastX, mastY, mastWidth, mastHeight); // Draw the mast

    // Draw the sail
    let sailWidth = mastWidth * (noise(i,j)*10); // Width of the sail
    let sailHeight = mastHeight * 1.2; // Height of the sail
    let sailX = mastX + mastWidth / 2;
    let sailY = mastY - sailHeight / 2;
    fill(255); // White color for sail
    triangle(
      sailX, sailY,
      sailX - sailWidth / 2, sailY + sailHeight / 2,
      sailX + sailWidth / 2, sailY + sailHeight / 2
    ); // Draw the sail
  }
}

function p3_drawTile(i, j) {
  noStroke();
  let key = [i, j].toString();

  // Base colors and existing animation logic
  let baseDeepBlue = color(0, 0, 200);
  let baseShallowBlue = color(100, 200, 255);
  let timeShift = sin(frameCount * 0.02);
  let depthShift = map(timeShift, -1, 1, 0.8, 1.2);
  let deepBlue = color(red(baseDeepBlue) * depthShift, green(baseDeepBlue) * depthShift, blue(baseDeepBlue) * depthShift);
  let shallowBlue = color(red(baseShallowBlue) * depthShift, green(baseShallowBlue) * depthShift, blue(baseShallowBlue) * depthShift);

  let noiseVal = noise(i * 0.05, j * 0.05);
  let tileColor = lerpColor(deepBlue, shallowBlue, noiseVal);

  // Check for sand tile
  let isSand = noise(i * 0.1, j * 0.1) > 0.7;
  if (isSand) {
    tileColor = color(210, 180, 140);  // Sand color
  }

  // Ripple effects
  if (ripples[key] && frameCount - ripples[key] < 10 && !isSand) {
    let rippleFactor = sin((frameCount - ripples[key]) * 0.1) * 5;
    tileColor = lerpColor(tileColor, color(200, 200, 255), Math.abs(rippleFactor) * 0.3);
  }

  // Calculate the wave effect for positional movement
  let waveAmplitude = 3;  // Amplitude of the wave movement
  let waveSpeed = 0.05;  // Speed of the wave
  let offsetX = sin(frameCount * waveSpeed + i * 0.2) * waveAmplitude;  // Horizontal wave
  let offsetY = cos(frameCount * waveSpeed + j * 0.2) * waveAmplitude;  // Vertical wave

  fill(tileColor);
  push();
  translate(offsetX, offsetY);  // Apply the wave movement
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  drawBoats(i, j, worldSeed);
  pop();
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
}

function p3_drawAfter() {}
