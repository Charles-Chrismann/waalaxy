import express from "express";
import actionRouter from "./action.route";
import queueRouter from "./queue.route";
import creditRouter from "./credit.route";
import historyRouter from "./history.route";

const appRouter = express.Router()

appRouter.use('/actions', actionRouter)
appRouter.use('/queue', queueRouter)
appRouter.use('/credits', creditRouter)
appRouter.use('/history', historyRouter)

export default appRouter