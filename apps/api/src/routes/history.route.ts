import express from "express";
import { HistoryController } from "../controllers";

const historyRouter = express.Router()

historyRouter.get("/", HistoryController.getAll)

export default historyRouter