function setDirection(directionToSet) {
  if (state.direction === getOppositeDirection(directionToSet)) return;

  state.direction = directionToSet;
  clearInterval(state.moveSnake);

  state.moveSnake = setInterval(() => {
    let snakeHead = $("#snake-head");
    let previousPosition = getPreviousPosition(snakeHead);

    setNewPosition(snakeHead, directionToSet);

    if (snakeHitsItself()) {
      displayRestartButton();
      return;
    }

    if (snakeHitsTheWall()) {
      reverseSnakeDirection();
      shortenArenaSize();
      return;
    }

    updateTailPosition(previousPosition, 0);
  }, SPEED);
}

function getOppositeDirection(direction) {
  switch (direction) {
    case Directions.Up:
      return Directions.Down;
    case Directions.Down:
      return Directions.Up;
    case Directions.Left:
      return Directions.Right;
    default:
      return Directions.Left;
  }
}

function setNewPosition(snakeHead, directionToSet) {
  let property =
    directionToSet === Directions.Up || directionToSet === Directions.Down
      ? "top"
      : "left";

  let currentValue = parseIntFromPixel(snakeHead.css(property));
  let newValue =
    directionToSet === Directions.Right || directionToSet === Directions.Down
      ? currentValue + BLOCK
      : currentValue - BLOCK;

  snakeHead.css(property, `${newValue}px`);
}

function parseIntFromPixel(val) {
  return parseInt(val.replace("px", "") || 0);
}

function snakeHitsTheWall() {
  let top = parseIntFromPixel($("#snake-head").css("top"));
  let left = parseIntFromPixel($("#snake-head").css("left"));
  let edge = state.gameArenaSize - BLOCK;

  if (top < 0 || top > edge || left < 0 || left > edge) return true;

  return false;
}

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

function swapTailSegments(firstSegment, secondSegment) {
  let firstPosition = {
    top: firstSegment.css("top"),
    left: firstSegment.css("left")
  };

  let secondPosition = {
    top: secondSegment.css("top"),
    left: secondSegment.css("left")
  };

  firstSegment.css("top", secondPosition.top);
  firstSegment.css("left", secondPosition.left);

  secondSegment.css("top", firstPosition.top);
  secondSegment.css("left", firstPosition.left);
}

function snakeHitsItself() {
  let tailLength = $(".snake-tail").length;
  let snakeHead = $("#snake-head");

  for (let i = 0; i < tailLength; i++) {
    let tailElement = $(".snake-tail")[i];
    let tailSegment = $(tailElement);

    if (haveSamePosition(snakeHead, tailSegment)) return true;
  }

  return false;
}

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

function restartGame() {
  $("#game-arena").empty();
  $("#game-arena").append(`
        <div id="snake-wrapper" class="snake-wrapper">
            <div id="snake-head" class="snake snake-head" style="top: ${BLOCK}px; left: ${BLOCK *
    5}px;"></div>
            <div class="snake snake-tail" style="top: ${BLOCK}px; left: ${BLOCK *
    4}px;"></div>
            <div class="snake snake-tail" style="top: ${BLOCK}px; left: ${BLOCK *
    3}px;"></div>
            <div class="snake snake-tail" style="top: ${BLOCK}px; left: ${BLOCK *
    2}px;"></div>
        </div>
    `);
  $("#game-arena").css({
    height: `${GAME_ARENA_DEFAULT_SIZE}`,
    width: `${GAME_ARENA_DEFAULT_SIZE}`
  });

  $("#button-restart").css("display", "none");
  $("#hi-score-points").css("color", "#000");
  state.direction = Directions.Right;
  setScore(0);
  placeFood();
}

function displayRestartButton() {
  clearInterval(state.moveSnake);
  state.gameArenaSize = GAME_ARENA_DEFAULT_SIZE;

  $("#game-arena").css({
    height: `${GAME_ARENA_DEFAULT_SIZE}`,
    width: `${GAME_ARENA_DEFAULT_SIZE}`
  });
  $("#snake-wrapper").css("display", "none");
  $("#food").css("display", "none");
  $("#button-restart").css("display", "block");
}

function getPreviousPosition(element) {
  return {
    top: element.css("top"),
    left: element.css("left")
  };
}

function setScore(points) {
  state.points = points;
  $("#score-points").text(points);
}

function updateTailPosition(newPosition, index) {
  if (index >= $(".snake-tail").length) return;

  let tailElement = $(".snake-tail")[index];
  let tailSegment = $(tailElement);
  let previousPosition = getPreviousPosition(tailSegment);

  tailSegment.css("top", newPosition.top);
  tailSegment.css("left", newPosition.left);

  index++;

  if (index === $(".snake-tail").length && snakeHasEatenFood()) {
    addNewTailSegment(previousPosition);
    increaseScore();
    return;
  }

  updateTailPosition(previousPosition, index);
}

function increaseScore() {
  setScore(state.points + 1);
  updateHiScore();
}

function updateHiScore() {
  let hiScore = localStorage.getItem("hiScore") || 0;

  if (state.points <= hiScore) return;

  setHiScore(state.points);
}

function setHiScore(newScore) {
  localStorage.setItem("hiScore", newScore);

  $("#hi-score-points").text(newScore);
  $("#hi-score-points").css("color", "#ff0000");
}

function loadHiScore() {
  let hiScore = localStorage.getItem("hiScore") || 0;
  $("#hi-score-points").text(hiScore);
}

function snakeHasEatenFood() {
  let snakeHead = $("#snake-head");
  let food = $("#food");

  return haveSamePosition(snakeHead, food);
}

function haveSamePosition(firstElement, secondElement) {
  return (
    firstElement.css("top") === secondElement.css("top") &&
    firstElement.css("left") === secondElement.css("left")
  );
}

function addNewTailSegment(position) {
  $("#snake-wrapper").append(`
        <div class="snake snake-tail" style="top: ${position.top}; left: ${position.left}"></div>
    `);

  placeFood();
}

function generatePosition() {
  let result = state.gameArenaSize;

  while (result > 0 && result > state.gameArenaSize - BLOCK) {
    result = Math.round(generateRandomNumber(1000));

    if (result % BLOCK > 0) {
      result = state.gameArenaSize;
    }
  }

  return result;
}

function generateTimeout(min, max) {
  let result = max + 1;

  while (result < min || result > max) {
    result = Math.round(generateRandomNumber(10));
  }

  return result;
}

function generateRandomNumber(maxNumber) {
  return Math.random() * maxNumber;
}

function placeFood() {
  let xPosition = `${generatePosition()}px`;
  let yPosition = `${generatePosition()}px`;

  if (!$("#game-arena").children("#food").length) {
    $("#game-arena").append('<div id="food" class="food"></div>');
  }

  $("#food").css({
    left: xPosition,
    top: yPosition
  });
}

function startFoodLoop() {
  let timer = 0;
  let timeout = generateTimeout(MIN_FOOD_TIME, MAX_FOOD_TIME);

  placeFood();

  setInterval(() => {
    if (timer === timeout) {
      timeout = generateTimeout(MIN_FOOD_TIME, MAX_FOOD_TIME);
      timer = 0;

      placeFood();
    }

    timer++;
  }, 1000);
}
