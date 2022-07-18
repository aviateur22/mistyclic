const AES = require('./aes');
const { v4: uuidv4 } = require('uuid');
const JWT = require('./jwt');
const jsonwebtoken = require('jsonwebtoken');

module.exports = {
    /**
     * génération d'un token aléatoire ainsi que d'un jwt
     * @param {Object} données pour la génération du jwt
     * @property {text} data.expireIn - durée du jwt
     * @property {text} data.subject - sujet du jwt
     * @returns 
     */
    generate: async(data)=>{        
        const aes =new AES();

        /**text aléatoire */
        const uuid = uuidv4();

        /**chiffrage du uuid */
        const uuidEncrypt = await aes.encrypt(uuid);

        /**secret  */
        const secret =aes.encrypt(process.env.SECRET_APP_WORD);

        /**composition token aléatoier avec secret word */
        const token = await aes.encrypt(secret + '|' + uuid);

        /**génération d'un jwt avec payload */
        const jwt = new JWT({
            expiresIn: data.expiresIn,
            subject: data.subject
        });
        const newJwt = await jwt.generateJwt({ token });

        return { jwt: newJwt, token: uuidEncrypt };
    },

    /**
     * comparaison du jeton sécurisé present dans req.body et dans le JWT
     * @param {Object} jwt - contenant en payload les données a vérifier
     * @param {Text} tokenClient - jeton chiffré contenantles données a vérifier 
     * @returns 
     */
    compare: async(jwt, tokenClient)=>{   
        //clé secrete
        const KEY = process.env.JWT_PRIVATE_KEY;

        if(!KEY){
            throw ({message: 'KEY token absente', statusCode:'500'});
        }
        
        /** token injecté */
        if(!tokenClient){
            throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }

        /** jwt contenant le token */
        if(!jwt){
            throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
        }
        
        return await jsonwebtoken.verify(jwt, KEY, async function(err, payload) { 
            if(err){
                throw ({message: 'désolé, votre token est expiré. Merci de recharger la page', statusCode:'401'});
            }    
            /** token du jwt */
            const token = payload.data?.token;

            if(!token){                
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }
            
            /** decryptage des token */
            const aes = new AES();

            /** décodage base64 -> UTF-8 puis décryptage du token req.body - contient le token aléatoire */            
            const tokenClientDecrypt =  await aes.decrypt(tokenClient);

            /** décodage base64 -> UTF-8 puis décryptage du token jwt.data.token - contient le code secret | token aléatoire (non chiffré)*/
            const jwtTokenDecrypt = await aes.decrypt(token);

            /**séparation du JWTtokenDecrypt avec le signe | */
            const jwtTokenArray = jwtTokenDecrypt.split('|');
            
            if(jwtTokenArray.length !== 2){ 
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});                   
            }
            
            // /** Récupération codeSecret + token depuis le JWT  */
            const secretWordDecrypt = aes.decrypt(jwtTokenArray[0]);
            const tokenDecrypt = jwtTokenArray[1];
            
            /** récupération mot secret de l'appication */
            const secretWord = process.env.SECRET_APP_WORD;            
            //comparaison du secret word et du token aéatoire
            if((secretWordDecrypt !== secretWord) || (tokenDecrypt !== tokenClientDecrypt)){                
                throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
            }
            
            return true;  
        });
    }
};