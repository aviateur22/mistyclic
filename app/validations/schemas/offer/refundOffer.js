/**
 * validation données pour valider le remboursement d'une offre
 */

const Joi = require('joi');

module.exports = Joi.object({
    //id client générant le token
    userId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant de l\'offre est incorrect',
            'any.required': 'l\'identifiant de l\'offre est manquant',
            'string.empty': 'l\'identifiant de l\'offre est manquant'
        }),

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
