const board = document.querySelector('#board');
const chatFeed = document.querySelector('#chat-feed');
const sendBtn = document.querySelector('#chat-send-btn');
const leaveBtn = document.querySelector('#leave-chat-btn');
const chatInput = document.querySelector('#chat-input');
const usernameField = document.querySelector('#username');
let playerCurr = null;
let bluePlayer = null;
let redPlayer = null;

// let data = [...Array(8)].map(() =>
//   Array(8).fill({
//     player: Math.floor(Math.random() * 2) + 1,
//     value: Math.floor(Math.random() * 2),
//   })
// );

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

usernameField.innerHTML = `👋🏽 Welcome ${username.toUpperCase()} !`;

let boardData = [...Array(6)].map(() =>
  Array(7).fill({ player: null, value: null })
);

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
      if (c.value !== null) {
        if (c.player === redPlayer) {
          cell.style.backgroundColor = 'red';
        } else {
          cell.style.backgroundColor = 'blue';
        }
      }
      row.appendChild(cell);
    });
    board.appendChild(row);
  });
};

renderBoard(boardData);

const playMoves = (id) => {
  const col = id[2];
  let fillRowNo;
  let bool = false;
  for (let c = 5; c >= 0; c--) {
    if (boardData[c][col].value === null && !bool) {
      fillRowNo = c;
      bool = true;
    }
  }
  if (playerCurr === redPlayer) {
    boardData[fillRowNo][[id[2]]] = { player: playerCurr, value: 1 };
  } else {
    boardData[fillRowNo][[id[2]]] = { player: playerCurr, value: 0 };
  }
  const cell = document.querySelector(`#${id}`);
  if (playerCurr === redPlayer) {
    cell.style.backgroundColor = 'red';
  } else {
    cell.style.backgroundColor = 'blue';
  }
};

function checkWinner(one, two, three, four) {
  return (
    one === two &&
    one === three &&
    one === four &&
    one !== '' &&
    one !== undefined
  );
}

let computeWinner = () => {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        checkWinner(
          document.querySelector(`#c${row}${col}`).style.backgroundColor,
          document.querySelector(`#c${row}${col + 1}`).style.backgroundColor,
          document.querySelector(`#c${row}${col + 2}`).style.backgroundColor,
          document.querySelector(`#c${row}${col + 3}`).style.backgroundColor
        )
      ) {
        if (
          document.querySelector(`#c${row}${col}`).style.backgroundColor ===
          'red'
        ) {
          console.log('We have a Winner');
          chatFeed.value =
            chatFeed.value +
            `🎉 ${redPlayer.toUpperCase()}: has WON !!! .` +
            '\n';
        } else {
          chatFeed.value =
            chatFeed.value + `🎉 'Blue Player : has WON !!! .` + '\n';
        }
      }
    }
  }
};

let socket;
document.addEventListener('DOMContentLoaded', () => {
  socket = io.connect(
    'http://' + document.domain + ':' + location.port + '/game'
  );

  board.addEventListener('click', (e) => {
    if (e.target.className === 'cell') {
      const id = e.target.id;
      // avoid re selecting the cell
      if (boardData[id[1]][[id[2]]].value === null) {
        // ? if no has played yet
        // ? set the player as `playerCurr`
        if (playerCurr === null) {
          // * emit a socket for 1st move
          // * to set color
          socket.emit('init', username);
          playerCurr = username;
          socket.emit('move', username);
          playMoves(id);
          socket.emit('board', boardData);
          computeWinner();
        } else {
          // ? if atleast 1 player has played
          // ? don't let the `playerCurr play`
          if (playerCurr === username) {
            // ! no moves played
          }
          // ? let the other user play
          // ? set that player as `playerCurr`
          else {
            playerCurr = username;
            socket.emit('move', username);
            playMoves(id);
            socket.emit('board', boardData);
          }
        }
      }
    }
  });

  socket.on('board', (data) => {
    // * update the state
    // * or the game will plahy it's own game over
    boardData = data;
    renderBoard(data);
    computeWinner(boardData);
  });

  socket.on('move', (name) => {
    playerCurr = name;
    chatFeed.value =
      chatFeed.value + `🎮 ${name.toUpperCase()}: played a move.` + '\n';
  });

  socket.on('init', (name) => {
    redPlayer = name;
  });

  socket.on('connect', () => {
    socket.emit('join', `🚀 ${username.toUpperCase()} has joined the chat `);
  });

  socket.on('status', (msg) => {
    chatFeed.value = chatFeed.value + msg + '\n';
  });

  socket.on('message', (msg) => {
    chatFeed.value = chatFeed.value + msg + '\n';
  });

  sendBtn.addEventListener('click', () => {
    socket.emit('text', `💬 ${username.toUpperCase()}: ${chatInput.value}`);
    chatInput.value = '';
  });

  leaveBtn.addEventListener('click', () => {
    socket.emit('left', `💀 ${username.toUpperCase()} has left the chat `);
    window.location.href = '/';
  });
});

// theme stuff here

const themeSelect = document.querySelector('#theme-select');
themeSelect.addEventListener('change', (e) => {
  const html = document.querySelector('html');
  html.dataset.theme = `theme-${e.target.value}`;
});
