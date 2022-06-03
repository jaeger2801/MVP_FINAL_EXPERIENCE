
const express = require('express');
const os = require('os')
const cors = require('cors');
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
const app = express();
const httpServer = app.listen(5050);
const ioServer = new Server(httpServer);

const staticDisplay = express.static('public-display');
app.use('/display', staticDisplay);
app.use(express.json());

const staticPhone = express.static('public-phone');
app.use('/phone', staticPhone);
app.use(express.json());

ioServer.on('connection', (socket) => {
        //socket.broadcast.emit('positions', characterMessage);
        //socket.broadcast.emit('cambio1->2', pantalla1A2);

    socket.on('cambioRegistro', (cambioAlRegistro) => {
        socket.broadcast.emit('cambioRegistro', cambioAlRegistro);
    })

    socket.on('like', () => {
        socket.broadcast.emit('like');
    })

});

//---------------------------- Firebase configuration
const db = require('./firebaseConfig');

const addParticipant = async function (participant) {
    const res = await db.collection('participants').add(participant);
    console.log('Added document with ID: ', res.id);
}
//---------------------------- "use" external midleware
app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use('/app', express.static('public'));

//------------------------------------------------this opens a port

const protocolConfiguration = {
    path: '/dev/cu.usbmodem14301',
    baudRate: 9600
}

const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser());


parser.on('data', (data) => {

    let dataArray = data.split(' ');
    //console.log(dataArray);

    let si = parseInt(dataArray[0]);
    let no = parseInt(dataArray[1]);
    let verify = parseInt(dataArray[2]);
    let jump = parseInt(dataArray[2]);


    if (si < 20){
        ioServer.emit('cambio', "sumar"); 
    }

    if (no < 20){
        ioServer.emit('cambio', "restar");
    }

    if (verify < 60){
        ioServer.emit('verifica', "cambioPantalla");
    }

    if (jump < 60){
        ioServer.emit('skipping', "cuentaSkipping");
    }

    }
);

app.post('/participant', (request, response) => {
    console.log(request.body)
    addParticipant(request.body);
    response.end();
    //console.log(players);
});






















