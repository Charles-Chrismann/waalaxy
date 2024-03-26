import express from "express";
import schemaValidator from "../middlewares/schema-validator.middleware";
import { ActionController } from "../controllers";

const actionRouter = express.Router()

actionRouter.get("/", ActionController.getAll)

export default actionRouter