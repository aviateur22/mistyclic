const City = require('../../models/postgreSQL/city');

/**
 * aide a la gestion des villes
 */
class CityHelper extends City {
    /**
     * Requete SQL pour récupérer les villes a partir d'un nom
     * @param {Text} name 
     * @returns 
     */
    async getCityByName(name){
        return await super.getCities(name);
    }  
}

module.exports = CityHelper;