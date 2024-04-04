/* eslint-disable no-undef */
import request from "supertest"
import { app } from "../apps/api/src/app"
import Utils from "./utis"



describe("Testing the Express App", () => {
  describe("Actions", () => {
    describe("GET /actions", () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app).get('/api/actions').send()
      });

      test('Should response statusCode to be 200', () => {
        expect(response.statusCode).toBe(200)
      })
      
      test('Should respond with an array', () => {
        expect(Array.isArray(response.body)).toBe(true)
      })

      test('Should be an array of ActionBase', () => {
        for(const action of response.body) {
          expect(typeof action.id).toBe('number')
          expect(typeof action.name).toBe('string')
          expect(typeof action.maxCreditsCount).toBe('number')
        }
      })
    })
  })

  describe("Credits", () => {
    describe("GET /credits", () => {
      let response: request.Response
      beforeEach(async () => {
        response = await request(app).get('/api/credits').send()
      });
  
      test('Should response statusCode to be 200', () => {
        expect(response.statusCode).toBe(200)
      })
      
      test('Should respond with an array', () => {
        expect(Array.isArray(response.body)).toBe(true)
      })
  
      test('Should be an array of Credit', () => {
        for(const credit of response.body) {
          expect(typeof credit.id).toBe('number')
          expect(typeof credit.creditsCount).toBe('number')
          expect(typeof credit.action.id).toBe('number')
          expect(typeof credit.action.name).toBe('string')
          expect(typeof credit.action.maxCreditsCount).toBe('number')
          expect(credit.creditsCount).toBeLessThanOrEqual(credit.action.maxCreditsCount)
        }
      })
    })
  })

  describe("History", () => {
    describe("GET /history", () => {
      let response: request.Response
      beforeEach(async () => {
        response = await request(app).get('/api/history').send()
      });
  
      test('Should response statusCode to be 200', () => {
        expect(response.statusCode).toBe(200)
      })
      
      test('Should respond with an array', () => {
        expect(Array.isArray(response.body)).toBe(true)
      })
  
      test('Should be an array of HistoryEntry', () => {
        for(const historyEntry of response.body) {
          expect(typeof historyEntry._count).toBe('number')
          expect(typeof historyEntry.actionId).toBe('number')
        }
      })
    })
  })

  describe("Queue", () => {
    describe("GET /queue", () => {
      let response: request.Response
      beforeEach(async () => {
        response = await request(app).get('/api/queue').send()
      });
  
      test('Should response statusCode to be 200', () => {
        expect(response.statusCode).toBe(200)
      })
      
      test('Should respond with an array', () => {
        expect(Array.isArray(response.body)).toBe(true)
      })
  
      test('Should be an array of QueueEntry', () => {
        for(const queueEntry of response.body) {
          expect(Utils.checkQueueEntry(queueEntry)).toBe(true)
        }
      })
    })

    describe("POST /queue", () => {
      describe("When valid payload", () => {
        test('Should respond with a QueueEntry', async () => {
          const response = await request(app).post('/api/queue').send({ actionId: 1 })
          expect(response.statusCode).toBe(201)
          expect(Utils.checkQueueEntry(response.body)).toBe(true)
        })
      })

      describe("When actionId is missing", () => {
        test('Should respond with a status code 422', async () => {
          const responses = await Promise.all([
            request(app).post('/api/queue').send(),
            request(app).post('/api/queue').send({})
          ])

          for(const response of responses) {
            expect(response.statusCode).toBe(422)
          }
        })
      })
    })

    describe("POST /queue/reorder", () => {
      describe("When valid payload", () => {
        test('Should respond with a 200', async () => {
          await request(app).post('/api/queue').send({ actionId: 1 })
          const response = await request(app).post('/api/queue/reorder').send({ beforeId: 1, movedId: 2 })
          expect(response.statusCode).toBe(200)
        })

        test('Should respond with a 200 order (reverse)', async () => {
          await request(app).post('/api/queue').send({ actionId: 1 })
          const response = await request(app).post('/api/queue/reorder').send({ beforeId: 2, movedId: 1 })
          expect(response.statusCode).toBe(200)
        })
      })

      describe("When invalid payload", () => {
        test('Should respond with a 422', async () => {
          const responses = await Promise.all([
            request(app).post('/api/queue').send(),
            request(app).post('/api/queue').send({}),
            request(app).post('/api/queue/reorder').send({ beforeId: 1 }),
            request(app).post('/api/queue/reorder').send({ movedId: 2 })
          ])

          expect(responses.map(response => response.statusCode).every(response => response === 422)).toBe(true)
        })

        test('Should respond with a 400', async () => {
          const responses = await Promise.all([
            request(app).post('/api/queue/reorder').send({ beforeId: 420, movedId: 420 }),
            request(app).post('/api/queue/reorder').send({ beforeId: 420, movedId: 421 })
          ])

          expect(responses.map(response => response.statusCode).every(response => response === 400)).toBe(true)
        })
      })
    })

    describe("DELETE /queue/:id", () => {
      test('Should respond with the apprapriate 4XX', async () => {
        const responses = await Promise.all([
          request(app).delete('/api/queue/').send(),
          request(app).delete('/api/queue/aa').send(),
          request(app).delete('/api/queue/99999999999').send(),
        ])

        expect(responses[0].statusCode).toBe(404)
        expect(responses[1].statusCode).toBe(400)
        expect(responses[1].statusCode).toBe(400)
      })

      test("Delete with a valid id", async () => {
        const addQueueEntry = await request(app).post('/api/queue').send({ actionId: 1 })
        const queueBeforeDelete = await request(app).get('/api/queue').send()
        const deleteRequest = await request(app).delete('/api/queue/' + addQueueEntry.body.id).send()
        const queueAfterDelete = await request(app).get('/api/queue').send()
        expect(deleteRequest.statusCode).toBe(204)
        expect(queueAfterDelete.body.length).toBe(queueBeforeDelete.body.length - 1)
      })
      
    })
  })
})