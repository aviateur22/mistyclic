const {User, Type, City, Store} = require('../../../models');

/**
 * Function SQL commune au different SQLHelper
 */
class CommonSQL {
    /**
     * Récupération d'un utilisateur 
     * @param {Number} [userId] -  id de l'utilisateur (si pas défini dans le constructeur)
     * @returns {Object} user - l'utilisateur
     */    
    async getUser(userId){        
        //recherche d'un utilisateur 
        const user = await User.findByPk(userId);

        //client pas trouvé
        if(!user){
            throw ({ statusCode: 404, message: 'ce client n\'existe pas' });
        }

        return user;
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
     * recuperation du store
     * @param {Number} storeId - id du commerce
     * @returns {Object} store - le store
     */
    async getStore(storeId){
        //recherche du store
        const store = await Store.findByPk(storeId,{
            include: ['storeOffers']
        });

        //store pas trouvé
        if(!store){
            throw ({ statusCode: 404, message: 'le commerce n\'existe pas' });
        }

        return store;
    }  
}
module.exports = CommonSQL;