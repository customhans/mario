const keys = {
  w: { isAvailable: true },
  a: { isPressed: false },
  s: { isPressed: false },
  d: { isPressed: false },

}

addEventListener("keydown", ({ code }) => {
  switch (code) {
    case "KeyW":
      if (keys.w.isAvailable) player.vel.y -= player.skills.jump.vel.y;
      keys.w.isAvailable = false;
      break;
    case "KeyA":
      keys.a.isPressed = true;
      break;
    case "KeyS":
      keys.s.isPressed = true;
      break;
    case "KeyD":
      keys.d.isPressed = true;
      break;
  }
})
addEventListener("keyup", ({ code }) => {
  switch (code) {
    case "KeyA":
      keys.a.isPressed = false;
      break;
    case "KeyS":
      keys.s.isPressed = false;
      break;
    case "KeyD":
      keys.d.isPressed = false;
      break;
  }
})

