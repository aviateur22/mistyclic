/**
 * validation de l'id d'un type de magasin
 */
const Joi = require('joi');

module.exports = Joi.object({   
    // id offer recevant le token
    typeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant du type de magasin n\'est pas correct',
            'any.required': 'le format de l\'identifiant du type de magasin n\'est pas correct',
            'string.empty': 'le format de l\'identifiant du type de magasin n\'est pas correct'          
        }),
});