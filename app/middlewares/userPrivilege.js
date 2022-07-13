/**
 * Vérifiction du role utilisateur 
 * @params {Number} requestRoleId - role utilisateur
 */
module.exports = (requestRoleId)=>(req, res, next)=>{
    //Vérification de la présence des données nécessaire
    if(!req.payload || !req.payload.data?.roleId  ){
        throw ({ message: 'vous n\'avez pas les droits pour éffectuer l\'action demandée', statusCode:'403' });
    }

    //Seul data.roleId > ou = requestRoleId peut accéder à la suite
    if(req.payload.data.roleId < requestRoleId){                       
        throw ({message: 'vous n\'avez pas les droits pour éffectuer l\'action demandée', statusCode:'403'});
    }
    return next();
};
