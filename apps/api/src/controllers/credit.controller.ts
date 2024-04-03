import { Request, Response } from "express";
import prisma from "../db/prismaClient";

class CreditController {
  static async getall(req: Request, res: Response) {
    try {
      const credits = await prisma.credit.findMany({
        select: {
          id: true,
          creditsCount: true,
          action: true
        }
      })
      return res.send(credits)
    } catch (e: unknown) {
      return res.sendStatus(500)
    }
  }
}


export default CreditController