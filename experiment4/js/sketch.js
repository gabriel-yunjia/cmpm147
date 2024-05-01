// // project.js - Alternate Worlds
// // Author: Brayden Smith
// // Date: 4/23/24

// // consulted chatgpt & professors grey starter code

// let canvasContainer;
// var centerHorz, centerVert;

// const w1 = (sketch) => {

//   let tile_width_step_main; // A width step is half a tile's width
//   let tile_height_step_main; // A height step is half a tile's height

//   // Global variables. These will mostly be overwritten in setup().
//   let tile_rows, tile_columns;
//   let camera_offset;
//   let camera_velocity;

//   let waldoCountElement;
//   let waldosFound = 0;

//   /////////////////////////////
//   // Transforms between coordinate systems
//   // These are actually slightly weirder than in full 3d...
//   /////////////////////////////
//   function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
//     let i = (world_x - world_y) * tile_width_step_main;
//     let j = (world_x + world_y) * tile_height_step_main;
//     return [i + camera_x, j + camera_y];
//   }

//   function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
//     let i = (world_x - world_y) * tile_width_step_main;
//     let j = (world_x + world_y) * tile_height_step_main;
//     return [i, j];
//   }

//   function tileRenderingOrder(offset) {
//     return [offset[1] - offset[0], offset[0] + offset[1]];
//   }

//   function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
//     screen_x -= camera_x;
//     screen_y -= camera_y;
//     screen_x /= tile_width_step_main * 2;
//     screen_y /= tile_height_step_main * 2;
//     screen_y += 0.5;
//     return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
//   }

//   function cameraToWorldOffset([camera_x, camera_y]) {
//     let world_x = camera_x / (tile_width_step_main * 2);
//     let world_y = camera_y / (tile_height_step_main * 2);
//     return { x: Math.round(world_x), y: Math.round(world_y) };
//   }

//   function worldOffsetToCamera([world_x, world_y]) {
//     let camera_x = world_x * (tile_width_step_main * 2);
//     let camera_y = world_y * (tile_height_step_main * 2);
//     return new p5.Vector(camera_x, camera_y);
//   }

//   function preload() {
//     if (window.p3_preload) {
//       window.p3_preload();
//     }
//   }

//   let bodyColors = [];

//   sketch.setup = () => {
//     sketch.seed = 1109;
//     sketch.tilesetImage;
//     sketch.currentGrid = [];
//     sketch.numRows, sketch.numCols;

//     sketch.numCols = sketch.select("#asciiBoxDungeon").attribute("cols") | 0;
//     sketch.numRows = sketch.select("#asciiBoxDungeon").attribute("rows") | 0;
//     // place our canvas, making it fit our container
//     canvasContainer = $("#canvasContainer-2");
//     sketch.canvas = sketch.createCanvas(
//       16 * sketch.numCols,
//       16 * sketch.numRows
//     );
//     sketch.canvas.parent("canvasContainer-2");

//     sketch.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

//     sketch.select("#reseedButtonDungeon").mousePressed(sketch.reseed);
//     sketch.select("#asciiBoxDungeon").input(sketch.reparseGrid);

//     sketch.reseed();
//   };

//   sketch.setup = () => {
//     let canvas = createCanvas(800, 400);
//     canvas.parent("container");

//     camera_offset = new p5.Vector(-width / 2, height / 2);
//     camera_velocity = new p5.Vector(0, 0);

//     if (window.p3_setup) {
//       window.p3_setup();
//     }

//     let label = createP();
//     label.html("World key: ");
//     label.parent("container");

//     let input = createInput("xyzzy");
//     input.parent(label);
//     input.input(() => {
//       rebuildWorld(input.value());
//     });

//     createP("Arrow keys scroll. Clicking changes tiles.").parent("container");

//     rebuildWorld(input.value());

//     waldoCountElement = createP("Waldos found: 0");
//     waldoCountElement.parent("container");

//     bodyColors = [];

