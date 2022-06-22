const xss = require('xss');
const sanitizer = require ('sanitizer');

/**
 * nettoyage des chaines de caracteres envoyé par le client
 * @param {Object} prop - propriété [body | query | params]
 * @returns 
 */
module.exports = (req, res, next)=>{
    /**nettoyage des données params / body / query */
    let sanitizeDataBody = {};
    let sanitizeDataQuery = {};
    let sanitizeDataParams = {};

    for( let key in req.query){       
        sanitizeDataQuery[key] = xss(sanitizer.escape(req.query[key].trim()));
    }        

    for( let key in req.body){       
        sanitizeDataBody[key] = xss(sanitizer.escape(req.body[key].trim()));
    }        

    for( let key in req.params){       
        sanitizeDataParams[key] = xss(sanitizer.escape(req.params[key].trim()));
    }        

    /** mise à jour des données nettoyés*/
    req.body = sanitizeDataBody;
    req.query = sanitizeDataQuery;
    req.params = sanitizeDataParams;
    
    next();
};