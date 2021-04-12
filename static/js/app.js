const board = document.querySelector('#board');
const chatFeed = document.querySelector('#chat-feed');
const sendBtn = document.querySelector('#chat-send-btn');
const leaveBtn = document.querySelector('#leave-chat-btn');
const chatInput = document.querySelector('#chat-input');
let playerCurr = null;
let bluePlayer = null;
let redPlayer = null;
let winState = false;

// let data = [...Array(8)].map(() =>
//   Array(8).fill({
//     player: Math.floor(Math.random() * 2) + 1,
//     value: Math.floor(Math.random() * 2),
//   })
// );

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(room);

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

const xCompute = () => {
  let bool = false;
  let rowV = null;
  let colV = null;
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
        bool = true;
        rowV = row;
        colV = col;
      }
    }
  }
  return {
    bool,
    row: rowV,
    col: colV,
  };
};

const yCompute = () => {
  let bool = false;
  let rowV = null;
  let colV = null;
  for (let col = 0; col <= 6; col++) {
    for (let row = 0; row < 3; row++) {
      if (
        checkWinner(
          document.querySelector(`#c${row}${col}`).style.backgroundColor,
          document.querySelector(`#c${row + 1}${col}`).style.backgroundColor,
          document.querySelector(`#c${row + 2}${col}`).style.backgroundColor,
          document.querySelector(`#c${row + 3}${col}`).style.backgroundColor
        )
      ) {
        bool = true;
        rowV = row;
        colV = col;
      }
    }
  }
  return {
    bool,
    row: rowV,
    col: colV,
  };
};

const diagCompute1 = () => {
  let bool = false;
  let rowV = null;
  let colV = null;
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
      if (
        checkWinner(
          document.querySelector(`#c${row}${col}`).style.backgroundColor,
          document.querySelector(`#c${row + 1}${col + 1}`).style
            .backgroundColor,
          document.querySelector(`#c${row + 2}${col + 2}`).style
            .backgroundColor,
          document.querySelector(`#c${row + 3}${col + 3}`).style.backgroundColor
        )
      ) {
        bool = true;
        rowV = row;
        colV = col;
      }
    }
  }
  return {
    bool,
    row: rowV,
    col: colV,
  };
};

const diagCompute2 = () => {
  let bool = false;
  let rowV = null;
  let colV = null;
  for (let col = 0; col < 4; col++) {
    for (let row = 5; row > 2; row--) {
      if (
        checkWinner(
          document.querySelector(`#c${row}${col}`).style.backgroundColor,
          document.querySelector(`#c${row - 1}${col + 1}`).style
            .backgroundColor,
          document.querySelector(`#c${row - 2}${col + 2}`).style
            .backgroundColor,
          document.querySelector(`#c${row - 3}${col + 3}`).style.backgroundColor
        )
      ) {
        bool = true;
        rowV = row;
        colV = col;
      }
    }
  }
  return {
    bool,
    row: rowV,
    col: colV,
  };
};

let computeWinner = () => {
  let row;
  let col;
  const xComp = xCompute();
  const yComp = yCompute();
  const diagComp1 = diagCompute1();
  const diagComp2 = diagCompute2();
  if (xComp.bool) {
    row = xComp.row;
    col = xComp.col;
  }
  if (yComp.bool) {
    row = yComp.row;
    col = yComp.col;
  }
  if (diagComp1.bool) {
    row = diagComp1.row;
    col = diagComp1.col;
  }
  if (diagComp2.bool) {
    row = diagComp2.row;
    col = diagComp2.col;
  }
  if (xComp.bool || yComp.bool || diagComp1.bool || diagComp2.bool) {
    if (
      document.querySelector(`#c${row}${col}`).style.backgroundColor === 'red'
    ) {
      winState = true;
      chatFeed.value =
        chatFeed.value + `🎉 ${redPlayer.toUpperCase()}: has WON !!! .` + '\n';
    } else if (
      document.querySelector(`#c${row}${col}`).style.backgroundColor === 'blue'
    ) {
      winState = true;
      chatFeed.value =
        chatFeed.value +
        `🎉 ${playerCurr.toUpperCase()} : has WON !!! .` +
        '\n';
    }
  }
};

const scrollUpChatFeed = () => {
  document.getElementById('chat-feed').scrollTop = document.getElementById(
    'chat-feed'
  ).scrollHeight;
};

let socket;
document.addEventListener('DOMContentLoaded', () => {
  socket = io.connect(
    'http://' + document.domain + ':' + location.port + '/game'
  );

  board.addEventListener('click', (e) => {
    if (e.target.className === 'cell' && !winState) {
      const id = e.target.id;
      // avoid re selecting the cell
      if (boardData[id[1]][[id[2]]].value === null) {
        scrollUpChatFeed();
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
    socket.emit('join', {
      text: `🚀 ${username.toUpperCase()} has joined the chat `,
      room: room,
    });
  });

  socket.on('status', (msg) => {
    if (msg.room === room) {
      chatFeed.value = chatFeed.value + msg.text + '\n';
    }
  });

  socket.on('message', (msg) => {
    chatFeed.value = chatFeed.value + msg + '\n';
  });

  sendBtn.addEventListener('click', () => {
    scrollUpChatFeed();
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
  document.querySelector('#logo').src = `/static/${e.target.value}.svg`;
  html.dataset.theme = `theme-${e.target.value}`;
});
