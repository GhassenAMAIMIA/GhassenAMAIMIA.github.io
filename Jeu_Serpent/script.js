window.onload = function () {
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blocSize = 30;
  var ctx;
  var delay = 101;
  var snakee;
  var applee;
  var widthInBlock = canvasWidth / blocSize;
  var heigthInBlock = canvasHeight / blocSize;
  var score;
  var timeout;
  init();

  function init() {
    var canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    ctx = canvas.getContext("2d");
    score = 0;
    refreshCanvas();
  }

  function refreshCanvas() {
    snakee.advance();
    if (snakee.checkCollision()) {
      gameOver();
    } else {
      if (snakee.isEatingApple(applee)) {
        score++;
        snakee.ateApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawScore();
      applee.draw();
      snakee.draw();

      timeout = setTimeout(refreshCanvas, delay);
    }
  }

  function gameOver() {
    ctx.save();

    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.strokeText("Game Over", canvasWidth / 2, canvasHeight / 2 - 180);
    ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2 - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText(
      "Appuyer sur la touche espace pour rejouer",
      canvasWidth / 2,
      canvasHeight / 2 - 120
    );
    ctx.fillText(
      "Appuyer sur la touche espace pour rejouer",
      canvasWidth / 2,
      canvasHeight / 2 - 120
    );

    ctx.restore();
  }
  function restart() {
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    clearTimeout(timeout);
    refreshCanvas();
    score = 0;
  }

  function drawScore() {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score.toString(), canvasWidth / 2, canvasHeight / 2);
    ctx.restore();
  }

  function drawBlock(ctx, position) {
    var x = position[0] * blocSize;
    var y = position[1] * blocSize;
    ctx.fillRect(x, y, blocSize, blocSize);
  }

  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctx, this.body[i]);
      }
      ctx.restore();
    };
    this.advance = function () {
      var nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw "invalide direction";
      }

      this.body.unshift(nextPosition);
      if (this.ateApple == false) this.body.pop();
      else this.ateApple = false;
    };
    this.setDirection = function (newDicrection) {
      var allowedDirection;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirection = ["up", "down"];
          break;
        case "up":
        case "down":
          allowedDirection = ["left", "right"];
          break;
        default:
          throw "invalide direction";
      }
      if (allowedDirection.indexOf(newDicrection) > -1) {
        this.direction = newDicrection;
      }
    };
    this.checkCollision = function () {
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakex = head[0];
      var snakey = head[1];
      if (
        snakex > widthInBlock - 1 ||
        snakex < 0 ||
        snakey > heigthInBlock - 1 ||
        snakey < 0
      ) {
        wallCollision = true;
      }

      for (var i = 0; i < rest.length; i++) {
        if (rest[i][0] == snakex && rest[i][1] == snakey) {
          snakeCollision = true;
        }
      }
      return wallCollision || snakeCollision;
    };
    this.isEatingApple = function (appleToEat) {
      var head = this.body[0];
      return (
        head[0] == appleToEat.position[0] && head[1] == appleToEat.position[1]
      );
    };
  }

  function Apple(position) {
    this.position = position;
    this.draw = function () {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      var radius = blocSize / 2;
      var x = this.position[0] * blocSize + radius;
      var y = this.position[1] * blocSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };
    this.setNewPosition = function () {
      var newX = Math.round(Math.random() * (widthInBlock - 1));
      var newy = Math.round(Math.random() * (heigthInBlock - 1));
      this.position = [newX, newy];
    };
    this.isOnSnake = function (snakeToCheck) {
      var isOnSnake = false;
      for (var i = 0; i < snakeToCheck.body.length; i++) {
        if (
          this.position[0] == snakeToCheck.body[i][0] &&
          this.position[1] == snakeToCheck.body[i][1]
        )
          isOnSnake = true;
      }
      return isOnSnake;
    };
  }

  document.onkeydown = function handleKeyDown(e) {
    var key = e.keyCode;
    var newDicrection;
    switch (key) {
      case 37:
        newDicrection = "left";
        break;
      case 38:
        newDicrection = "up";
        break;
      case 39:
        newDicrection = "right";
        break;
      case 40:
        newDicrection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        throw "invalide key";
    }
    snakee.setDirection(newDicrection);
  };
};
