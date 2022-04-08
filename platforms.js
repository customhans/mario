
class Block {
    static parallaxSpeed = 0;
    constructor({ tileId, family, pos, symbol = "■", color }) {
      this.tileId = tileId;
      this.family = family;
      this.pos = pos;
      this.vel = { y: 0, x: 0 };
      this.width = SQ;
      this.height = SQ;
      this.symbol = symbol;
      this.color = color; // default color
    }
  
    static playerLands() {
      blocks.forEach((block) => {
        if (block.detectLandingBlock()) {
          player.pos.y = block.pos.y - player.attr.height; // force pinning to ground
          player.vel.y = 0;
          keys.w.isAvailable = true;
        }
      });
    }
  
    draw() {
      this.update();
  
      ctx.fillStyle = this.color;
      ctx.fillRect(this.pos.x, this.pos.y, this.width - 1, this.height - 1);
      //ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
    }
  
    update() {
      this.pos.x += Block.parallaxSpeed;
      this.pos.y += this.vel.y;
    }
  
    detectLandingBlock() {
      // all blocks are landable (except for inactive hidden blocks)
      return (
        player.pos.x + player.attr.width >= this.pos.x &&
        player.pos.x <= this.pos.x + this.width &&
        player.pos.y + player.attr.height <= this.pos.y &&
        player.pos.y + player.attr.height + player.vel.y >= this.pos.y
      );
    }
  
    fullCollision() {
      // only hardBlocks are fully non-penetrable
      return (
        player.pos.x + player.attr.width + player.vel.x > this.pos.x &&
        player.pos.x + player.vel.x < this.pos.x + this.width &&
        player.pos.y + player.attr.height > this.pos.y &&
        player.pos.y + player.vel.y < this.pos.y + this.height
      );
    }
  
