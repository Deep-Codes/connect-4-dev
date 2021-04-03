const board = document.querySelector('#board');

// let data = [...Array(8)].map(() =>
//   Array(8).fill({
//     player: Math.floor(Math.random() * 2) + 1,
//     value: Math.floor(Math.random() * 2),
//   })
// );

let boardData = [...Array(8)].map(() =>
  Array(8).fill({ player: null, value: null })
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
  socket = io.connect('http://' + document.domain + ':' + location.port + '/');

  board.addEventListener('click', (e) => {
    if (e.target.className === 'cell') {
      const id = e.target.id;
      console.log(id);
      const player = Math.floor(Math.random() * 2) + 1;
      boardData[id[1]][[id[2]]] = { player, value: 1 };
      // console.log(data[id[1]][[id[1]]]);
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
  });

  socket.on('board', (data) => {
    boardData = data['data']['data'];
    renderBoard(boardData);
    console.log(boardData);
  });
});
