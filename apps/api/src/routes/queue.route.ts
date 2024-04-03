import express from "express";
import schemaValidator from "../middlewares/schema-validator.middleware";
import { QueueController } from "../controllers";

const queueRouter = express.Router()

queueRouter.post("/", schemaValidator('/queue'), QueueController.create)
queueRouter.post("/reorder", schemaValidator('/queue/reorder'), QueueController.reorder)
queueRouter.get("/", QueueController.getall)
queueRouter.delete("/:id", QueueController.delete)

export default queueRouter