/**
 * validation de l'id d'une offre
 */
const Joi = require('joi');

module.exports = Joi.object({   
    // id offer recevant le token
    storeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant du commerce n\'est pas valide',
            'any.required': 'l\'identifiant du commerce est obligatoire',
            'string.empty': 'l\'identifiant du commerce est obligatoire'            
        }),
});
 