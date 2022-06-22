/** ordonne correctement les cookies */
 module.exports = (req,res,next)=>{    
    /**object pour stocker les cookies */
    const list = {};

    /** pas de header dans la requete */
    if(!req.headers){
        return next();
    }

    /** pas de cookie présent dans les headers de la requete */
    if(!req.headers.cookie){
        return next();
    }

    /**recuperation des cookies */
    const cookieHeader = req.headers.cookie;  
    
    /**mise des cookies dans l'objet */
    cookieHeader.split(';').forEach(function(cookie) {
        let [ name, ...rest] = cookie.split('=');
        name = name?.trim();
        if(!name) {
            throw ({message: 'erreur format autorisation cookie', statusCode:'400'});
        }
        const value = rest.join('=').trim();
        if(!value){
            throw ({message: 'erreur format autorisation cookie', statusCode:'400'});
        }
        list[name] = decodeURIComponent(value);
    });
    req.cookie = list;  
    next();
};