const Joi = require("joi");

const createMessageBody = Joi.object().keys({
    content: Joi.string().required().max(2048).strict(),
    iv: Joi.string()
}).required();

module.exports = {createMessageBody};
