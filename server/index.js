const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const PORT = process.env.PORT || 5000;
const router = require('./router');


io.on('connect',(socket)=>{
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
    
        if(error) return callback(error);
    
        socket.join(user.room);
    
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
        callback();
      });

    socket.on('code-change',(code)=>{
        const user=getUser(socket.id);
        if(user){
            io.to(user.room).emit('code-update',code);
        }
            // socket.broadcast.to(user.room).emit('code-update', code);
        // io.to(user.room).broadcast.emit('code-update',code),code-update
        // console.log(code);
        // socket.broadcast.emit('code-update',code);
    });
    socket.on('canvas-data',(data)=>{
        const user=getUser(socket.id);
        if(user)
            io.to(user.room).emit('canvas-data',data);
    })
    socket.on('chatMessage', (message, callback) => {
        const user = getUser(socket.id);
        console.log(user);
        if(user)
            io.to(user.room).emit('message', { user: user.name, text: message });
    
        callback();
      });
    socket.on('disconnect', (evt) => {
        const user=removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the room`});
            console.log(`${user.name} has left`)
        }
    })
})

io.on('disconnect', (evt) => {
    const user=removeUser(socket.id);
    if(user){
        io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left the room`});
        console.log('SOMEONE LEFT')
    }
})

app.use(router);

server.listen(PORT, () => {
    console.log(`Server Listening ${PORT}`);
})
