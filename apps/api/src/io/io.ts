import { Server } from "http"
import { Server as ioServer } from "socket.io";

class io {
  private io: ioServer | null = null

  createIo(server: Server) {
    this.io = new ioServer(server, {
      cors: {
        origin: "http://localhost:3000"
      }
    });
  }

  emit(ev: string, data: Record<string, any>) {
    if(!this.io) return
    this.io.emit(ev, data)
  }
}


export default new io()