const addBtn = document.querySelector('#add');
const subBtn = document.querySelector('#sub');
const resetBtn = document.querySelector('#reset');
const val = document.querySelector('#count');

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
