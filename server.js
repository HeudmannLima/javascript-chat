const express = require('express');
const path = require('path');

const app = express();

// Definindo protocolo HTTP pro nosso servidor express
const server = require('http').createServer(app);
// ADD protocolo WEBSOCKET(WSS) protoc assim como http no nosso app
const io = require('socket.io')(server);

// para o nosso server acessar o front na pasta public
// definindo aq a view front será lá, usando HTML como engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
})

// Esse array mantem o historico e tbm manda pra todos
let messages = [];

io.on('connection', socket => {
  console.log(`Socket Conectado: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    // console.log(data);
    messages.push(data);

    //.emit (envia msg) | .on (ouve os emits) 
    // .broadcast (envia p todos sockets conectados)
    // este broadcast vai enviar pras outras pessoas no chat
    socket.broadcast.emit('receivedMessage', data);
  })
})

server.listen(3000);