    deleteSelf() {
      let idx = this.family.findIndex((ele) => ele.tileId === this.tileId);
      this.family.splice(idx, 1);
      updateBlockRegistry();
    }
  }
  
  class HardBlock extends Block {
    constructor({ tileId, family, pos, color }) {
      super({ tileId, family, pos, color });
      this.family = hardBlocks;
      this.symbol = "⧅";
      this.color = "black";
    }
  
    static playerCollides() {
      hardBlocks.forEach((block) => {
        if (block.fullCollision()) {
          player.vel.x = 0;
          GenericObject.parallaxSpeed = 0;
          Block.parallaxSpeed = 0;
  
          if (player.pos.y >= block.pos.y + block.height) {
            // prevent vertical sticking when directly next to block
            // and trying to jump up and to the side
            player.vel.y = 0;
          }
        }
      });
    }
  }
  
  class SoftBlock extends Block {
    constructor({ tileId, family, pos, color }) {
      super({ tileId, family, pos, color });
      this.family = softBlocks;
      this.symbol = "⧅";
      this.color = "orange";
    }
  }
  
  class HiddenBlock extends Block {
    constructor({ tileId, family, pos, color }) {
      super({ tileId, family, pos, color });
      this.family = hiddenBlocks;
      this.symbol = "?";
      this.hidden = true;
      this.color = "rgba(255, 255, 255, 0.05)";
    }
  
    static playerCollides() {
      hiddenBlocks.forEach((block) => {
        if (block.fullCollision()) {
          block.hidden = false;
  
          // after collision convert to hardBlock
          hardBlocks.push(
            new HardBlock({
              pos: { ...block.pos },
              //type:
            })
          )
  
          block.deleteSelf();
  
          player.vel.y = 0;
        }
      });
    }
  
    detectLandingBlock() {
      return (
        super.detectLandingBlock() &&
        player.vel.y < 0
      );
    }
  
    fullCollision() {
      return (
        super.fullCollision() &&
        player.vel.y < 0
      )
    }
  }
  
  class FragileBlock extends Block {
    constructor({ tileId, family, pos, color }) {
      super({ tileId, family, pos, color });
      this.family = fragileBlocks;
      this.symbol = "□";
      this.color = "purple";
    }
  
    static playerCollides() {
      fragileBlocks.forEach(block => {
  
        if (block.fullCollision()) {
          player.vel.x = 0;
    
            player.vel.y = 0;
    
            block.deleteSelf();
        }
    
      })
    }
  }
  
  class UnstableBlock extends Block {
    constructor({ tileId, family, pos, color }) {
      super({ tileId, family, pos, color });
      this.family = unstableBlocks;
      this.symbol = "◪";
      this.color = "white";
      this.fallColor= "rgba(255, 255, 255, 0.25)";
      this.fallSpeed = 0.25;
      this.fallDelay = 500;
    }
    
    static playerLands() {
      unstableBlocks.forEach(block => {
        if (block.detectLandingBlock()) {
          player.vel.y = block.vel.y;
          //keys.w.isAvailable = true;
          block.color = block.fallColor;
          setTimeout(function() {
            block.vel.y += block.fallSpeed;
          }, block.fallDelay);
        }
  
        if (block.pos.y + block.height > canvas.height) {
          block.deleteSelf(); // remove block if falls off canvas
        }
      })
    }
  }
  
  class Slider extends Block {
    constructor({ tileId, family, pos, width, slideRange, color }) {
      super({ tileId, family, pos, color });
      this.width = width;
      this.slideRange = slideRange;
      this.height = 10;
      this.symbol = "▬";
      this.color = "lightgreen"
    }
  
    update() {
      super.update();
      this.baseX += Block.parallaxSpeed;
    }
  
    draw() {
      super.draw();
      this.mechanics();
    }
  
    playerOnBoard() {
      return (
        player.pos.x + player.attr.width >= this.pos.x &&
        player.pos.x <= this.pos.x + this.width &&
        player.pos.y + player.vel.y <= this.pos.y + this.vel.y &&
        player.pos.y + player.attr.height + player.vel.y >= this.pos.y + this.vel.y
      );
    }
  }
  
  class HorizontalSlider extends Slider {
    constructor({ tileId, family, pos, slideRange, width }) {
      super({ tileId, family, pos, slideRange, width });
      this.slideDirection = "left"; // initial slide direction
      this.baseX = this.pos.x;
      this.vel = { x: 1, y: 0 };
    }
  
    mechanics() {
      if (this.slideDirection == "left") {
        if (this.pos.x > this.baseX - this.slideRange * SQ) {
          this.pos.x -= this.vel.x;
          if (this.playerOnBoard()) {
            player.pos.x -= this.vel.x;
          }
        } else {
          this.slideDirection = "right";
        }
      }
  
      if (this.slideDirection == "right") {
        if (this.pos.x < this.baseX + this.slideRange * SQ) {
          this.pos.x += this.vel.x;
          if (this.playerOnBoard()) {
            player.pos.x += this.vel.x;
          }
        } else {
          this.slideDirection = "left";
        }
      }
    }
  }
  
  class VerticalSlider extends Slider {
    constructor({ tileId, family, pos, slideRange, width }) {
      super({ tileId, family, pos, slideRange, width });
      this.slideDirection = "top";
      this.baseY = this.pos.y;
      this.vel = { x: 0, y: 0 };
    }
  
    mechanics() {
      if (this.slideDirection == "top") {
        if (this.pos.y >= this.baseY - this.slideRange * SQ) {
          this.vel.y = -1;
          if (this.playerOnBoard()) {
            player.pos.y += this.vel.y;
          }
        } else {
          this.slideDirection = "bottom";
        }
      }
  
      if (this.slideDirection == "bottom") {
        if (this.pos.y <= this.baseY + this.slideRange * SQ) {
          this.vel.y = 1;
          if (this.playerOnBoard()) {
            player.pos.y -= this.vel.y;
          }
        } else {
          this.slideDirection = "top";
        }
      }
    }
  }
  
  class GenericObject {
    static parallaxSpeed = 0;
  
    constructor({ x, y, image }) {
      this.pos = { x, y };
      this.image = image;
      this.width = image.width;
      this.height = image.height;
    }
  
    draw() {
      this.update();
  
      ctx.drawImage(this.image, this.pos.x, this.pos.y);
    }
  
    update() {
      this.pos.x += GenericObject.parallaxSpeed;
    }
  }
  