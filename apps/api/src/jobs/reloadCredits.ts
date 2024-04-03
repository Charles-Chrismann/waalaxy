import prisma from "../db/prismaClient";
import io from "../io/io";
import Job from "./job";

function getRandomInt(minFrac: number, maxValue: number) {
  const min = Math.ceil(minFrac * maxValue);
  const max = Math.floor(maxValue);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function reloadCredits() {
  const newCredits = await prisma.$transaction(async () => {
    const users = await prisma.user.findMany({
      select: {
        credits: {
          select: {
            id: true,
            action: {
              select: {
                maxCreditsCount: true
              }
            }
          }
        }
      }
    })
    if(!users.length) throw new Error('Unknown users')
    const credits = await Promise.all(users.map(
      user => user.credits.map(
        credit => prisma.credit.update({
          where: { id: credit.id },
          data: { creditsCount: getRandomInt(.8, credit.action.maxCreditsCount) },
          select: { id: true, creditsCount: true, action: true}
        })
      )
    ).flat())

    return credits
  })
  io.emit('creditsUpdate', newCredits)
}

export default new Job('Credits', 15 * 60 * 1000, reloadCredits)