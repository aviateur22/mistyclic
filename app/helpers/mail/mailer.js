const templateHtml = require('./templateHtml');
const nodeMailer = require('nodemailer');
/**
 * Gestion envoie email
 */
class Mailer{
    /**
     * constructor
     * @param {Text} emailType - type d'email a envoyer
     * @param {Array} to  - tableau d'adresse d'email
     * @param {Object} data  - données de l'email
     */
    constructor(mailTemplate, to, data){
        this.mailTemplate = mailTemplate;
        this.to = to;
        this.data = data;
    }

    /**
     * configuration de nodemailer
     */
    transporterConfig(){
        return (
            nodeMailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: true,
                auth: {
                  user: process.env.EMAIL_ACCOUNT, 
                  pass: process.env.EMAIL_PASSWORD, 
                }
            })
        );
    }

    async sendEmail(){
        /** recuperation du template */
        let template = await templateHtml(this.mailTemplate);  
        
        for( let key in this.data) 
        {         
            template = template.replace('!%!'+ key + '!%!', this.data[key]);
        }

        /**envoie de l'email */
        let info = this.transporterConfig().sendMail({
            from: `FROM WHOM  🔨" <${process.env.EMAIL_ACCOUNT}>`,
            to: email,
            subject: 'Your subject',
            html: template,
        });                     
    }
}
module.exports = Mailer;