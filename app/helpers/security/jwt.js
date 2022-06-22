/** génération des jwt */
const { v4: uuidv4 } = require('uuid');
const jsonWebtoken = require('jsonwebtoken');

class JWT{    
    constructor(data){
        this.expiresIn = data.expiresIn;
        this.subject = data.subject;
    }

    async generateJwt(data) {
        /** données de base pour le token*/
        const issuer = 'ctoutweb';       

        //uuid du token
        const jwtid = uuidv4();
    
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }

        /** génération JWT sans token */
        const jwt =jsonWebtoken.sign({               
            data
        }, KEY, {
            algorithm: 'HS256',
            issuer: issuer,
            subject: this.subject ,
            jwtid: jwtid,
            expiresIn: this.expiresIn
        });
        return jwt;
    }
}
module.exports = JWT;