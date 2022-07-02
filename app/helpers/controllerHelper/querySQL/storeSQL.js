const {Store} = require('../../../models');


class StoreSQL {  
    /**
     * création d'un store
     * @param {Object} data - données du store
     * @property {Text} data.name - nom du commerce
     * @property {Text} data.presentation - presentation du commerce
     * @property {Text} data.imageName - nom de l'image
     * @property {Text} data.street - rue
     * @property {Text} data.phone - téléphone du commerce
     * @property {Text} data.email - email du commerce
     * @property {Number} data.userId - id propritaire
     * @property {Number} data.cityId - id ville
     * @property {Number} data.typeId - id type de magasin
     * @return {Object} - store de créé
     */    
    async createStore(data){
        const store = await Store.create({
            ...data
        });

        if(!store){
            throw ({ statusCode: 500, message: 'echec de sauvgarde du commerce' });
        }

        return store;
    }

    /**
     * mise a jour des données du commerce
     * @param {Object} store - le store à mettre à jour
     * @param {Object} data - données
     * @property {Text} data.name - nom du commerce
     * @property {Text} data.presentation - presentation du commerce
     * @property {Text} data.imageName - nom de l'image
     * @property {Text} data.street - rue
     * @property {Text} data.phone - téléphone du commerce
     * @property {Text} data.email - email du commerce
     * @property {Number} data.userId - id propritaire
     * @property {Number} data.cityId - id ville
     * @property {Number} data.typeId - id type de magasin
     * @return {Object} - store mise a jour     *  
     */
    async updateStore(store, data){
        //mise à jour
        const updateStore = await store.update({
            ...data
        });

        if(!updateStore){
            throw ({ statusCode: 500, message: 'echec de sauvgarde des données' });
        }
        return updateStore;
    }    

    /**
     * récupération store par id
     * @param {Number} storeId - id du store
     * @returns {object} store
     */
    async getStoreById(storeId){
        const store = await Store.findByPk(storeId);

        //pas de store
        if(!store){
            throw ({ statusCode: 404, message: 'ce commerce n\'existe pas' });
        }

        return store;
    }
}

module.exports = StoreSQL;