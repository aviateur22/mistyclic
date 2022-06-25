/**
 * validation des données pour génération d'un token
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
        })   
    
});
