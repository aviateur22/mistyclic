const Joi = require('joi');

/**
 * création ou modification d'un type de magasin
 */
module.exports = Joi.object({
    
    //nom dy type de magasin
    name: Joi
        .string()
        .pattern(/^[^ ][a-zA-Z0-9\d*\séè¨çàùê]+[^ ]$/)
        .max(30)
        .min(4)
        .required()
        .messages({
            'string.empty': 'le nom de type de magasin est obligatoire',
            'string.pattern.base': 'le format du type de magasin est composé uniquement de chiffres et de lettres',
            'any.required': 'le nom de type de magasin est obligatoire',
            'string.max': 'Le nom de type de magasin doit être compris entre 4 et 50 caractères',
            'string.min': 'Le nom de type de magasin doit être compris entre 4 et 50 caractères'
        }),

    /**token aléatoire*/
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token',
            'any.required': 'token'  
        }),
});