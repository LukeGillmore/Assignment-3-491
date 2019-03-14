window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function (callback, element) {
             window.setTimeout(callback, 1000 / 10);
           };
  })();
  
  class Timer {
    constructor() {
      this.gameTime = 0;
      this.maxStep = 0.5;
      this.wallLastTimestamp = 0;
    }
  
    tick() {
      let wallCurrent = Date.now();
      let wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
      this.wallLastTimestamp = wallCurrent;
  
      let gameDelta = Math.min(wallDelta, this.maxStep);
      this.gameTime += gameDelta;
      return gameDelta;
    }
  }
  
  class GameEngine {
    constructor(ctx, board) {
      this.ctx = ctx;
      this.board = board;
      this.width = this.ctx.width;
      this.height = this.ctx.height;
      this.timer = new Timer();
    }
  
  
    start() {

      console.log('Starting the game');
      var that = this;

      (function gameLoop() {

          that.loop();


        requestAnimFrame(gameLoop, that.ctx.canvas);
      })();

    }
  
    loop() {
      this.clockTick = this.timer.tick();
      this.draw();
      this.board.update();
    }

  
    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.save();
      this.board.draw(this.ctx);
      this.ctx.restore();
    }
  }
  