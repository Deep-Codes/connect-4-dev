from flask import Flask, render_template, url_for, request, redirect, session
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_session import Session

# FLASK_APP = app.py
# FLASK_ENV = development
# FLASK_DEBUG = 0

data = [1, 2, 3, 4, 5]

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret_key'
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)

socketio = SocketIO(app, manage_session=False)


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'POST':
        username = request.form['username']
        room = request.form['room']
        session['username'] = username
        session['room'] = room
        return render_template('game.html', session=session)
    else:
        if session.get('username') is not None:
            return render_template('game.html', session=session)
        else:
            return redirect(url_for('index'))


@socketio.on('join', namespace='/game')
def join():
    room = session.get('room')
    session.clear()
    join_room(room)
    emit('status', {'msg': session.get('username') +
                    ' has entered the room.'}, room=room)


@socketio.on('text', namespace='/game')
def text(message):
    print('DOES THIS MESSAGE COME')
    room = session.get('room')
    emit('message', {'msg': session.get('username') +
                     ' : ' + message['msg']}, room=room, broadcast=True)


@socketio.on('left', namespace='/game')
def left(message):
    room = session.get('room')
    username = session.get('username')
    leave_room(room)
    session.clear()
    emit('status', {'msg': username + ' has left the room.'}, room=room)


@app.route('/game', methods=['GET', 'POST'])
def game():
    return render_template('game.html')


@socketio.on('board', namespace='/game')
def board(dt):
    emit('board', {'data': dt}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
