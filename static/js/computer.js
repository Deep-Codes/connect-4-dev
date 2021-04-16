const board = document.querySelector('#board');
const chatFeed = document.querySelector('#chat-feed');
const leaveBtn = document.querySelector('#leave-chat-btn');
const restartBtn = document.querySelector('#restart-btn');
const audio = document.querySelector('#audio');
const usernameText = document.querySelector('#username');

// ? create empty board data
let data = [...Array(6)].map(() => Array(7).fill(0));

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
      if (c === 1) {
        cell.style.backgroundColor = 'red';
      } else if (c === 2) {
        cell.style.backgroundColor = 'blue';
      }

      row.appendChild(cell);
    });
    board.appendChild(row);
  });
};

renderBoard(data);

console.log(data);

// theme stuff here
const themeSelect = document.querySelector('#theme-select');
themeSelect.addEventListener('change', (e) => {
  const html = document.querySelector('html');
  document.querySelector('#logo').src = `/static/${e.target.value}.svg`;
  html.dataset.theme = `theme-${e.target.value}`;
});
