const board = document.querySelector('#board');
const chatFeed = document.querySelector('#chat-feed');
const sendBtn = document.querySelector('#chat-send-btn');
const chatInput = document.querySelector('#chat-input');
const usernameField = document.querySelector('#username');

// let data = [...Array(8)].map(() =>
//   Array(8).fill({
//     player: Math.floor(Math.random() * 2) + 1,
//     value: Math.floor(Math.random() * 2),
//   })
// );

const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

usernameField.innerHTML = `Welcome ${username}`;

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
        if (c.player === 2) {
          cell.style.backgroundColor = 'red';
        } else if (c.player === 1) {
          cell.style.backgroundColor = 'blue';
        } else {
          cell.style.backgroundColor = 'grey';
        }
      }
      row.appendChild(cell);
    });
    board.appendChild(row);
  });
};

renderBoard(boardData);

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
        const col = id[2];
        let fillRowNo;
        let bool = false;
        for (let c = 5; c >= 0; c--) {
          if (boardData[c][col].value === null && !bool) {
            fillRowNo = c;
            bool = true;
          }
        }
        const player = Math.floor(Math.random() * 2) + 1;
        boardData[fillRowNo][[id[2]]] = { player, value: 1 };
        const cell = document.querySelector(`#${id}`);
        if (player === 2) {
          cell.style.backgroundColor = 'red';
        } else if (player === 1) {
          cell.style.backgroundColor = 'blue';
        } else {
          cell.style.backgroundColor = 'grey';
        }
        socket.emit('board', { data: boardData });
      }
    }
  });

  socket.on('board', (data) => {
    boardData = data['data']['data'];
    renderBoard(boardData);
    console.log(boardData);
  });

  socket.on('connect', () => {
    socket.emit('join');
  });

  socket.on('status', (data) => {
    chatFeed.value = chatFeed.value + '<' + data.msg + '>\n';
  });

  socket.on('message', (data) => {
    console.log('DOES THIS LISTEN TO MESSAGE');
    console.log(chatFeed.value);
    console.log(data.msg);
    chatFeed.value = chatFeed.value + data.msg + '\n';
  });

  sendBtn.addEventListener('click', (element) => {
    console.log('Click Works');
    const msgVal = chatInput.value;
    console.log(msgVal);
    chatInput.value = '';
    socket.emit('text', { msg: msgVal });
  });
});

function leave_room() {
  socket.emit('left', {}, function () {
    socket.disconnect();
    // go back to the login page
    window.location.href = "{{ url_for('index') }}";
  });
}
