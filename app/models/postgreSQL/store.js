const client = require('../../database/pg');
const CommonSQL = require('./commonSQL');


class Store extends CommonSQL {  
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
        const store = await client.query(`
        INSERT INTO "store" ("name", "presentation", "image_url", "street", "phone", "email", "account_id", "city_id", "type_id") 
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [data.name, data.presentation, data.image_url, data.street, data.phone, data.email, data.account_id, data.city_id, data.type_id]);

        if(store.rowCount === 0){
            throw ({ statusCode: 500, message: 'echec de sauvgarde du commerce' });
        }

        return store.rows[0];
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
     * @return {Object} - store mise a jour     
     */
    async updateStore(storeId, data){
        //heure de modification
        data.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //mise à jour
        const updateStore = await client.query(`
        UPDATE "store" SET 
        name = $1,
        presentation = $2,
        image_url = $3, 
        street = $4,
        phone = $5 ,
        email= $6,
        account_id = $7 ,
        city_id = $8,
        type_id = $9,
        updated_at = $10
        WHERE id = $11
        `,
        [data.name, data.presentation, data.image_url, data.street, data.phone, data.email, data.account_id, data.city_id, data.type_id, data.updated_at, storeId ]);

        if(updateStore === 0){
            throw ({ statusCode: 500, message: 'echec de sauvgarde des données' });
        }

        return updateStore.rows[0];
    }    

    /**
     * récupération store par id
     * @param {Number} storeId - id du store
     * @returns {object} store
     */
    async getStoreById(storeId){
        const store = await client.query('SELECT * FROM "store" WHERE id = $1',
            [storeId]);

        //pas de store
        if(store.rowCount === 0 ){
            throw ({ statusCode: 404, message: 'ce commerce n\'existe pas' });
        }
        return store.rows[0];
    }
}

module.exports = Store;