const Joi = require("joi");

const createMessageBody = Joi.object().keys({
    content: Joi.string().max(2048),
    iv: Joi.string(),
    spotifyTrackId: Joi.string(),
    type: Joi.string().valid("TEXT","SPOTIFY"),
}).required();

module.exports = {createMessageBody};
