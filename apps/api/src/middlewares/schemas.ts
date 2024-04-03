import Joi, { number } from "joi";

const createQueueEntry = Joi.object().keys({
  actionId: Joi.number().required()
})

const reorderQueue = Joi.object().keys({
  beforeId: Joi.number().required(),
  movedId: Joi.number().required(),
})

export default {
  "/queue" : createQueueEntry,
  "/queue/reorder" : reorderQueue
} as {[index:string]: Joi.ObjectSchema}
