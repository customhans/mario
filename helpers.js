var bw = 1000;
// Box height
var bh = 1000;
// Padding
var p = 0;

function drawGrid() {
  for (var x = 0; x <= bw; x += 30) {
    ctx.moveTo(0.5 + x + p, p);
    ctx.lineTo(0.5 + x + p, bh + p);
  }

  for (var x = 0; x <= bh; x += 30) {
    ctx.moveTo(p, 0.5 + x + p);
    ctx.lineTo(bw + p, 0.5 + x + p);
  }
  ctx.strokeStyle = "grey";
  ctx.stroke();
}

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}
addEventListener("mousemove", (code) => {
    mouse.x = code.clientX;
    mouse.y = code.clientY + -15;
})

function drawDevRecs() {
    // dynamic rect
    ctx.fillStyle = "tomato";
    ctx.fillRect(mouse.x, mouse.y, 30, 30);
}

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
  }