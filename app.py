from flask import Flask, render_template, url_for, request, redirect, session
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_session import Session
import smtplib  # for sending mail / automation
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

slurs = ['fuck', 'bitch', 'cunt', 'ass', 'arse', 'dumbfuck', 'motherfucker', 'dick', 'titties', 'thekku', 'boobs',
         'vagina', 'shite', 'wank', 'shit', 'porn', 'chutiya', 'bc', 'madarchod', 'lodu', 'randi', 'nigga', 'nigger']

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


@socketio.on('init', namespace='/game')
def init(name):
    emit('init', name, broadcast=True)


@socketio.on('join', namespace='/game')
def join(msg):
    emit('status', msg, broadcast=True)


@socketio.on('text', namespace='/game')
def text(msg):
    for i in slurs:
        if msg['text'].find(i) != -1:
            msg['text'] = msg['text'].replace(i, "*"*len(i))
    emit('message', msg, broadcast=True)


@socketio.on('left', namespace='/game')
def left(msg):
    emit('status', msg, broadcast=True)

# invite-code


@app.route('/invite', methods=['GET', 'POST'])
def invite():
    if request.method == "POST":
        player_name = request.form.get("username").replace(" ", "")
        player_room = request.form.get("room")
        invite_name = request.form.get("i-name").replace(" ", "")
        invite_mail = request.form.get("i-email")
        invite_link = 'http://localhost:5000/game?username=' + \
            invite_name + '&room=' + player_room

        gmail = 'connect.04.auth@gmail.com'
        password = 'damk.connect4'
        subject = 'Invite Link For Connect-4 by ' + player_name
        text = 'Email Body'

        html = """\
            <html>
              <head></head>
              <body>
               <img src="https://i.postimg.cc/c4H0hC8g/logo.png" alt="logo" width="200px" >
              <h3>Your have been invited to play Connect-4 by  """ + str(player_name) + """</h3>
              <h4> Here's Link : 
                <a href=" """ + str(invite_link) + """ ">Play the Game</a>
              </h4>
              </body>
            </html>
            """
        msg = MIMEMultipart('alternative')
        msg['From'] = gmail
        msg['To'] = invite_mail
        msg['Subject'] = subject

        html_code = MIMEText(html, 'html')
        msg.attach(html_code)
        message = msg.as_string()

        s = smtplib.SMTP('smtp.gmail.com', 587)
        s.starttls()
        s.login(gmail, password)

        s.sendmail(gmail, invite_mail, message)
        s.quit()

    return render_template('invite.html')

# invite-end


if __name__ == '__main__':
    socketio.run(app)
