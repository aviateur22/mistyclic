const fileReader = require('../fileReader');

/**
 * gestion des template d'email
 */
module.exports =  async(emailType)=>{
    let template; 

    switch (emailType){
    /** message  */
    case 'inscription': 
        template = await fileReader('app/statics/templateHtml/inscription.html');
        return template;

    default:
        throw ({
            message: 'impossible de procéder à l\'envoie de l\'email',
            statusCode: 400
        });
    }
};