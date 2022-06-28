/**
 * validation des données pour la mise a jour d'une offre
 */
const Joi = require('joi');

module.exports = Joi.object({
    /** nom de l'offre */
    name: Joi
        .string()
        .max(50)
        .min(4)
        .pattern(/^[^ ][a-zA-Z0-9\d*\séè¨çàùê,;_.()'"-]+[^ ]$/)       
        .required()
        .messages({
            'string.empty': 'le nom de l\'offre est obligatoire',
            'string.pattern.base': 'le nom de l\'offre n\'est pas correcte',
            'any.required': 'le nom de l\'offre est obligatoire',
            'string.max': 'Le nom de l\'offre doit être compris entre 4 et 50 caractères',
            'string.min': 'Le nom de l\'offre doit être compris entre 4 et 50 caractères',
        }),

    /** présentation de l'offre*/    
    presentation: Joi
        .string()
        .max(500)
        .min(4)
        .pattern(/^[^ ][a-zA-Z0-9\d*\séè¨çàùê,;.'"_:?!</>()-]+[^ ]$/)  
        .required()
        .messages({
            'string.empty': 'la présentation de l\'offre est obligatoire',
            'string.pattern.base': 'la présentation n\'est pas correcte',
            'any.required': 'la présentation de l\'offre est obligatoire',
            'string.max': 'La présentation de l\'offre doit être compris entre 4 et 500 caractères',
            'string.min': 'La présentation de l\'offre doit être compris entre 4 et 500 caractères',
        }),

    /** téléphone */
    imageName: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'l\'ajout d\'une image est obligatoire',
            'any.required': 'l\'ajout d\'une image est obligatoire',
        }),
   
});