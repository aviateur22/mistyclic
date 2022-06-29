/**
 * validation données pour supprimer une offre
 */
const Joi = require('Joi');

module.exports = Joi.object({
    /** csurf token */
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token',
            'any.required': 'token'  
        }),

    // id du professionnel
    userId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant utilisateur est incorrect',
            'any.required': 'l\'identifiant utilisateur est manquant',
            'string.empty': 'l\'identifiant utilisateur est manquant'
        }),

    //id du store
    storeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'l\'identifiant du commerçe n\'est pas correct',
            'string.empty': 'l\'identifiant du commerce est obligatoire',
            'any.required': 'l\'identifiant du commerce est obligatoire'
        }),
});