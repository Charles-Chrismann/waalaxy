import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import appRouter from "./routes";

const app = express()
const port = 3000
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

app.use(express.json())
app.use('/api', appRouter)

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

