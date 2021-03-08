const { count } = require('console');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

let connectedUsers = 0;
let stockingMessages = [];

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('Server ready');
  });

io.on ('connection', (socket) => {
    console.log('Utilisateur connecté')
    io.emit('chat message', `Un utilisateur s'est connecté`);
    socket.emit('stocked messages', stockingMessages);
    connectedUsers++;


    socket.on('disconnect', () => {
        console.log('Utilisateur deconnecté');
        io.emit('chat message', `Un utilisateur s'est déconnecté`);
        connectedUsers--;
        countUsers(connectedUsers);

      });
      countUsers(connectedUsers);

      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        stockingMessages.push(msg)
        console.log(stockingMessages);
        
      });

      function countUsers(users) {
        
        io.emit('connectedUsers', connectedUsers)

        console.log(`Utilisateurs en ligne : ${connectedUsers}`)
      }
})
