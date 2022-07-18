const StoreHelper = require('../helpers/controllerHelper/store');

/**
 * store Controller
 */
module.exports = {
    /**
     * création d'un store
     */
    createStore: async(req, res, next)=>{
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload?.data?.roleId;

        //données de la requête obligatoire
        const { name, presentation, imageName, street, phone, email, userId, cityId, typeId } = req.body;

        if(!name|| !presentation|| !imageName|| !street|| !phone|| !email|| !userId|| !cityId|| !typeId){
            throw ({ statusCode: 400, message: 'données manquantes pour créer un commerce' });
        }

        //vérification avant création du store
        const storeHelper = new StoreHelper(userId, null, requestRoleId);
        await storeHelper.beforeCreateStore(cityId, typeId);

        //création du store
        const store = await storeHelper.createStore({
            name: name,
            presentation: presentation,
            image_url: imageName,
            street,
            phone,
            email,
            account_id: userId,
            city_id: cityId,
            type_id: typeId
        });

        res.status(201).json({
            store,
            message: 'votre commerce est créé'
        });
    },

    /**
     * Modification d'un store
     */
    updateStoreById: async(req, res, next)=>{
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload?.data?.roleId;

        //id du commerce
        const storeId = req.params.storeId;

        //données de la requête obligatoire
        const { name, presentation, imageName, street, phone, email, userId, cityId, typeId } = req.body;


        if(!name|| !presentation|| !imageName|| !street|| !phone|| !email|| !userId|| !cityId|| !typeId){
            throw ({ statusCode: 400, message: 'données manquantes pour mettre à jour le commerce' });
        }

        //vérification avant mise a jour du store
        const storeHelper = new StoreHelper(userId, storeId, requestRoleId);
        let store = await storeHelper.beforeUpdateStore(cityId, typeId);
         

        //mise a jour des données
        const data = {...store, ...{name, presentation, image_url: imageName, street, phone, email, city_id: cityId, type_id: typeId}};
       
        //mise a jour du store
        const updateStore = await storeHelper.updateStore(store.id, data);

        res.json({
            updateStore,
            message: 'votre commerce est mis à jour'
        });
    },

    /**
     * récupération des données d'un store par son id
     */
    getStoreById: async(req, res, next)=>{
        //id du store
        const storeId = req.params.storeId;

        //vérification avant mise a jour du store
        const storeHelper = new StoreHelper(null, storeId, null);

        //récuperation su store par son id
        const store = await storeHelper.getStoreById();

        res.json({
            store
        });
    }
    
};