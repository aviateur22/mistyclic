const Joi = require('joi');

module.exports = Joi.object({
    //nom du champ input
    fieldname: Joi
        .string()
        .required().messages({
            'string.empty': 'l\'ajout d\'une image est obligatoire',
            'any.required': 'l\'ajout d\'une image est obligatoire',
        }),
    //nom du fichier
    originalname: Joi.any(),

    //encodage
    encoding: Joi.any(),

    //nom du fichier unique
    filename: Joi.string().required().messages({
        'string.empty': 'l\'ajout d\'une image est obligatoire',
        'any.required': 'l\'ajout d\'une image est obligatoire',
    }),

    //dossier de destination
    destination: Joi.any(),

    //type de fichier
    mimetype: Joi.any(),

    //path de destination
    path: Joi.any(),

    //taille du fichier
    size: Joi.any()
});