const Joi =  require('joi');

/**validation des données ppur récuperer les tokens */
module.exports = Joi.object({

    /** csurf token */
    token: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'token',
            'any.required': 'token'  
        }),

    // id offer recevant le token
    offerId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant de l\'offre est incorrect',
            'any.required': 'l\'identifiant de l\'offre est obligatoire',
            'string.empty': 'l\'identifiant de l\'offre est obligatoire'            
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

    // id offer recevant le token
    storeId: Joi
        .number()
        .required()
        .messages({
            'number.base': 'le format de l\'identifiant du commerce n\'est pas correct',
            'any.required': 'l\'identifiant du commerce est obligatoire',
            'string.empty': 'l\'identifiant du commerce est obligatoire'            
        }),
});