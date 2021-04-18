const board = document.querySelector('#board');
const chatFeed = document.querySelector('#chat-feed');
const leaveBtn = document.querySelector('#leave-chat-btn');
const restartBtn = document.querySelector('#restart-btn');
const audio = document.querySelector('#audio');
const usernameText = document.querySelector('#username');

// ? create empty board data
let boardData = [...Array(6)].map(() => Array(7).fill(0));

const renderBoard = (dt) => {
  board.innerHTML = '';
  dt.forEach((r, i) => {
    const row = document.createElement('div');
    row.classList.add(`row`);
    row.id = `r${i}`;
    r.forEach((c, j) => {
      const cell = document.createElement('div');
      cell.classList.add(`cell`);
      cell.id = `c${i}${j}`;
      if (c === -1) {
        cell.style.backgroundColor = 'red';
      } else if (c === 1) {
        cell.style.backgroundColor = 'blue';
      }

      row.appendChild(cell);
    });
    board.appendChild(row);
  });
};

const playMoves = (id, player) => {
  const col = id[2];
  let fillRowNo;
  let bool = false;
  for (let c = 5; c >= 0; c--) {
    if (boardData[c][col] === 0 && !bool) {
      fillRowNo = c;
      bool = true;
    }
  }
  const cell = document.querySelector(`#c${fillRowNo}${id[2]}`);
  if (player === -1) {
    boardData[fillRowNo][[id[2]]] = -1;
    cell.style.backgroundColor = 'red';
  } else if (player === 1) {
    boardData[fillRowNo][[id[2]]] = 1;
    cell.style.backgroundColor = 'blue';
  }
};

renderBoard(boardData);

board.addEventListener('click', (e) => {
  if (e.target.className === 'cell') {
    const id = e.target.id;
    // avoid re selecting the cell
    if (boardData[id[1]][[id[2]]] === 0) {
      audio.play();
      playMoves(id, -1);
    }
  }
});

// theme stuff here
const themeSelect = document.querySelector('#theme-select');
themeSelect.addEventListener('change', (e) => {
  const html = document.querySelector('html');
  document.querySelector('#logo').src = `/static/${e.target.value}.svg`;
  html.dataset.theme = `theme-${e.target.value}`;
});
