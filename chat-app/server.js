import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3001;

const server = http.createServer((req, res) => {
  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
      return;
    }
    
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get("username");
  
  // Broadcast system message: user joined
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(JSON.stringify({
        type: "system",
        text: `${username} joined`
      }));
    }
  });
  
  socket.on("message", (data) => {
    const parsed = JSON.parse(data.toString());
    
    // Broadcast chat message to all clients (including sender)
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: "chat",
          username: parsed.username,
          text: parsed.text
        }));
      }
    });
  });
  
  socket.on("close", () => {
    // Broadcast system message: user left
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: "system",
          text: `${username} left`
        }));
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});