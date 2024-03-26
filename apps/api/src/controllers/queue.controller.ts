import { Request, Response } from "express";
import prisma from "../db/prismaClient";
import { Prisma } from "database";

class QueueController {
  static async create(req: Request, res: Response) {
    const {actionId} = req.body
    const lastOrder = (await prisma.queueEntry.aggregate({
      _max: {
        order: true
      }
    }))._max.order
    const nextOrder = (lastOrder || 0) + 1
    try {
      const queueEntry = await prisma.queueEntry.create({
        data: {
          order: nextOrder,
          actionId,
          userId: 0
        }
      })
      return res.send(queueEntry)
    } catch (e: unknown) {
      if(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
        return res.sendStatus(422)
      }
      return res.sendStatus(500)
    }
  }

  static async getall(req: Request, res: Response) {
    try {
      const entries = await prisma.queueEntry.findMany()
      return res.send(entries)
    } catch (e: unknown) {
      return res.sendStatus(500)
    }
  }
}


export default QueueController