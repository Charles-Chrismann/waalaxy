import * as fs from 'fs'
import { PrismaClient } from "@prisma/client"

console.log(process.env.DATABASE_URL)

function getRandomInt(minFrac: number, maxValue: number) {
  const min = Math.ceil(minFrac * maxValue);
  const max = Math.floor(maxValue);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const prisma = new PrismaClient()

const actionsToSave = [
  {
    name: 'action A',
    maxCreditsCount: 10
  },
  {
    name: 'action B',
    maxCreditsCount: 10
  },
  {
    name: 'action C',
    maxCreditsCount: 15
  },
]

const usersCount = 1

;(async() => {
  const actions = []
  for(const action of actionsToSave) {
    actions.push(await prisma.action.create({ data: action }))
  }
  
  const userPromises = []
  for(let i = 0; i < usersCount; i++) {
    userPromises.push(prisma.user.create({}))
  }
  const users = await Promise.all(userPromises)

  const credits = []
  for(const user of users) {
    for(const action of actions) {
      credits.push(await prisma.credit.create({
        data: {
          creditsCount: getRandomInt(.8, action.maxCreditsCount),
          actionId: action.id,
          userId: user.id
        }
      }))
    }
  }
})()
