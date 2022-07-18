const client = require('../../database/pg');
const CommonSQL = require('./commonSQL');
/**
 * SQL pour la gestion des villes
 */
class Type extends CommonSQL {
    constructor(){
        super();
    }
    
    /**
     * récupération d'une ville par son nom
     * @param {Text} name 
     * @returns {Object} city - ville avec son code postal
     */
    async getCities(name){
        const city = await client.query(`
        SELECT 
        city.id,
        city.name,
        zip.code
        FROM "city" 
        INNER JOIN zip ON city.zip_id = zip.id
        WHERE name like'%'||$1||'%'`,
        [name]);
        return city.rows;
    }
}
module.exports = Type;