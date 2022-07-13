/**
 * validation de l'id d'une offre
 */
const Joi = require('joi');

module.exports = Joi.object({   
    // id offer recevant le token
    offerId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant de l\'offre est incorrect',
            'any.required': 'l\'identifiant de l\'offre est obligatoire',
            'string.empty': 'l\'identifiant de l\'offre est obligatoire'            
        }),
});
