const Joi = require('joi');

/**
 * validation donnée pour recupérer les offres d'un utilisateur
 */
module.exports = Joi.object({
    //id du commercant    
    userId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'l\'identifiant du commerçant n\'est pas correct',
            'string.empty': 'l\'identifiant du commerçant est obligatoire',
            'any.required': 'l\'identifiant du commerçant est obligatoire'
        }),

    /** csurf token */
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token',
            'any.required': 'token'  
        })

});