/** vérification des token csurf */
const csurfToken = require('../helpers/security/csurfToken');

module.exports = async(req, res, next)=>{
    /**Recupération des cookies */ 
    if(!req.cookie){
        throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
    }    
    
    /** récupération du cookie de token */
    if(!req.cookie.token_data){
        throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
    }   

    /** token depuis la requete */
    const bodyToken = req.body.token;  

    /** token de la requete absent */
    if(!bodyToken){
        throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
    }

    /** récupération cookie de token */
    const cookieToken = req.cookie.token_data;
    
    /**comparaiosn du token dans le JWT et le token du client*/        
    const compare =  await csurfToken.compare(cookieToken, bodyToken);

    if(!compare){
        throw ({message: 'vous n`\'avez pas les droits pour executer l\'action demandée', statusCode:'403'});
    }
    return next();
};