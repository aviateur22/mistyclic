const userRole = require('../helpers/userRole');
const {User} = require('../models');
/**
 * Vérification que la modification est faite par le propriétaire de l'objet ou un admin
 * @param {Number} userId - id de la personne présent dans la requete
 * @param {Number} userObjectId - id de la personne rattaché à l'object
 * @param {Number} userRoleId - role de la personne déclanchant l'action
 * @param {Number} requestRoleId - role minimum a avoir pour valider une action qui est faite par un admin
 */
module.exports = async(userId, userObjectId, userRoleId, requestRoleId)=>{   
    //Les droits ne sont pas suffisant
    if(userId != userObjectId && userRoleId < userRole.admin ){        
        throw ({message: 'vous n\'avez pas le droit d\'éffectuer l\'action demandée', statusCode:'403'});
    }
    // L'admin fait l'action pour un "client" - on vérifie que le "client" a les droits nécessaire...
    else if(userId != userObjectId && userRoleId >= userRole.admin ){
        const user = await User.findByPk(userId);
        
        //pas d'utilisateur de trouvé
        if(!user){
            throw ({ statusCode: 404, message: 'utilisateur inconnu' });
        }

        if(user.role_id < requestRoleId){
            console.log(userId, userObjectId, requestRoleId);
            console.log(user.role_id , requestRoleId);
            throw ({message: 'vous ne pouvez pas executer cette action', statusCode:'403'});
        }
    }

    return true;
};