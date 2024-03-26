import express from "express";
import actionRouter from "./action.route";
import queueRouter from "./queue.route";

const appRouter = express.Router()

appRouter.use('/actions', actionRouter)
appRouter.use('/queue', queueRouter)

export default appRouter