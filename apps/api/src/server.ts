import { server } from "./app";
import logger from "./logger/logger";
import jobManager from "./jobs/jobManager";
import io from "./io/io";
const port = process.env.PORT || 3000

io.createIo(server)
jobManager.startAllJobs()

server.listen(port, () => {
  logger.info(`Example app listening on port ${port}`)
})