const Joi = require("joi");

const loginBody = Joi.object().keys({
    username: Joi.string().required().strict(),
    password: Joi.string().required().strict(),
}).required();

const createConversationKeys = Joi.array().items(Joi.object().keys({
    userId: Joi.string().required(),
    encryptedAesKey: Joi.string().required(),
}));

module.exports = {loginBody,createConversationKeys};
