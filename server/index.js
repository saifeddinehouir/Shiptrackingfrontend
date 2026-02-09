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
  console.log("New client connected", socket.id)
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

server.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`Server listening on port ${PORT}`)
});

// Connect to the AIS data stream   

const WebSocket = require('ws');
let aisSocket = null;
let lastMessageTime = Date.now();
const lastEmittedTimes = new Map(); // mmsi -> timestamp

function connectToAIS() {
  if (aisSocket) {
    try { aisSocket.terminate(); } catch (e) { }
  }

  console.log("Connecting to AISStream Global Feed...");
  aisSocket = new WebSocket("wss://stream.aisstream.io/v0/stream");

  aisSocket.onopen = function (_) {
    console.log("AIS Connection Opened - Subscribing...");
    let subscriptionMessage = {
      Apikey: "97bc2d0359b033cb9e1b46df5dcf78e4885dcd78",
      BoundingBoxes: [[[-90, -180], [90, 180]]],
      FilterMessageTypes: ["PositionReport", "ShipStaticData"]
    }
    aisSocket.send(JSON.stringify(subscriptionMessage));
  };

  aisSocket.onmessage = function (event) {
    lastMessageTime = Date.now();
    try {
      let aisMessage = JSON.parse(event.data);
      let enrichedData = { ...aisMessage.MetaData };

      if (aisMessage.MessageType === "PositionReport" && aisMessage.Message.PositionReport) {
        enrichedData = { ...enrichedData, ...aisMessage.Message.PositionReport };
      } else if (aisMessage.MessageType === "ShipStaticData" && aisMessage.Message.ShipStaticData) {
        enrichedData = { ...enrichedData, ...aisMessage.Message.ShipStaticData };
      }

      const mmsi = enrichedData.MMSI;
      const now = Date.now();
      const lastTime = lastEmittedTimes.get(mmsi) || 0;

      // THROTTLE: Only emit if 10 seconds passed since last emission for this ship
      if (now - lastTime < 10000) return;

      const lat = enrichedData.Latitude ?? enrichedData.latitude;
      const lon = enrichedData.Longitude ?? enrichedData.longitude;

      if (typeof lat === 'number' && typeof lon === 'number' &&
        lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        lastEmittedTimes.set(mmsi, now);
        io.to("aisRoom").emit("aisData", enrichedData);
      }
    } catch (e) {
      // Silence parsing errors unless debugging
    }
  };

  aisSocket.onclose = (event) => {
    console.warn(`AIS WebSocket closed (${event.code})`);
    setTimeout(connectToAIS, 5000);
  };

  aisSocket.onerror = (err) => {
    aisSocket.close();
  };
};

// Cleanup old emission tracking every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [mmsi, time] of lastEmittedTimes) {
    if (now - time > 600000) lastEmittedTimes.delete(mmsi);
  }
}, 600000);

// Auto-reset watchdog: if no message for 60 seconds, reconnect
setInterval(() => {
  if (Date.now() - lastMessageTime > 60000) {
    console.warn("AIS connection seems dead (no messages for 60s). Resetting...");
    connectToAIS();
  }
}, 30000);

connectToAIS();