const Joi = require('joi');

/**
 * validation donnée pour recupérer les offres dun store par un professionnel ou collaborateur
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

    //csurf token
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token',
            'any.required': 'token'  
        }),

    // id offer recevant le token
    storeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant du commerce n\'est pas correct',
            'any.required': 'l\'identifiant du commerce est obligatoire',
            'string.empty': 'l\'identifiant du commerce est obligatoire'            
        }),
});