const Joi = require('joi');

module.exports = Joi.object({
    /** nom du commerce */
    name:Joi
        .string()        
        .max(50)
        .min(4)
        .pattern(/^[^ ][a-zA-Z0-9\d*\séè¨çàùê_.'"-]+[^ ]$/)
        .required()
        .messages({
            'string.empty': 'le nom du magasin est obligatoire',
            'string.pattern.base': 'le nom du magasin peut uniquement avoir des chiffres et des lettres',
            'any.required': 'le nom du magasin est obligatoire',
            'string.max': 'le nom du magasin doit être compris entre 4 et 50 caractères',
            'string.min': 'le nom du magasin doit être compris entre 4 et 50 caractères',
        }),

    /** présentation*/    
    presentation:Joi
        .string()        
        .max(500)
        .min(4)
        .pattern(/^[^ ][a-zA-Z0-9\d*\séè¨çàùê,;.'"_:?!</>()-]+[^ ]$/)  
        .required()
        .messages({
            'string.empty': 'la présentation du commerce est obligatoire',
            'string.pattern.base': 'la présentation peut uniquement contenir des chiffres et des lettres',
            'any.required': 'la présentation du commerce est obligatoire',
            'string.max': 'La présentation du magasin doit être compris entre 4 et 500 caractères',
            'string.min': 'La présentation du magasin doit être compris entre 4 et 500 caractères',
        }),

    /** path de l'image  */
    imageName: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'l\'ajout d\'une image est obligatoire',
            'any.required': 'l\'ajout d\'une image est obligatoire',
        }),

    /** rue */
    street: Joi
        .string()
        .pattern(/^[^ ][a-zA-Z0-9\d*\séè¨çàùê,;.'"_:?!</>()-]+[^ ]$/) 
        .required()
        .messages({
            'string.empty': 'le numéro et la rue sont obligatoire',
            'string.pattern.base': 'Le format du numéro et de la rue ne sont pas correcte',
            'any.required': 'le numéro et la rue sont obligatoire'
        }),    

   
    /** téléphone */
    phone: Joi
        .string()
        .min(10)
        .max(14)
        .required()
        .pattern(/^[^ ][0-9\s]+[^ ]$/)
        .messages({
            'string.pattern.base': 'respecter le format du numéro de téléphone: 0X xx xx xx xx',
            'any.required': 'le numéro de téléphone est obligatoire',
            'string.empty': 'le numéro de téléphone est obligatoire',
            'string.max': 'respecter le format du numéro de téléphone: 0X xx xx xx xx',
            'string.min': 'respecter le format du numéro de téléphone: 0X xx xx xx xx',
        }),
    
    /**email*/    
    email:Joi
        .string()
        .pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
        .required()
        .messages({
            'string.empty': 'l\'email est obligatoire',
            'string.pattern.base': 'erreur dans le format de l\'email',
            'any.required': 'l\'email est obligatoire'
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
    
    //id de la ville
    cityId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'l\'identifiant de la ville n\'est pas correct',
            'string.empty': 'le renseignement de la ville est obligatoire',
            'any.required': 'le renseignement de la ville est obligatoire'
        }),
    
    //id de la ville
    typeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'l\'identifiant du type de commerce n\'est pas correct',
            'string.empty': 'le renseignement du type de commerce est obligatoire',
            'any.required': 'le renseignement du type de commerce est obligatoire'
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