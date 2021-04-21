const { count } = require('console');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

client.connect((err, db) => {
  if (err) {
    process.exit(1);
  } else {
    let dbo = db.db('nodejsTpChat');
    console.log("Bdd connected")
    let connectedUsers = 0;

    let stockedMessages = [];

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    http.listen(3000, () => {
        console.log('Server ready');
      });

    io.on ('connection', (socket) => {
        console.log('Utilisateur connecté')
        io.emit('chat message', `Un utilisateur s'est connecté`);

        dbo.collection("messages").find({}, { projection: { _id: 0 } }).toArray(function(err, result) {
          if (err) throw err;
          for (let i = 0; i < result.length; i++) {
            //stockedMessages.push(result[i].message);
            console.log(result.length);
            console.log(result[i].message);
            socket.emit('stocked messages', result[i].message);
          }
          
        })
        console.log(stockedMessages);
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
            let obj = {message: msg}
            dbo.collection('messages').insertOne(obj, function(err, res) {
              if (err) throw err;
              console.log("Message inserted")
            })
          });

          function countUsers(users) {
            
            io.emit('connectedUsers', connectedUsers)

            console.log(`Utilisateurs en ligne : ${connectedUsers}`)

          }
    })
  }
})


