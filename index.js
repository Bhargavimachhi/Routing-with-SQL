const http = require('http');
const app = require('./app.js');
const PORT = process.env.PORT;
const server = http.createServer(app);
const {Server} = require('socket.io');
const path = require('path');
const onSocket = require('./public/socket.js');

const io = new Server(server);
onSocket(io);

startServer();

function startServer(){
    server.listen(PORT,()=>{
        console.log(`Server is live at http://localhost:${PORT} ....`);
    });
}