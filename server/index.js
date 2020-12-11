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


io.on('connection',(socket)=>{
    socket.on('join',({name,room},callback)=>{
        const {error,user}=addUser({id:socket.id,name,room});
        if(error) {
            console.log(error);
            return error;
        }
        socket.join(user.room);
        console.log(user.room);
    })

    socket.on('code-change',(code)=>{
        console.log(socket.id);
        const user=getUser(socket.id);
        console.log(socket.id);
        if(user)
            socket.broadcast.to(user.room).emit('code-update', code);
        // io.to(user.room).broadcast.emit('code-update',code),code-update
        // console.log(code);
        // socket.broadcast.emit('code-update',code);
    });
    socket.on('disconnect', (evt) => {
        console.log('SOMEONE LEFT')
    })
})

io.on('disconnect', (evt) => {
    console.log('SOMEONE LEFT')
})

app.use(router);

server.listen(PORT, () => {
    console.log(`Server Listening ${PORT}`);
})