//     // Define the body colors
//     bodyColors.push(color(255, 0, 0)); // Red
//     bodyColors.push(color(0, 255, 0)); // Green
//     bodyColors.push(color(0, 0, 255)); // Blue
//     bodyColors.push(color(255, 255, 0)); // Yellow
//     bodyColors.push(color(255, 0, 255)); // Magenta
//     bodyColors.push(color(0, 255, 255)); // Cyan
//     bodyColors.push(color(255, 128, 0)); // Orange
//     bodyColors.push(color(128, 0, 255)); // Purple
//     bodyColors.push(color(0, 255, 128)); // Teal
//     bodyColors.push(color(255, 128, 128)); // Light Red
//     bodyColors.push(color(128, 255, 0)); // Lime
//     bodyColors.push(color(0, 128, 255)); // Sky Blue
//     bodyColors.push(color(255, 255, 128)); // Pale Yellow
//     bodyColors.push(color(255, 128, 255)); // Pink
//     bodyColors.push(color(128, 255, 128)); // Light Green
//     bodyColors.push(color(128, 128, 255)); // Light Blue
//     bodyColors.push(color(255, 128, 128)); // Light Red
//     bodyColors.push(color(128, 255, 255)); // Light Cyan
//     bodyColors.push(color(255, 255, 255)); // White
//     bodyColors.push(color(128, 128, 128)); // Gray

//     let rows = tile_rows;
//     let columns = tile_columns;
//     for (let i = 0; i < columns; i++) {
//       bodyColors[i] = []; // Initialize array for each column
//       for (let j = 0; j < rows; j++) {
//         bodyColors[i][j] = random(bodyColors); // Randomly select a body color
//       }
//     }
//   }

//   function rebuildWorld(key) {
//     if (window.p3_worldKeyChanged) {
//       window.p3_worldKeyChanged(key);
//     }
//     tile_width_step_main = window.p3_tileWidth ? window.p3_tileWidth() : 32;
//     tile_height_step_main = window.p3_tileHeight
//       ? window.p3_tileHeight()
//       : 14.5;
//     tile_columns = Math.ceil(width / (tile_width_step_main * 2));
//     tile_rows = Math.ceil(height / (tile_height_step_main * 2));
//   }

//   function mouseClicked() {
//     let world_pos = screenToWorld(
//       [0 - mouseX, mouseY],
//       [camera_offset.x, camera_offset.y]
//     );

//     // Check if the clicked tile contains Waldo
//     if (window.p3_tileClicked) {
//       let isWaldo = window.p3_tileClicked(world_pos[0], world_pos[1]);
//       if (isWaldo) {
//         waldosFound++;
//         // Update the display of Waldos found
//         waldoCountElement.html("Waldos found: " + waldosFound);
//       }
//     }
//     return false;
//   }

//   function draw() {
//     // Keyboard controls!
//     if (keyIsDown(LEFT_ARROW)) {
//       camera_velocity.x -= 1;
//     }
//     if (keyIsDown(RIGHT_ARROW)) {
//       camera_velocity.x += 1;
//     }
//     if (keyIsDown(DOWN_ARROW)) {
//       camera_velocity.y -= 1;
//     }
//     if (keyIsDown(UP_ARROW)) {
//       camera_velocity.y += 1;
//     }

//     let camera_delta = new p5.Vector(0, 0);
//     camera_velocity.add(camera_delta);
//     camera_offset.add(camera_velocity);
//     camera_velocity.mult(0.95); // cheap easing
//     if (camera_velocity.mag() < 0.01) {
//       camera_velocity.setMag(0);
//     }

//     let world_pos = screenToWorld(
//       [0 - mouseX, mouseY],
//       [camera_offset.x, camera_offset.y]
//     );
//     let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

//     background(100);

//     if (window.p3_drawBefore) {
//       window.p3_drawBefore();
//     }

//     let overdraw = 0.1;

