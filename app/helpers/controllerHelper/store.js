const MainHelper =  require('./mainHelper');
const userRole = require ('../userRole');

/**
 * gestion du controller Store
 */
class StoreHelper extends MainHelper {
    constructor(userId, storeId, requestUserRoleId){
        super(userId, storeId, requestUserRoleId);
    }

    /**
     * Vérification avant création d'un commerce
     * @param {Number} cityId - id de la ville
     * @param {Number} typeId - id du type de commerce
     * @return {boolean}
     */
    async beforeCreateStore(cityId, typeId){
        //on vérifie l'existance user
        const user = await super.getUser();

        //on vérifie que le user est un professionnel
        super.checkUserRole(user.role_id, userRole.professional);

        //vérification existance de la ville
        await super.getCity(cityId);

        //vérification existance type de magasin
        await super.getStoreType(typeId);

        //Vérification authorisation modification/création
        super.authorizationUpdateData(user.id);

        return true;
    }

    /**
     * vérification avant modification d'un commerce
     * @returns {Object} store
     */
    async beforeUpdateStore(cityId, typeId){
        //on vérifie le user
        const user = await super.getUser();

        //on vérifie que le user est un professionnel
        super.checkUserRole(user.role_id, userRole.professional);

        //vérification existance de la ville
        await super.getCity(cityId);

        //vérification existance type de magasin
        await super.getStoreType(typeId);

        //on vérifie que le commerce existe
        const store = await super.getStore();

        //on vérifie que le professionnel est rattaché au commerce
        super.storeBelongToProfessional(store);
      
        //Vérification authorisation modification/création
        super.authorizationUpdateData(user.id);

        return store;
    }

    #storeType(){

    }
}

module.exports = StoreHelper;