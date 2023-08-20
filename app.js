const express=require('express')
const http=require('http')
const socketIo = require('socket.io');

const app=express();
const server = http.createServer(app); 
const io = socketIo(server);
const bodyParser=require('body-parser')
const sequelize=require('./util/chat')
const User=require('./models/user')
const group=require('./models/groups')
const userGroup=require('./models/usergroup')
const Chat=require('./models/chat')

const userRouter=require('./routes/user')
const chatRouter=require('./routes/chat')
const groupRouter=require('./routes/groups')
const path=require('path')
const cors=require('cors');
const { HasMany } = require('sequelize');
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'public','html')))
app.use(bodyParser.urlencoded({extended:false}))
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: 'YOUR_AWS_ACCESS_KEY',
    secretAccessKey: 'YOUR_AWS_SECRET_KEY'
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join-group', (groupId) => {
        socket.join(groupId);
    });

    socket.on('new-message', (messageData) => {
        io.to(messageData.groupId).emit('receive-message', messageData); //broadcast the message to all users in the group
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
app.use('/',userRouter)
app.use('/',chatRouter)
app.use('/',groupRouter)

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(userGroup);
userGroup.belongsTo(User);

group.hasMany(userGroup);
userGroup.belongsTo(group)

group.hasMany(Chat)
Chat.belongsTo(group);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

sequelize.sync({alter:true})
.then(()=>{
    
    console.log('database schema updated');
})
.catch((err)=>{
    console.log('error updating database schema:',err)
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});



