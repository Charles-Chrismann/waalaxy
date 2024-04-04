import express from "express";
import { createServer } from "http";
import appRouter from "./routes";

const app = express()
const server = createServer(app)

app.use(express.static('dist/frontend'))
app.use(express.json())
app.use('/api', appRouter)



export {app, server}