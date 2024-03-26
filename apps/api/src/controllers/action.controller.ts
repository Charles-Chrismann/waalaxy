import { Request, Response } from "express";
import prisma from "../db/prismaClient";

class ActionController {
  static async getAll(req: Request, res: Response) {
    try {
      const actions = await prisma.action.findMany()
      return res.send(actions)
    } catch (e: unknown) {
      return res.sendStatus(500)
    }
  }
}


export default ActionController