const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const SQ = 30;

const MAPTILE = {
  cols: 30,
  rows: 20,
  width: 30 * SQ
}

canvas.width = innerWidth;
canvas.height = SQ * 20;

// let blockImage = createImage("./img/block.png");
let backgroundImage = createImage("./img/background.png");
let hillsImage = createImage("./img/hills.png");

// platforms
const hardBlocks = [];
const softBlocks = [];
const hiddenBlocks = [];
const sliders = [];
const fragileBlocks = [];
const unstableBlocks = [];

let blocks = [];

let genericObjects = [
  new GenericObject({ x: 0, y: 0, image: backgroundImage }),
  new GenericObject({ x: 500, y: 100, image: hillsImage }),
];

function drawCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.onload = animate;

function animate() {
  requestAnimationFrame(animate);

  drawCanvas();

  genericObjects.forEach(genericObject => {
    genericObject.draw();
  });

  blocks.forEach(block => block.draw());

  //drawGrid();

  // draw El Mario
  player.draw();

  (function checkInteractionsWithMario() {
    Block.playerLands();
    HardBlock.playerCollides();
    HiddenBlock.playerCollides();
    FragileBlock.playerCollides();
    UnstableBlock.playerLands();
  })();
}


// create map
(function () {
  MAP.forEach((maptile, i) => {
    maptile.forEach((row, j) => {
      row.forEach((block, k) => {
        let calcPos = {
          x: k * SQ + MAPTILE.width * i,
          y: j * SQ,
        };
        let calcTileId = i * MAPTILE.width + (j * MAPTILE.cols + k)

        switch (true) {
          case block.trim() === "■": // Hard Block
            hardBlocks.push(
              new HardBlock({
                pos: calcPos,
                tileId: calcTileId,
                //color: "red"
              })
            )
            break;

          case block.trim() === "⧅": // Soft Block
            softBlocks.push(
              new SoftBlock({
                pos: calcPos,
                tileId: calcTileId,
                //color: "orange"
              })
            )
            break;

          case block.trim() === "?": // Hidden Block
            hiddenBlocks.push(
              new HiddenBlock({
                pos: calcPos,
                tileId: calcTileId,
              })
            )
            break;

          case block.trim() === "□": // Fragile Block
            fragileBlocks.push(
              new FragileBlock({
                pos: calcPos,
                tileId: calcTileId,
              })
            )
            break;
            
          case block.trim() === "◪": // Unstable Block
            unstableBlocks.push(
              new UnstableBlock({
                pos: calcPos,
                tileId: calcTileId,
              })
            )
            break;


          case block[0] === "◂":
            sliders.push(
              new HorizontalSlider ({
                pos: calcPos,
                width: +block[1] * SQ,
                slideRange: +block[2],
              })
            )
            break;
          
          case block[0] === "▴":
            sliders.push(
              new VerticalSlider ({
                pos: calcPos,
                width: +block[1] * SQ,
                slideRange: +block[2],
              })
            )
            break;
          
        }
      });
    });
  });

  updateBlockRegistry();
})();

function updateBlockRegistry() {
  blocks = [];
  
  blocks.push(
    ...hardBlocks,
    ...softBlocks,
    ...hiddenBlocks,
    ...sliders,
    ...fragileBlocks,
    ...unstableBlocks
    )
}
