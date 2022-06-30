const {Offer, Store, User, Type, City } = require('../../models');
const userRole = require('../userRole');

class MainHelper {
    /**
     * 
     * @param {Number} userId - id utilisateur
     * @param {Number} storeId - id du commerce
     * @param {Number} requestUserRole - role de la personne effectuant l'action
     */
    constructor(userId, storeId, requestUserRole){
        this.userId = userId;
        this.storeId = storeId;
        this.requestUserRole = requestUserRole;
    }   
    
    /**
     * vérifie existance d'une offre
     * @param {Number} offerId - id de l'offre
     * @param {Object} includeModel - model a recuperer
     * @returns {Object} offer - renvoie l'offre
     */
    async getOffer(offerId, includeModel){
        //recherche de l'offre       
        let offer;
        if(includeModel){
            offer = await Offer.findByPk(offerId, {
                include: { model: includeModel.modelName }
            });
        } else {
            offer = await Offer.findByPk(offerId);
        }
       
        //offre pas trouvé
        if(!offer){
            throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas' });
        }

        return offer;
    }

    /**
     * recuperation du store
     * @returns {Object} store - le store
     */
    async getStore(){
        //recherche du store
        const store = await Store.findByPk(this.storeId,{
            include: ['storeOffers']
        });

        //store pas trouvé
        if(!store){
            throw ({ statusCode: 404, message: 'le commerce n\'existe pas' });
        }

        return store;
    }

    /**
     * Vérification existance de la ville
     * @param {Number} cityId - id de la ville
     * @return {Boolean} 
     */
    async getCity(cityId){
        const city = await City.findByPk(cityId);

        //ville inconnue
        if(!city){
            throw ({ statusCode: 404, message: 'cette ville n\'existe pas' });
        }
        return true;
    }
    
    /**
     * Récupération d'un utilisateur   
     * @returns {Object} user - l'utilisateur
     */    
    async getUser(){
        //recherche client
        const user = await User.findByPk(this.userId);

        //client pas trouvé
        if(!user){
            throw ({ statusCode: 404, message: 'ce client n\'existe pas' });
        }

        return user;
    }

    /**
     * Vérification existance du type de magasin
     * @param {Number} typeId - id du type de commerce
     * @return {Boolean}
     */
    async getStoreType(typeId){
        const type = await Type.findByPk(typeId);

        //type inconnue
        if(!type){
            throw ({ statusCode: 404, message: 'ce type de commerce n\'existe pas' });
        }

        return true;
    }

    /**
     * vérification si store appartient au professionnel
     * @param {Object} store - le store concerné
     * @returns 
     */
    storeBelongToProfessional(store){
        //Verification id utilisateur et id utilsateru en base de donnée
        if(Number(this.userId) !== Number(store.user_id)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas rattaché au commerce désigné' });
        }
        return true;
    }

    /**
     * vérification si offre appartient au professionnel
     * @param {Object} offer - offre concernée
     * @returns {boolean}
     */
    offerBelongToProfessional(offer){   
        //Verification de l'id utilisateur et id utilisateur en base de donnée
        if(Number(this.userId) !== Number(offer.user_id)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas rattaché à l\'offre désignée' });
        }
        return true; 
    }


    /**
     * vérification que l'offre appartient au commerce
     * @param {Object} store - le store 
     * @param {Number} offerId - id de l'offre recherché
     * @returns {boolean}
     */
    async offerBelongToStore(store, offerId){
        //véroification de la liste des offres du commerce
        const offerBelongToStore =await store?.storeOffers.some(offer => Number(offerId) === Number(offer.id));
        if(!offerBelongToStore)
        {
            throw ({ statusCode: 400, message: 'l\'offre à modifiée n\'est pas rattachée au commerce désigné' }); 
        }

        return true;
    }

    /**
     * vérification du role du bénificiaire de l'action
     * @param {Number} userRoleId - id du role utilisateur
     * @param {Number} requestUserRoleId - id du role a avoir
     * @returns {boolean} [true|false]
     */
    checkUserRole(userRoleId, requestUserRoleId){       
        if(Number(userRoleId) < Number(requestUserRoleId)){
            throw ({ statusCode: 403, message: 'vous n\'avez pas les priviléges nécessaire pour cette action' });
        }

        return true;
    }
        
    /**
     * 
     * @param {Number} userIdCompare - id utilisateur bénificant de l'actiob
     * @param {Number} userRoleRequest - privilège nécessaire pour executer l'action
     * @returns 
     */
    async authorizationUpdateData(userIdCompare, userRoleRequest){  
        //par default le role est admin
        if(!userRoleRequest){
            userRoleRequest = userRole.admin;
        }      
        //Si Admin, alors on vérifie que le client a les droits nécessaires
        if(Number(userIdCompare) !== Number(this.userId) && this.requestUserRoleId < userRoleRequest){
            throw ({message: 'vous ne pouvez pas executer cette action', statusCode:'403'});
        }
        return true;
    }  
}

module.exports = MainHelper;