//     let y0 = Math.floor((0 - overdraw) * tile_rows);
//     let y1 = Math.floor((1 + overdraw) * tile_rows);
//     let x0 = Math.floor((0 - overdraw) * tile_columns);
//     let x1 = Math.floor((1 + overdraw) * tile_columns);

//     for (let y = y0; y < y1; y++) {
//       for (let x = x0; x < x1; x++) {
//         drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
//           camera_offset.x,
//           camera_offset.y,
//         ]); // odd row
//       }
//       for (let x = x0; x < x1; x++) {
//         drawTile(
//           tileRenderingOrder([
//             x + 0.5 + world_offset.x,
//             y + 0.5 - world_offset.y,
//           ]),
//           [camera_offset.x, camera_offset.y]
//         ); // even rows are offset horizontally
//       }
//     }

//     describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

//     if (window.p3_drawAfter) {
//       window.p3_drawAfter();
//     }
//   }

//   // Display a discription of the tile at world_x, world_y.
//   function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
//     let [screen_x, screen_y] = worldToScreen(
//       [world_x, world_y],
//       [camera_x, camera_y]
//     );
//     drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
//   }

//   function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
//     push();
//     translate(screen_x, screen_y);
//     if (window.p3_drawSelectedTile) {
//       window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
//     }
//     pop();
//   }

//   // Draw a tile, mostly by calling the user's drawing code.
//   function drawTile([world_x, world_y], [camera_x, camera_y]) {
//     let [screen_x, screen_y] = worldToScreen(
//       [world_x, world_y],
//       [camera_x, camera_y]
//     );
//     push();
//     translate(0 - screen_x, screen_y);
//     if (window.p3_drawTile) {
//       window.p3_drawTile(world_x, world_y, -screen_x, screen_y);
//     }
//     pop();
//   }
//   //now we get into solution.js

//   sketch.generateGrid = (numCols, numRows) => {
//     let grid = [];
//     let shapes = [];
//     let chestsPlaced = 0;

//     const isOccupied = (x, y, width, height, shapes) => {
//       for (const shape of shapes) {
//         if (
//           x + width <= shape.startX ||
//           x >= shape.startX + shape.width ||
//           y + height <= shape.startY ||
//           y >= shape.startY + shape.height
//         ) {
//           // No overlap
//         } else {
//           return true; // Overlap detected
//         }
//         if (
//           x + width + 1 >= shape.startX &&
//           x - 1 <= shape.startX + shape.width &&
//           y + height + 1 >= shape.startY &&
//           y - 1 <= shape.startY + shape.height
//         ) {
//           return true; // Adjacent room detected
//         }
//       }
//       return false;
//     };

//     for (let s = 0; s < 3; s++) {
//       let width = Math.floor(sketch.random(3, 7));
//       let height = Math.floor(sketch.random(3, 10));

//       let startX, startY;
//       do {
//         startX = Math.floor(sketch.random(1, numCols - width - 1));
//         startY = Math.floor(sketch.random(1, numRows - height - 1));
//         if (!isOccupied(startX, startY, width, height, shapes)) {
//           shapes.push({ startX, startY, width, height });
//           break;
//         }
//       } while (true);
//     }

//     for (let i = 0; i < numRows; i++) {
//       let row = [];
//       for (let j = 0; j < numCols; j++) {
//         row.push("d");
//       }
//       grid.push(row);
//     }

//     // Placing the shapes
//     for (const shape of shapes) {
//       for (let i = shape.startY; i < shape.startY + shape.height; i++) {
//         for (let j = shape.startX; j < shape.startX + shape.width; j++) {
//           grid[i][j] = "f";
//         }
//       }
//     }

//     // Placing the corridors
//     for (let i = 1; i < shapes.length; i++) {
//       let startX = Math.floor(shapes[i - 1].startX + shapes[i - 1].width / 2);
//       let startY = Math.floor(shapes[i - 1].startY + shapes[i - 1].height / 2);
//       let endX = Math.floor(shapes[i].startX + shapes[i].width / 2);
//       let endY = Math.floor(shapes[i].startY + shapes[i].height / 2);

