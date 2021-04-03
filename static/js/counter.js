const addBtn = document.querySelector('#add');
const subBtn = document.querySelector('#sub');
const resetBtn = document.querySelector('#reset');
const val = document.querySelector('#count');
const board = document.querySelector('#board');
let data = [...Array(8)].map(() =>
  Array(8).fill({
    player: Math.floor(Math.random() * 2) + 1,
    value: Math.floor(Math.random() * 2),
  })
);

console.log(data);

board.addEventListener('click', (e) => {
  if (e.target.className === 'cell') {
    const id = e.target.id;
    document.querySelector(`#${id}`).style.backgroundColor = 'red';
  }
});

data.forEach((r, i) => {
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
      } else {
        cell.style.backgroundColor = 'blue';
      }
    }
    row.appendChild(cell);
  });
  board.appendChild(row);
});

let counter = 0;
let initVal = 0;
val.innerHTML = counter;

let socket;
document.addEventListener('DOMContentLoaded', () => {
  socket = io.connect('http://' + document.domain + ':' + location.port + '/');

  addBtn.addEventListener('click', () => {
    counter++;
    socket.emit('count', { count: counter });
  });
  reset.addEventListener('click', () => {
    counter = initVal;
    socket.emit('count', { count: counter });
  });
  subBtn.addEventListener('click', () => {
    counter--;
    socket.emit('count', { count: counter });
  });

  socket.on('count', (data) => {
    val.innerHTML = data['count']['count'];
  });
});
