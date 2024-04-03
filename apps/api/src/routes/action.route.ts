import express from "express";
import { ActionController } from "../controllers";

const actionRouter = express.Router()

actionRouter.get("/", ActionController.getAll)

export default actionRouter