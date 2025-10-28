const PORT = process.env.PORT || 5000
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("New client connected",socket.id)
    socket.join("aisRoom");
    socket.on("disconnect", (reason) => {
        console.log(`Client disconnected: ${reason}`)
    })

    socket.on("aisData", (data) => {
        io.emit("aisData", data) // Broadcast the AIS data to all connected clients
    })
})

setInterval(() => {
    io.to("aisRoom").emit("time", new Date().toISOString())
}, 1000)

server.listen(PORT, err => {if(err) console.log(err);
    console.log(`Server listening on port ${PORT}`)
});

// Connect to the AIS data stream   

const WebSocket = require('ws');
function connectToAIS(){
        const socket = new WebSocket("wss://stream.aisstream.io/v0/stream");

        socket.onopen = function (_) {
        let subscriptionMessage = {
             Apikey: "97bc2d0359b033cb9e1b46df5dcf78e4885dcd78",
             BoundingBoxes: [[[-90, -180], [90, 180]]],
             FilterMessageTypes: ["PositionReport"] // Optional!
            }
        socket.send(JSON.stringify(subscriptionMessage));
        };

        socket.onmessage = function (event) {
        let aisMessage = JSON.parse(event.data);
        io.to("aisRoom").emit("aisData", aisMessage.MetaData);
         console.log(aisMessage.MetaData);
        };

        socket.onclose = (event) => {
         console.warn(
             `AIS WebSocket closed (${event.code}): ${event.reason || "no reason"}`
            );
         console.log("Reconnecting to AIS in 5 seconds...");
         setTimeout(connectToAIS, 5000);
  };};

  connectToAIS();