//       while (startX !== endX) {
//         grid[startY][startX] = "f"; // Using "r" for corridors
//         startX += startX < endX ? 1 : -1;
//       }
//       while (startY !== endY) {
//         grid[startY][startX] = "f"; // Using "r" for corridors
//         startY += startY < endY ? 1 : -1;
//       }
//     }

//     // Randomly place chests in two different rooms
//     let chosenRooms = [];
//     while (chestsPlaced < 2) {
//       let chosenRoomIndex = Math.floor(sketch.random(0, shapes.length));
//       if (!chosenRooms.includes(chosenRoomIndex)) {
//         chosenRooms.push(chosenRoomIndex);
//         let room = shapes[chosenRoomIndex];
//         let chestX = Math.floor(
//           sketch.random(room.startX + 1, room.startX + room.width - 1)
//         );
//         let chestY = Math.floor(
//           sketch.random(room.startY + 1, room.startY + room.height - 1)
//         );
//         grid[chestY][chestX] = "c"; // Placing a chest
//         chestsPlaced++;
//       }
//     }

//     // Outlining the shapes and corridors
//     for (let i = 0; i < numRows; i++) {
//       for (let j = 0; j < numCols; j++) {
//         if (grid[i][j] === "f" || grid[i][j] === "r") {
//           [
//             [-1, 0],
//             [1, 0],
//             [0, -1],
//             [0, 1],
//           ].forEach((offset) => {
//             const ni = i + offset[0];
//             const nj = j + offset[1];
//             if (
//               ni >= 0 &&
//               ni < numRows &&
//               nj >= 0 &&
//               nj < numCols &&
//               grid[ni][nj] === "d"
//             ) {
//               grid[ni][nj] = "o";
//             }
//           });
//         }
//       }
//     }

//     return grid;
//   };

//   let useAlternate = false;
//   let useAlternate2 = false;
//   let lastToggle1 = 0;
//   let lastToggle2 = 0;

//   sketch.drawGrid = (grid) => {
//     sketch.background(128);

//     const currentTime = sketch.millis();

//     if (currentTime - lastToggle1 > 3000) {
//       useAlternate = !useAlternate;
//       lastToggle1 = currentTime;
//     }
//     if (currentTime - lastToggle2 > 1500) {
//       useAlternate2 = !useAlternate2;
//       lastToggle2 = currentTime;
//     }

//     for (let i = 0; i < grid.length; i++) {
//       for (let j = 0; j < grid[i].length; j++) {
//         if (grid[i][j] === "d") {
//           if (useAlternate) {
//             // placeTile(i, j, 16, 4);
//             sketch.placeTile(i, j, Math.floor(sketch.random(1, 4)), 15);
//           } else {
//             // placeTile(i, j, 21, 21); // Empty tile
//             sketch.placeTile(i, j, Math.floor(sketch.random(21, 23)), 21);
//           }
//         } else if (grid[i][j] === "f") {
//           if (useAlternate) {
//             sketch.placeTile(i, j, Math.floor(sketch.random(1, 4)), 19);
//           } else {
//             sketch.placeTile(i, j, Math.floor(sketch.random(4)), 10); // Floor tile
//           }
//         } else if (grid[i][j] === "c") {
//           if (useAlternate2) {
//             sketch.placeTile(i, j, 2, 29);
//           } else {
//             sketch.placeTile(i, j, 5, 29); // Chest tile
//           }
//         } else if (grid[i][j] === "o") {
//           if (useAlternate) {
//             sketch.placeTile(i, j, 4, 21);
//           } else {
//             sketch.placeTile(i, j, 30, 3); // Outline tile
//           }
//         }
//       }
//     }
//   };
// };

// let world1 = new p5(w1);

// const w2 = (sketch) => {
//   sketch.seed = 1100;
//   sketch.tilesetImage;
//   sketch.currentGrid = [];
//   sketch.numRows, sketch.numCols;

