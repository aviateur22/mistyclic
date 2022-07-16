const client = require('../../database/pg');

/**
 * Function SQL commune aux fichiers SQL
 */
class CommonSQL {
    /**
     * Récupération d'un utilisateur 
     * @param {Number} [userId] -  id de l'utilisateur (si pas défini dans le constructeur)
     * @returns {Object} user - l'utilisateur
     */    
    async getUser(userId){        
        //recherche d'un utilisateur 
        const user = await client.query('SELECT * FROM "account" WHERE id = $1',
            [userId]);        

        //client pas trouvé
        if(user.rowCount === 0){
            throw ({ statusCode: 404, message: 'ce client n\'existe pas' });
        }

        return user.rows[0];
    }

    /**
     * Vérification existance de la ville
     * @param {Number} cityId - id de la ville
     * @return {Boolean} 
     */
    async getCity(cityId){
        const city = await client.query('SELECT * FROM "city" WHERE id = $1',
            [cityId]);        

        //ville inconnue
        if(city.rowCount === 0){
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
        const type = await client.query('SELECT * FROM "type" WHERE id = $1',
            [typeId]);

        //type inconnue
        if(type.rowCount === 0){
            throw ({ statusCode: 404, message: 'ce type de commerce n\'existe pas' });
        }

        return true;
    }

    /**
     * recuperation du store
     * @param {Number} storeId - id du commerce
     * @returns {Object} { store, offers } - renvoie les données du store et les offres rattachées au store 
     */
    async getStore(storeId){
        //recherche du store
        const store = await client.query(`
        SELECT * FROM "store" WHERE id = $1
        `,
        [storeId]);
        
        //store pas trouvé
        if(store.rowCount === 0){
            throw ({ statusCode: 404, message: 'le commerce n\'existe pas' });
        }

        //recherche des offres associées
        const offers = await client.query(`
        SELECT * FROM "offer" WHERE store_id = $1
        `,
        [storeId]);
        
        return {
            store: store.rows[0],
            offers: offers.rows
        };
    }  
}
module.exports = CommonSQL;