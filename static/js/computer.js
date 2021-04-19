const board = document.querySelector('#board');
const chatFeed = document.querySelector('#chat-feed');
const leaveBtn = document.querySelector('#leave-chat-btn');
const restartBtn = document.querySelector('#restart-btn');
const audio = document.querySelector('#audio');
const usernameText = document.querySelector('#username');

document.getElementById('restart-btn').addEventListener('click', () => {
  location.href = '/computer';
});

document.getElementById('leave-chat-btn').addEventListener('click', () => {
  location.href = '/';
});

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
renderBoard(boardData);

// https://stackoverflow.com/questions/33181356/connect-four-game-checking-for-wins-js
function chkLine(a, b, c, d) {
  // Check first cell non-zero and all cells match
  return a != 0 && a == b && a == c && a == d;
}

function chkWinner(bd) {
  // Check down
  for (r = 0; r < 3; r++)
    for (c = 0; c < 7; c++)
      if (chkLine(bd[r][c], bd[r + 1][c], bd[r + 2][c], bd[r + 3][c]))
        return bd[r][c];

  // Check right
  for (r = 0; r < 6; r++)
    for (c = 0; c < 4; c++)
      if (chkLine(bd[r][c], bd[r][c + 1], bd[r][c + 2], bd[r][c + 3]))
        return bd[r][c];

  // Check down-right
  for (r = 0; r < 3; r++)
    for (c = 0; c < 4; c++)
      if (
        chkLine(bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3])
      )
        return bd[r][c];

  // Check down-left
  for (r = 3; r < 6; r++)
    for (c = 0; c < 4; c++)
      if (
        chkLine(bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3])
      )
        return bd[r][c];

  return 0;
}

const computeWinnerComp = (dt) => {
  let winner = chkWinner(dt);
  if (winner === -1) {
    chatFeed.value = chatFeed.value + '🎉 YOU BEAT THE COMPUTER! \n';
    audio.src = './static/media/win.mp3';
    audio.play();
  } else if (winner === 1) {
    chatFeed.value = chatFeed.value + '🤖 COMPUTER has WON! \n';
    audio.src = './static/media/win.mp3';
    audio.play();
  } else {
  }
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

const postRequest = (dt) => {
  fetch(`http://127.0.0.1:5000/computer?board=${JSON.stringify(dt)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      playMoves(`c0${data}`, 1);
      chatFeed.value = chatFeed.value + '🤖 COMPUTER Played a Move! \n';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const scrollUpChatFeed = () => {
  chatFeed.scrollTop = chatFeed.scrollHeight;
};

board.addEventListener('click', (e) => {
  if (e.target.className === 'cell') {
    const id = e.target.id;
    // avoid re selecting the cell
    if (boardData[id[1]][[id[2]]] === 0) {
      audio.play();
      playMoves(id, -1);
      chatFeed.value = chatFeed.value + '🎮 YOU Played a Move! \n';
      postRequest(boardData);
      setTimeout(() => {
        computeWinnerComp(boardData);
        scrollUpChatFeed();
      }, 100);
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