//   sketch.preload = () => {
//     sketch.tilesetImage = sketch.loadImage(
//       "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
//     );
//   };

//   sketch.reseed = () => {
//     console.log(sketch.seed);
//     sketch.seed = (sketch.seed | 0) + 1100;
//     sketch.randomSeed(sketch.seed);
//     sketch.noiseSeed(sketch.seed);
//     sketch.select("#seedReportOverworld").html("seed " + sketch.seed);
//     sketch.regenerateGrid();
//   };

//   sketch.regenerateGrid = () => {
//     sketch
//       .select("#asciiBoxOverworld")
//       .value(
//         sketch.gridToString(sketch.generateGrid(sketch.numCols, sketch.numRows))
//       );
//     sketch.reparseGrid();
//   };

//   sketch.reparseGrid = () => {
//     sketch.currentGrid = sketch.stringToGrid(
//       sketch.select("#asciiBoxOverworld").value()
//     );
//   };

//   sketch.gridToString = (grid) => {
//     let rows = [];
//     for (let i = 0; i < grid.length; i++) {
//       rows.push(grid[i].join(""));
//     }
//     return rows.join("\n");
//   };

//   sketch.stringToGrid = (str) => {
//     let grid = [];
//     let lines = str.split("\n");
//     for (let i = 0; i < lines.length; i++) {
//       let row = [];
//       let chars = lines[i].split("");
//       for (let j = 0; j < chars.length; j++) {
//         row.push(chars[j]);
//       }
//       grid.push(row);
//     }
//     return grid;
//   };

//   sketch.setup = () => {
//     sketch.numCols = sketch.select("#asciiBoxOverworld").attribute("rows") | 0;
//     sketch.numRows = sketch.select("#asciiBoxOverworld").attribute("cols") | 0;

//     sketch
//       .createCanvas(16 * sketch.numCols, 16 * sketch.numRows)
//       .parent("canvasContainerOverworld");
//     sketch.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

//     sketch.select("#reseedButtonOverworld").mousePressed(sketch.reseed);
//     sketch.select("#asciiBoxOverworld").input(sketch.reparseGrid);

//     sketch.reseed();
//   };

//   sketch.draw = () => {
//     sketch.randomSeed(sketch.seed);
//     sketch.drawGrid(sketch.currentGrid);
//   };

//   sketch.placeTile = (i, j, ti, tj) => {
//     sketch.image(
//       sketch.tilesetImage,
//       16 * j,
//       16 * i,
//       16,
//       16,
//       8 * ti,
//       8 * tj,
//       8,
//       8
//     );
//   };

//   //now we're in solution.js

//   sketch.generateGrid = (numCols, numRows) => {
//     const grid = new Array(numRows).fill(null).map(() => new Array(numCols));

//     const baseY = Math.floor(numRows / 2);
//     const waterWidth = 5;
//     let xoff = 0;
//     const noiseStep = 0.1;

//     let initialRiverPosition = baseY;

//     for (let i = 0; i < numRows; i++) {
//       xoff += noiseStep;
//       let riverPos =
//         initialRiverPosition + Math.floor((sketch.noise(xoff) - 0.5) * 10);
//       riverPos = sketch.constrain(riverPos, 0, numRows - waterWidth);

//       for (let j = 0; j < numCols; j++) {
//         if (j >= riverPos && j < riverPos + waterWidth) {
//           grid[i][j] = "w";
//         } else {
//           const innerValue = sketch.noise(i / 20, j / 20);
//           grid[i][j] = innerValue > 0.5 ? "d" : "g";
//         }
//       }
//     }

//     return grid;
//   };

//   sketch.constrain = (value, min, max) => {
//     return Math.min(Math.max(value, min), max);
//   };

//   sketch.drawGrid = (grid) => {
//     sketch.background(128);

//     const g = 10;
//     const t = sketch.millis() / 3000.0;

