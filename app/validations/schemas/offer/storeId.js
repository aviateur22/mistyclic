/**
 * validation de l'id d'un commerce
 */
const Joi = require('joi');

module.exports = Joi.object({   
    // id du store
    storeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant du commerce n\'est pas correct',
            'any.required': 'l\'identifiant du commerce est obligatoire',
            'string.empty': 'l\'identifiant du commerce est obligatoire'            
        }),
});