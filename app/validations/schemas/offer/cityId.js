/**
 * validation de l'id d'une ville
 */
const Joi = require('joi');

module.exports = Joi.object({   
    // id offer recevant le token
    cityId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant de la ville n\'est pas correct',
            'any.required': 'l\'identifiant de la ville est obligatoire',
            'string.empty': 'l\'identifiant de la ville est obligatoire'            
        }),
});