//     sketch.noStroke();
//     for (let i = 0; i < grid.length; i++) {
//       for (let j = 0; j < grid[i].length; j++) {
//         let delay = sketch.map(
//           i * grid[i].length + j,
//           0,
//           grid.length * grid[i].length,
//           0,
//           2000
//         );
//         let tileTime = sketch.millis() - delay;
//         let noiseT = tileTime / 3000.0;

//         sketch.placeTile(
//           i,
//           j,
//           (4 * sketch.pow(sketch.noise(noiseT / 10, i, j / 4 + noiseT), 2)) | 0,
//           14
//         );

//         if (sketch.gridCheck(grid, i, j, "d")) {
//           if (tileTime % 5000 < 2000) {
//             sketch.placeTile(i, j, (4 * sketch.pow(sketch.random(), g)) | 0, 9);
//           } else {
//             sketch.placeTile(
//               i,
//               j,
//               (4 * sketch.pow(sketch.random(), g)) | 0,
//               12
//             );
//           }
//         } else {
//           if (tileTime % 5000 < 2000) {
//             sketch.drawContext(grid, i, j, "w", 9, 3, true);
//           } else {
//             sketch.drawContext(grid, i, j, "w", 9, 6, true);
//           }
//         }

//         if (sketch.gridCheck(grid, i, j, "g")) {
//           if (tileTime % 5000 < 2000) {
//             sketch.placeTile(i, j, (4 * sketch.pow(sketch.random(), g)) | 0, 6);
//           } else {
//             sketch.placeTile(
//               i,
//               j,
//               (4 * sketch.pow(sketch.random(), g)) | 0,
//               12
//             );
//           }
//         } else {
//           if (tileTime % 5000 < 2000) {
//             sketch.drawContext(grid, i, j, "g", 4, 0);
//           } else {
//             sketch.drawContext(grid, i, j, "g", 4, 6);
//           }
//         }

//         if (
//           i >= 10 &&
//           i < 16 &&
//           j >= 10 &&
//           j < 16 &&
//           !sketch.gridCheck(grid, i, j, "w")
//         ) {
//           if (sketch.random() < 0.5) {
//             if (tileTime % 5000 < 2000) {
//               if (sketch.random() < 0.5) {
//                 sketch.placeTile(i, j, 26, 3);
//               } else {
//                 sketch.placeTile(i, j, 26, 2);
//               }
//             } else {
//               if (sketch.random() < 0.5) {
//                 sketch.placeTile(i, j, 27, 3);
//               } else {
//                 sketch.placeTile(i, j, 27, 2);
//               }
//             }
//           }
//         }
//       }
//     }
//   };

//   sketch.drawContext = (grid, i, j, target, dti, dtj, invert = false) => {
//     let code = sketch.gridCode(grid, i, j, target);
//     if (invert) {
//       code = ~code & 0xf;
//     }
//     let [ti, tj] = sketch.lookup[code];
//     sketch.placeTile(i, j, dti + ti, dtj + tj);
//   };

//   sketch.gridCode = (grid, i, j, target) => {
//     return (
//       (sketch.gridCheck(grid, i - 1, j, target) << 0) +
//       (sketch.gridCheck(grid, i, j - 1, target) << 1) +
//       (sketch.gridCheck(grid, i, j + 1, target) << 2) +
//       (sketch.gridCheck(grid, i + 1, j, target) << 3)
//     );
//   };

//   sketch.gridCheck = (grid, i, j, target) => {
//     return (
//       i >= 0 &&
//       i < grid.length &&
//       j >= 0 &&
//       j < grid[i].length &&
//       grid[i][j] === target
//     );
//   };

//   sketch.lookup = [
//     [1, 7],
//     [1, 6],
//     [0, 7],
//     [0, 6],
//     [2, 7],
//     [2, 6],
//     [1, 7],
//     [1, 6],
//     [1, 8],
//     [1, 7],
//     [0, 8],
//     [0, 7],
//     [2, 8],
//     [2, 7],
//     [1, 8],
//     [1, 7],
//   ];
// };
// let world2 = new p5(w2);
