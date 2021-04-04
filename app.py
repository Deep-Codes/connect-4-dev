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


@app.route('/game', methods=['GET', 'POST'])
def game():
    return render_template('game.html')


@socketio.on('board', namespace='/game')
def board(dt):
    emit('board', dt, broadcast=True)


@socketio.on('move', namespace='/game')
def move(name):
    emit('move', name, broadcast=True)


@socketio.on('join', namespace='/game')
def join(msg):
    print('DISCONNECTTTTTTT     TTTTT')
    emit('status', msg, broadcast=True)


@socketio.on('text', namespace='/game')
def text(msg):
    emit('message', msg, broadcast=True)


@socketio.on('left', namespace='/game')
def left(msg):
    emit('status', msg, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
