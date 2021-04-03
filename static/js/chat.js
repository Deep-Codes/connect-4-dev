var socket;
document.addEventListener('DOMContentLoaded', () => {
  socket = io.connect(
    'http://' + document.domain + ':' + location.port + '/chat'
  );

  socket.on('connect', () => {
    socket.emit('join');
  });

  socket.on('status', (data) => {
    var chat = document.querySelector('#chat');
    chat.value = chat.value + '<' + data.msg + '>\n';
  });
  socket.on('message', (data) => {
    var chat = document.querySelector('#chat');
    chat.value = chat.value + data.msg + '\n';
  });
  var chat = document.querySelector('#send');
  chat.addEventListener('click', (element) => {
    var text = document.querySelector('#text').value;
    document.querySelector('#text').value = '';
    socket.emit('text', { msg: text });
  });
});

function leave_room() {
  socket.emit('left', {}, function () {
    socket.disconnect();
    // go back to the login page
    window.location.href = "{{ url_for('index') }}";
  });
}
