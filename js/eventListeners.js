$(document).on("keydown", () => {
  switch (this.event.keyCode) {
    case 39: // Right arrow
      setDirection(Directions.Right);
      break;
    case 40: // Down arrow
      setDirection(Directions.Down);
      break;
    case 37: // Left arrow
      setDirection(Directions.Left);
      break;
    case 38: // Up arrow
      setDirection(Directions.Up);
      break;
    default:
      break;
  }
});

$("#button-restart").on("click", () => {
  restartGame();
});
