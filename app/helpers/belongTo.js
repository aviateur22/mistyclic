const userRole = require('../helpers/userRole');
/**
 * Vérification que la modification est faite par le propriétaire de l'objet ou un admin
 * @param {Number} userId - id de la personne déclenchant l'action
 * @param {Number} userObjectId - id de la personne rattaché à l'object
 * @param {Number} userRoleId - role de la personne déclanchant l'action
 */
module.exports = (userId, userObjectId, userRoleId)=>{
    if(userId != userObjectId && userRoleId < userRole.admin ){
        throw ({message: 'vous n\'avez pas le droit d\'éffectuer l\'action demandée', statusCode:'403'});
    }
    return true;
};