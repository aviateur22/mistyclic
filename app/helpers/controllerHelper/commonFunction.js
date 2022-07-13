const userRole = require('../userRole');

module.exports = {
    /**
     * vérification si store appartient au professionnel
     * @param {Number} userId - id utilisateur
     * @param {Object} store - le store concerné     * 
     * @returns 
     */
    storeBelongToProfessional: (store, userId)=>{
        //Verification id utilisateur et id utilsateru en base de donnée
        if(Number(userId) !== Number(store.user_id)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas rattaché au commerce désigné' });
        }
        return true;
    },

    /**
     * vérification si offre appartient au professionnel
     * @param {Number} userId - id utilisateur
     * @param {Object} offer - offre concernée
     * @returns {boolean}
     */
    offerBelongToProfessional: (offer, userId)=>{   
        //Verification de l'id utilisateur et id utilisateur en base de donnée
        if(Number(userId) !== Number(offer.user_id)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas rattaché à l\'offre désignée' });
        }
        return true; 
    },


    /**
     * vérification que l'offre appartient au commerce
     * @param {Object} store - le store 
     * @param {Number} offerId - id de l'offre recherché
     * @returns {boolean}
     */
    offerBelongToStore: async(store, offerId)=>{
        //véroification de la liste des offres du commerce
        const offerBelongToStore =await store?.storeOffers.some(offer => Number(offerId) === Number(offer.id));
        if(!offerBelongToStore)
        {
            throw ({ statusCode: 400, message: 'l\'offre à modifiée n\'est pas rattachée au commerce désigné' }); 
        }

        return true;
    },

    /**
     * vérification du role du bénificiaire de l'action
     * @param {Number} userRoleId - id du role utilisateur
     * @param {Number} requestUserRoleId - id du role a avoir
     * @returns {boolean} [true|false]
     */
    checkUserRole: (userRoleId, requestUserRoleId)=>{       
        if(Number(userRoleId) < Number(requestUserRoleId)){
            throw ({ statusCode: 403, message: 'vous n\'avez pas les priviléges nécessaire pour cette action' });
        }

        return true;
    },
    
    /**
     * 
     * @param {object} data - données pour vérifier les authorisation
     * @property {Number} data.userId - id de la personne exécutant l'action
     * @property {Number} data.resultUser - id de la personne présente en base de données
     * @property {Number} data.userActualRole - privége actuel
     * @property {Number} [data.levelRoleRequest] - privilège nécessaire pour executer l'action
     * @returns {boolean} 
     */
    authorizationUpdateData: (data)=>{  
        //vérification des données
        if(!data || !data.userId || !data.resultUser || !data.userActualRole){
            throw ({message: 'vous ne pouvez pas executer cette action', statusCode:'403'});
        }
        //par default le role est admin
        if(!data.levelRoleRequest){
            data.levelRoleRequest = userRole.admin;
        }      

        //Si Admin, alors on vérifie que le client a les droits nécessaires
        if(Number(data.resultUser) !== Number(data.userId) && data.userActualRole < data.levelRoleRequest){
            throw ({message: 'vous ne pouvez pas executer cette action', statusCode:'403'});
        }
        return true;
    }
};