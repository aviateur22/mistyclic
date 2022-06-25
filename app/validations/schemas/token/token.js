const Joi = require('joi');

/**
 * vérification csurf token
 */
module.exports = Joi.object({
    /**token aléatoire*/
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token',
            'any.required': 'token'  
        }),
});