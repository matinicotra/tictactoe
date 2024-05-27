const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let turn = 0;   //0 = user, 1 = PC
const boardContainer = document.querySelector('#board');
const playerDiv = document.querySelector('#player');

startGame();

function startGame() {
  renderBoard();
  turn = Math.random() <= 0.5 ? 0 : 1;
  renderCurrentPlayer();

  if (turn === 0) {
    playerPlays();
  } else {
    PCPlays();
  }
}

function playerPlays() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, i) => {
    const column = i % 3;
    const row = parseInt(i / 3);
    
    if (board[row][column] === "") {
      cell.addEventListener("click", (e) => {
        board[row][column] = "O";
        cell.textContent = board[row][column];
        PCPlays();
      });
    }
  });
}

function PCPlays() {
  renderCurrentPlayer();

  setTimeout(() => {
    let played = false;
    const options = checkIfCanWin();

    if (options.length > 0) {
      const bestOption = options[0];

      for (let i = 0; i < bestOption.length; i++) {
        if (bestOption[i].value === 0) {  //true quiere decir que esa casilla esta vacia
          const posi = bestOption[i].i;
          const posj = bestOption[i].j;
          board[posi][posj] = "X";  //en cuanto en cuentre la primera posicion la va a escribir y salir
          played = true;
          break;  
        }
      }
    } else {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === "" && !played) {
            board[i][j] = "X";
            played = true;
          }
        }
      }
    }
    turn = 0;
    renderBoard();
    renderCurrentPlayer();
    playerPlays();
  }, 500);
}

function checkIfCanWin() {
  const arr = JSON.parse(JSON.stringify(board)); //copia profunda del bard a un arreglo
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i][j] === "X"){
        arr[i][j] = {value: 1, i, j}; //sustituye la copia del tablero por objetos del tipo value
      }
      if (arr[i][j] === ""){
        arr[i][j] = {value: 0, i, j};
      }
      if (arr[i][j] === "O"){
        arr[i][j] = {value: -2, i, j};
      }
    }
  }

  //posiciones
  const p1 = arr[0][0];
  const p2 = arr[0][1];
  const p3 = arr[0][2];
  const p4 = arr[1][0];
  const p5 = arr[1][1];
  const p6 = arr[1][2];
  const p7 = arr[2][0];
  const p8 = arr[2][1];
  const p9 = arr[2][2];

  //soluciones
  const s1 = [p1, p2, p3];
  const s2 = [p4, p5, p6];
  const s3 = [p7, p8, p9];
  const s4 = [p1, p4, p7];
  const s5 = [p2, p5, p8];
  const s6 = [p3, p6, p9];
  const s7 = [p1, p5, p9];
  const s8 = [p3, p5, p7];

  //filtra y devuelve resultados
  const results = [s1, s2, s3, s4, s5, s6, s7, s8].filter((line) => {
    retrurn (
      line[0].value + line[1].value + line[2].value === 2 ||
      line[0].value + line[1].value + line[2].value === -4
    );
  });

  return results;
}

function renderCurrentPlayer() {
  playerDiv.textContent = `${turn === 0 ? "Player turn": "PC turn"}`;
}

function renderBoard() {
  const html = board.map((row) => {
    const cells = row.map((cell) => {
      return `<button class="cell">${cell}</button>`;
    });
    return `<div class="row">${cells.join('')}</div>`;
  });

  boardContainer.innerHTML = html.join("");
}