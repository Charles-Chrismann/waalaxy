import { Request, Response } from "express";
import prisma from "../db/prismaClient";
import { Prisma } from "database";
import io from "../io/io";
import jobManager from "../jobs/jobManager";

class QueueController {
  static async create(req: Request, res: Response) {
    const {actionId} = req.body
    try {
      const queueEntry = await prisma.$transaction(async () => {

        const lastOrder = (await prisma.queueEntry.aggregate({
          _max: {
            order: true
          }
        }))._max.order
        const nextOrder = (lastOrder || 0) + 1

        const credit = await prisma.credit.findFirst({
          where: {
            actionId
          }
        })
        const queueEntry = await prisma.queueEntry.create({
          data: {
            order: nextOrder,
            actionId,
            userId: 1,
            creditId: credit!.id
          },
          select: {
            id: true,
            order: true,
            actionId: true,
            createdAt: true,
            updatedAt: true,
            action: true
          }
        })

        return queueEntry
      })
      io.emit('queueEntry creation', queueEntry)
      jobManager.startJob('Actions')
      res.statusCode = 201
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
      const entries = await prisma.queueEntry.findMany({
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          actionId: true,
          order: true,
          action: true
        },
        orderBy: [
          {
            order: 'asc'
          }
        ]
      })
      return res.send(entries)
    } catch (e: unknown) {
      return res.sendStatus(500)
    }
  }

  static async reorder(req: Request, res: Response) {
    const {beforeId, movedId} = req.body
    if(beforeId === movedId) return res.sendStatus(400)
    try {
      const transaction = await prisma.$transaction(async () => {
        const [beforeEntry, moveEntry] = await prisma.$transaction([
          prisma.queueEntry.findFirst({
            where: {
              id: beforeId
            }
          }),
          prisma.queueEntry.findFirst({
            where: {
              id: movedId
            }
          })
        ])

        if(!beforeEntry || !moveEntry) throw new Error('Missing entry')
        const direction = moveEntry.order > beforeEntry.order ? 1 : -1
        const where = moveEntry.order > beforeEntry.order ? 
        {
          order: {
            gt: beforeEntry.order,
            lt: moveEntry.order
          },
          NOT: [
            {
              id: beforeEntry.id
            }
          ]
        } : {
          order: {
            gt: moveEntry.order,
            lt: beforeEntry.order
          },
          NOT: [
            {
              id: beforeEntry.id
            }
          ]
        }
  
        await prisma.$transaction([
          prisma.queueEntry.update({
            where: {
              id: movedId
            },
            data: {
              order: beforeEntry.order
            }
          }),
          prisma.queueEntry.update({
            where: {
              id: beforeEntry.id
            },
            data: {
              order: {
                increment: direction
              }
            }
          }),
          prisma.queueEntry.updateMany({
            where,
            data: {
              order: {
                increment: direction
              }
            }
          })
        ])
      })
      return res.sendStatus(200)
    } catch (error: unknown) {
      if(error instanceof Error && error.message === 'Missing entry') return res.sendStatus(400)
      return res.sendStatus(500)
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id)
    try {
      await prisma.queueEntry.delete({
        where: {
          id
        }
      })
      io.emit('checked actions', {toDecrementId: null, actions: [id]})
      res.sendStatus(204)
    } catch(e) {
      res.sendStatus(400)
    }
  }
}


export default QueueController