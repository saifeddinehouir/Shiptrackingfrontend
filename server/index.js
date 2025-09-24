const WebSocket = require('ws');
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
    
    console.log(aisMessage);
};
