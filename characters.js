class Character {
  constructor({ pos }) {
    this.pos = pos;
    this.vel = { y: 0, x: 0 };
    this.gravity = 0.75;
    this.skills = {
      run: {
        vel: {
          x: 5
        }
      },
      jump: {
        vel: {
          y: 15
        }
      }
    }
    this.attr = {
      width: 28,
      height: 28,
    }
  }

  draw() {
    this.update();

    ctx.fillStyle = "tomato";
    ctx.fillRect(this.pos.x, this.pos.y, this.attr.width, this.attr.height);
  }

  update() {
    this.pos.y += this.vel.y;

    this.updateX();
    this.updateY();
  }

  updateY() {
    if (this.pos.y + this.attr.height + this.vel.y <= canvas.height) {
      this.vel.y += this.gravity;
    }
  }

  updateX() {
    this.pos.x += this.vel.x;

    if (keys.d.isPressed) {
      if (this.pos.x <= canvas.width / 2 - this.attr.width) {
        this.vel.x = this.skills.run.vel.x;
      } else {
        this.vel.x = 0;

        GenericObject.parallaxSpeed = -2;
        Block.parallaxSpeed = -3;
      }
    } else {
      this.vel.x = 0;
      GenericObject.parallaxSpeed = 0;
      Block.parallaxSpeed = 0;
    }
    if (keys.a.isPressed && this.pos.x > 20) {
      this.vel.x = -this.skills.run.vel.x;
    }
  }
}

// give it: pos, run, jump

class Player extends Character {

}

const player = new Player({ pos: { x: 0, y: 300 } });