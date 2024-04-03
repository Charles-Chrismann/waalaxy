import { Request, Response } from "express";
import prisma from "../db/prismaClient";

class HistoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const history = await prisma.history.groupBy({
        by: ['actionId'],
        _count: true
      })
      return res.send(history)
    } catch (e: unknown) {
      return res.sendStatus(500)
    }
  }
}


export default HistoryController