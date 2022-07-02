const Joi = require('joi');

/**
 * validation code de remboursement offre
 */
module.exports = Joi.object({

    refundCode: Joi
        .string()
        .required()
        .pattern(/^[^ ][a-zA-Z0-9\d*]+[^ ]$/)
        .messages({
            'string.empty': 'le code de remboursement est obligatoire',
            'string.pattern.base': 'le format du code de remboursement n\'est pas correcte',
            'any.required': 'le code de remboursement est obligatoire'
        })

});