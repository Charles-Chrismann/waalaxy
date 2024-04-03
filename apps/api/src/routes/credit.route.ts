import express from "express";
import { CreditController } from "../controllers";

const creditRouter = express.Router()

creditRouter.get("/", CreditController.getall)

export default creditRouter