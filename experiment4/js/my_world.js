
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

function p3_preload() {}

function p3_setup() {}

let worldSeed;

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

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

// Track the number of found lighthouses
let lighthouseCount = 0;

// Add a function to randomly decide if a tile contains lighthouse
function isLighthouseTile(i, j) {
  // Seed for consistent randomness
  let seed = XXH.h32("lighthouse:" + [i, j], worldSeed);
  // console.log(`Tile (${i}, ${j}): Seed=${seed}`);
  // Adjust the probability to change the frequency of lighthouse appearances
  let isLighthouse = seed % 90 === 0;

  return isLighthouse;
}

function p3_drawTile(i, j) {
  noStroke();

  let isLighthouse = isLighthouseTile(i, j);
  let key = i + "," + j;

  // Generate a noise value for this tile
  let noiseValue = noise(i * 0.1, j * 0.1); // Adjust the scale to change the appearance of the noise
  let tileColor;
  // Map the noise value to a blue color scale for ocean depth
  if (isLighthouse) {
    // If the tile has a lighthouse, use the sand color
    tileColor = color(80, 80, 80); // Sand color
  } else {
    // Otherwise, use the normal ocean depth color
    let blueIntensity = lerp(0, 70, noiseValue); // Interpolate between dark and light blue based on noise
    tileColor = color(0, 0, blueIntensity);
  }

  // If the tile is a clicked "" tile, color it bright blue
  if (clicks[key] && isLighthouse) {
    tileColor = color(0, 0, 255); // Bright Blue
  } else {
    // Check all tiles within a 3x3 area centered on the current tile for lighthouse effect
    let maxIntensity = 0;
    for (let dx = -4; dx <= 4; dx++) {
      for (let dy = -4; dy <= 4; dy++) {
      
        let neighborKey = (i + dx) + "," + (j + dy);
        if (clicks[neighborKey] && isLighthouseTile(i + dx, j + dy)) {
          let distance = Math.sqrt(dx * dx + dy * dy);
          let intensityContribution = Math.max(0, 255 - Math.floor(distance * 40)); // Decrease intensity with distance
          maxIntensity = Math.max(maxIntensity, intensityContribution);
        }
      }
    }
    // Apply the lighthouse effect if any
    let originalBlue = blue(tileColor);  // Get the blue component of the current tile color
    if (maxIntensity > originalBlue) {  // Check if the original blue value is darker than a threshold
      tileColor = color(0, 0, maxIntensity);  // Apply new color only if original is dark enough
    }
  }

  // Calculate the vertical offset based on a sine wave
  let wavePhase = frameCount / 20 + (i * 0.5) + (j * 0.5); // Adjust phase to make the movement more natural
  let waveAmplitude = 3; // Amplitude of the wave motion
  let yOffset = sin(wavePhase) * waveAmplitude;


  fill(tileColor); // Set the fill color based on the conditions above

  push();
  translate(0, yOffset); // Apply the calculated vertical offset here
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);


  if (isLighthouse) {
    fill(color(255, 224, 0));
    rect(-5, -6, 10, 20); // Body
    fill(color(255, 255, 255));
    ellipse(0, -8, 10, 10); // Head
  }

  pop();
}







function p3_tileClicked(i, j) {
  let key = i + "," + j; // Use a string key for object mapping

  if (clicks[key] === true) {
    return false;
  }


  if (isLighthouseTile(i, j)) {
    
    lighthouseCount++;
   
    clicks[key] = true;
    // Update UI with the new count
    updateLighthouseCountUI();
    return true; 
  }

 
  clicks[key] = clicks[key] ? clicks[key] + 1 : 1;
  return false; 
}


function updateLighthouseCountUI() {
  // Display the count on the screen
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("Lighthouses found: " + lighthouseCount, 20, 20);
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