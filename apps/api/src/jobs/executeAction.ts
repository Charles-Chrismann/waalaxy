import prisma from "../db/prismaClient";
import io from "../io/io";
import Job from "./job";

async function executeAction(stop: Function) {
  let toDecrementId: null | number = null
  let stopJob = false
  const actions = await prisma.$transaction(async () => {
    const firstAvailable = await prisma.queueEntry.findFirst({
      where: {
        credit: {
          creditsCount: {
            gt: 0
          }
        }
      }
    })

    if(!firstAvailable) {
      const [toDelete, deleted] = await prisma.$transaction([prisma.queueEntry.findMany(), prisma.queueEntry.deleteMany()])
      stopJob = true
      return toDelete.map(entry => entry.id)
    }

    toDecrementId = firstAvailable.creditId

    const [toDelete, deleted] = await prisma.$transaction([
      prisma.queueEntry.findMany({
        where: {
          order: {
            lt: firstAvailable.order
          },
        },
      }),
      prisma.queueEntry.deleteMany({
        where: {
          order: {
            lt: firstAvailable.order
          },
        },
      })
    ])
    const exectuedJob = await prisma.$transaction(async () => {
      const exectuedJob = await prisma.queueEntry.delete({
        where: {
          id: firstAvailable.id
        }
      })
      await prisma.history.create({
        data: {
          userId: 1,
          actionId: exectuedJob.actionId
        }
      })
      const [updatedQueueEntries] = await prisma.$transaction([
        prisma.queueEntry.updateMany({
          data: {
            order: {
              decrement: firstAvailable.order
            }
          }
        }),
        prisma.credit.update({
          where: {
            id: exectuedJob.creditId
          },
          data: {
            creditsCount: {
              decrement: 1
            }
          }
        })
      ])
      stopJob = !updatedQueueEntries.count
      return exectuedJob
    })

    return [...toDelete, exectuedJob].map(job => job.id)
  })
  console.log(toDecrementId)
  io.emit('checked actions', {toDecrementId, actions})
  if(stopJob) stop()
}

export default new Job('Actions', 15 * 1000, executeAction)