/** traitement des erreurs  */
const logger = require('../helpers/logger');
module.exports = (err, req, res, next)=>{
    try {  
        /**Erreur lié au déchiffrement AES - Force l'erreur 403 - */
        if(err.aes){
            logger.error(err.errorMessage);

            return res.status(403).json({
                errorMessage: 'vous n`\'avez pas les droits pour executer l\'action demandée'
            });
        }      
        /**Verification si erreur managée */
        if(!err.message || !err.statusCode || Number(err.statusCode) === 500){
            logger.error(err);

            return res.status(500).json({
                errorMessage: 'erreur interne au serveur'
            });
        }
        
        /**erreur managé */
        return res.status(Number(err.statusCode)).json({
            errorMessage: err.message
        });        
    } catch (error) {
        logger.error(error);
        /**erreur non managé */
        return res.status(500).json({
            errorMessage: 'erreur interne au serveur'
        });        
    }    
};