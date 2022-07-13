/**
 * validation données pour valider le remboursement d'une offre
 */

const Joi = require('joi');

module.exports = Joi.object({
    // id du store id offer recevant le token
    storeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant du commerce n\'est pas correct',
            'any.required': 'l\'identifiant du commerce est obligatoire',
            'string.empty': 'l\'identifiant du commerce est obligatoire'            
        }),

    /** csurf token */
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token',
            'any.required': 'token'  
        }),
});
