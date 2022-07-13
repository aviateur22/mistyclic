const StoreSQL =  require('./querySQL/storeSQL');
const commonFunction = require('./commonFunction');
const userRole = require ('../userRole');

/**
 * gestion du controller Store
 */
class StoreHelper extends StoreSQL {
    constructor(userId, storeId, requestUserRole){
        super();
        this.userId = userId;
        this.storeId = storeId;
        this.requestUserRole = requestUserRole;
    }

    //#region Vérification avant action
    /**
     * Vérification avant création d'un commerce
     * @param {Number} cityId - id de la ville
     * @param {Number} typeId - id du type de commerce
     * @return {boolean}
     */
    async beforeCreateStore(cityId, typeId){
        //on vérifie l'existance user
        const user = await super.getUser(this.userId);

        //on vérifie que le user est un professionnel
        commonFunction.checkUserRole(user.role_id, userRole.professional);

        //vérification existance de la ville
        await super.getCity(cityId);

        //vérification existance type de magasin
        await super.getStoreType(typeId);

        //Vérification authorisation modification/création
        commonFunction.authorizationUpdateData({
            resultUser: user.id,
            userId: this.userId,
            userActualRole: this.requestUserRole
        });

        return true;
    }

    /**
     * vérification avant modification d'un commerce
     * @returns {Object} store
     */
    async beforeUpdateStore(cityId, typeId){
        //on vérifie le user
        const user = await super.getUser(this.userId);

        //on vérifie que le user est un professionnel
        commonFunction.checkUserRole(user.role_id, userRole.professional);

        //vérification existance de la ville
        await super.getCity(cityId);

        //vérification existance type de magasin
        await super.getStoreType(typeId);

        //on vérifie que le commerce existe
        const store = await super.getStore(this.storeId);

        //on vérifie que le professionnel est rattaché au commerce
        commonFunction.storeBelongToProfessional(store,user.id);
      
        //Vérification authorisation modification/création
        commonFunction.authorizationUpdateData({
            resultUser: user.id,
            userId: this.userId,
            userActualRole: this.requestUserRole
        });

        return store;
    }
    //#endregion

    //#region store Helper
    //#endregion

    //#region store CRUD
    /**
     * création d'un commerce
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
    async createStore(data){
        const store = await super.createStore(data);
    }

    /**
     * mise a jour d'un commerce
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
    async updateStore(store, data){
        //mise à jour du store
        const storeUpdate = await super.updateStore(store, data);
        return storeUpdate;
    }

    /**
     * recherche commerce par son id 
     * @returns {Object} le store
     */
    async getStoreById(){
        const store = await super.getStoreById(this.storeId);

        return store;
    }
    //#endregion   
}

module.exports = StoreHelper;