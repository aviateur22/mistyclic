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
            'number.base': 'le format de l\'identifiant utilisateur n\'est pas correct',
            'any.required': 'l\'identifiant utilisateur est manquant',
            'string.empty': 'l\'identifiant utilisateur est manquant'
        }),

    // id offer recevant le token
    offerId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant de l\'offre est incorrect',
            'any.required': 'l\'identifiant de l\'offre est obligatoire',
            'string.empty': 'l\'identifiant de l\'offre est obligatoire'            
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
