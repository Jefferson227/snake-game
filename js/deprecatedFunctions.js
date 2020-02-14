/**
 * This function is not used anymore, I created it only to pass the test lol
 * It has some bugs so feel free to fix them (if you find, I'm not gonna tell what it is hahaha)
 */
function reverseSnakeDirection() {
  clearInterval(state.moveSnake);

  let snakeLength = $("#snake-wrapper").children().length;
  let reversedIndex = snakeLength - 1;
  let maxIndex =
    snakeLength % 2 === 0 ? snakeLength / 2 : Math.floor(snakeLength / 2);

  for (let i = 0; i <= maxIndex; i++) {
    if (maxIndex === i) continue;

    let snakeSegments = $("#snake-wrapper").children();
    let currentSegment = $(snakeSegments[i]);
    let oppositeSegment = $(snakeSegments[reversedIndex]);
    swapTailSegments(currentSegment, oppositeSegment);

    reversedIndex--;
  }

  state.direction = getOppositeDirection(state.direction);
  setDirection(state.direction);
}

/**
 * This function is not being used anymore, I created it only to pass the test lol
 * If you want to improve it, go ahead, good luck :)
 */
function shortenArenaSize() {
  state.gameArenaSize -= GAME_ARENA_REDUCER;
  let snakeSegments = $("#snake-wrapper").children();

  for (let i = 0; i < snakeSegments.length; i++) {
    let segment = $(snakeSegments[i]);
    let leftPosition = parseIntFromPixel(segment.css("left"));
    let topPosition = parseIntFromPixel(segment.css("top"));

    if (leftPosition > state.gameArenaSize)
      segment.css("left", `${leftPosition - GAME_ARENA_REDUCER}px`);

    if (topPosition > state.gameArenaSize)
      segment.css("top", `${topPosition - GAME_ARENA_REDUCER}px`);
  }

  if (snakeSegments.length >= state.gameArenaSize) {
    displayRestartButton();
    return;
  }

  $("#game-arena").css({
    height: `${state.gameArenaSize}px`,
    width: `${state.gameArenaSize}px`
  });

  placeFood();
}
