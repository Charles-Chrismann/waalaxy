import express from "express";
import schemaValidator from "../middlewares/schema-validator.middleware";
import { QueueController } from "../controllers";

const queueRouter = express.Router()

queueRouter.post("/", schemaValidator('/actions'), QueueController.create)
queueRouter.get("/", QueueController.getall)

export default queueRouter