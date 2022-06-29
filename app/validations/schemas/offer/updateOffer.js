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
    
    //id du commercant    
    userId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'l\'identifiant du commerçant n\'est pas correct',
            'string.empty': 'l\'identifiant du commerçant est obligatoire',
            'any.required': 'l\'identifiant du commerçant est obligatoire'
        }),
        
    //id du store
    storeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'l\'identifiant du commerçe n\'est pas correct',
            'string.empty': 'l\'identifiant du commerce est obligatoire',
            'any.required': 'l\'identifiant du commerce est obligatoire'
        }),

    //condition pour récupérer l'offre
    conditions: Joi
        .array()
        .items(Joi.number().messages({
            'number.base': 'l\'identifiant des conditions n\'est pas correcte'
        }))
        .min(1)
        .messages({
            'array.base': 'l\'identifiant des conditions n\'est pas correcte',
            'array.min': 'sélectionner au moins une condition'
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