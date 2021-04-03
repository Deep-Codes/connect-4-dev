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


@socketio.on('count', namespace='/')
def count(num):
    emit('count', {'count': num, 'data': data}, broadcast=True)


@socketio.on('status', namespace='/')
def status(dt):
    emit('status', {'msg': dt})


if __name__ == '__main__':
    socketio.run(app)
