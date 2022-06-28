/**
 * Validation de données
 * @param {object} schema - schéma de données a valider
 * @param {Text} prop - methode de la requete
 * @returns 
 */
module.exports = (schema, prop)=>async(req, res, next)=>{
    try {
        //Validation des données
        console.log(req[prop])
        await schema.validateAsync(req[prop]);        
        next();        
    } catch (error) {           
        next({message: error.message, statusCode:'400'});
    }
};