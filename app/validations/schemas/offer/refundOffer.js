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
    
    // token
    tokenOffer: Joi
        .string()
        .max(5)
        .min(5)        
        .required()
        .messages({
            'string.empty': 'le token de l\'offre est obligatoire',
            'any.required':  'le token de l\'offre est obligatoire',
            'string.max': 'Le format du token n\'est pas correcte',
            'string.min': 'Le format du token n\'est pas correcte',
        }),
});
