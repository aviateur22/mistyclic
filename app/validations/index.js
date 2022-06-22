/**
 * Validation de données
 * @param {object} schema - schéma de données a valider
 * @returns 
 */
 module.exports = (schema)=>async(req, res, next)=>{
    try {
        if(req.method ==='GET'){
            await schema.validateAsync(req.query);
        } else {
            await schema.validateAsync(req.body);
        }
        next();        
    } catch (error) {           
        next({message: error.message, statusCode:'400'});
    }
};