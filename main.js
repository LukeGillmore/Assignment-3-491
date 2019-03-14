window.onload = main;
var socket = io.connect("http://24.16.255.56:8888");
let isClicked = false;
const ROWS  = 80;
const COLS = 100;
const SQAURE_SIZE = 10;
let board  = [[]];
let savedState = [[]];
let backGroundColors = ['darkblue', 'black', 'red', 'green', 'yellow', 'white' ];
let foreGroundColors = ['yellow', 'white', 'darkblue', 'yellow', 'blue' , 'black'];
let count = 0; 
let speed = 10;
let savedBoard; 

let colors = document.getElementById('color');
colors.onclick = () => { count++; count > 4 ? count = 0 : count;}

function main() {
  /** Start Game  */
let start = document.getElementById('start');
start.onclick = () => {
game.start();
}

/** Increase animation speed */
let speedUp = document.getElementById('speedUp');
speedUp.onclick = () => {speed--; speed < 1 ? speed = 1 : speed;}

/** Reduce animation speed */
let slowDown = document.getElementById('slowDown');
slowDown.onclick = () => {speed++;}

/**  intialize canvas and board */
var canvas = document.getElementById('gameWorld');
var ctx = canvas.getContext('2d');

let board = new Board();
let game = new GameEngine(ctx, board);

let save = document.getElementById('save');
save.onclick = () => {
  save.innerHTML = "Saved";
  console.log("saved");
  socket.emit("save", {studentname:"Luke Gillmore", statename:"GosperState", data:savedBoard });
  console.log(board);
}

let load = document.getElementById('load');
load.onclick = () => {
   load.innerHTML = "Loaded.";
   socket.emit("load", {studentname: "Luke Gillmore", statename: "GosperState"});
  
   socket.on("load", (data) => {
     console.log(data.data);
     board.getLoadedState(data.data);
     game.draw();
   });
   game.start();
}
}

class Board {

  constructor() {
   
    this.board = this.initialize();
    this.count = 1;

    this.board[10][3] = 1;
    this.board[10][4] = 1;
    this.board[9][3] = 1;
    this.board[9][4] = 1;
    
    this.board[7][15] = 1;
    this.board[7][16] = 1;
    this.board[8][14] = 1;
    this.board[9][13] = 1;
    this.board[10][13] = 1;
    this.board[11][13] = 1;
    this.board[12][14] = 1;
    this.board[13][15] = 1;
    this.board[13][16] = 1;
    this.board[12][18] = 1;
    this.board[11][19] = 1;
    this.board[10][19] = 1;
    this.board[10][20] = 1;
    this.board[10][17] = 1;
    this.board[9][19] = 1;
    this.board[8][18] = 1;
    
    this.board[5][27] = 1;
    this.board[6][27] = 1;
    this.board[6][25] = 1;
    this.board[7][24] = 1;
    this.board[8][24] = 1;
    this.board[9][24] = 1;
    this.board[7][23] = 1;
    this.board[8][23] = 1;
    this.board[9][23] = 1;
    this.board[10][25] = 1;
    this.board[10][27] = 1;
    this.board[11][27] = 1;
    
    this.board[7][37] = 1;
    this.board[8][37] = 1;
    this.board[8][38] = 1;
    this.board[7][38] = 1;
    
    this.board[8][44] = 1;
    this.board[9][44] = 1;
    this.board[10][44] = 1;
    
    this.board[5][47] = 1;
    this.board[6][47] = 1;
    this.board[5][48] = 1;
      
    this.board[8][49] = 1;
    this.board[8][50] = 1;
    this.board[7][50] = 1;

    /// Oscilator 
    this.board[16][54] = 1;
    this.board[16][53] = 1;
    this.board[17][53] = 1;
    this.board[18][53] = 1;
    this.board[19][53] = 1;
    this.board[20][53] = 1;
    this.board[20][54] = 1;
    this.board[18][52] = 1;
    this.board[17][51] = 1;
    this.board[19][51] = 1;
    this.board[18][50] = 1;
    this.board[18][49] = 1;
    this.board[17][49] = 1;
    this.board[16][49] = 1;
    this.board[19][49] = 1;
    this.board[20][49] = 1;
    this.board[20][48] = 1;
    this.board[16][48] = 1;
   
  // /// Pentadecathlon (period 15)
    this.board[31][4] = 1;
    this.board[31][5] = 1;
    this.board[30][6] = 1;
    this.board[32][6] = 1;
    this.board[31][7] = 1;
    this.board[31][8] = 1;
    this.board[31][9] = 1;
    this.board[31][10] = 1;
    this.board[30][11] = 1;
    this.board[32][11] = 1;
    this.board[31][12] = 1;
    this.board[31][13] = 1;
  
      board = this.board;
     this.countEdge = 0;
  }
  /** Get a previously loaded state from DB */
  getLoadedState(state) {
    this.board  = state; 
  }


  /**Create empty array */
  zeroWorld() {
    let arr = new Array(ROWS);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(COLS);
    }
    return arr;
  }

  /** fill world  with random ones or zeros*/
  initialize() {
    let world = this.zeroWorld(ROWS, COLS);
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        world[i][j] = 0;
      }
    }
    return world;
  }

  update() {
    if( this.count % speed == 0){
    let mutation = this.initialize();

    for (let rows = 0; rows < ROWS; rows++) {
      for (let cols = 0; cols < COLS; cols++) {
        let sum = 0;
        let currentState = this.board[rows][cols];

        if (rows == 0 || rows == ROWS - 1 || cols == 0 || cols == COLS - 1) {

          mutation[rows][cols] = currentState;
          
          this.countEdge++;
        } else {
  
          sum += this.board[rows - 1][cols - 1]; //top left
          sum += this.board[rows - 1][cols]; // top
          sum += this.board[rows - 1][cols + 1]; // top right
          sum += this.board[rows][cols - 1]; // left
          sum += this.board[rows][cols + 1]; // right
          sum += this.board[rows + 1][cols - 1]; // bottom left
          sum += this.board[rows + 1][cols]; // bottom
          sum += this.board[rows + 1][cols + 1]; //bottom right
      
        }

        
          // Cell is dead then comes alive when has three nieghbors
        if (currentState == 0 && sum == 3) {
          mutation[rows][cols] = 1;
          // Cell must die because it has less that 2 or ≤ 3 neighbors
        } else if (currentState == 1 && (sum < 2 || sum > 3)) {
          mutation[rows][cols] = 0;
          
        } else {
          // CEll remians as is. 
          mutation[rows][cols] = currentState; 
        }
      }
    }

    this.board = mutation;
    board = this.board;
    savedBoard = board;
    
  }
  this.count +=1;
  }




  draw(ctx) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {

        let x = col * SQAURE_SIZE;
        let y = row * SQAURE_SIZE;
        if (this.board[row][col] === 1) {
          ctx.fillStyle = foreGroundColors[count];
        }
        else {
          ctx.fillStyle = backGroundColors[count];
        }
        ctx.fillRect(x, y, SQAURE_SIZE, SQAURE_SIZE);
        ctx.rect(x, y, SQAURE_SIZE, SQAURE_SIZE);
        // ctx.stroke();
      }
    }
  } 
}