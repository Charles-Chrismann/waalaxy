import Joi from "joi";

const createAction = Joi.object().keys({
  actionId: Joi.number().required()
})

export default {
  "/actions" : createAction
} as {[index:string]: Joi.ObjectSchema}
