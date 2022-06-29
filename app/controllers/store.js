const { Store, User} = require('../models');
const belongTo = require('../helpers/belongTo');
const userRole = require('../helpers/userRole');
/**
 * store Controller
 */
module.exports = {
    /**
     * création d'un store
     */
    createStore: async(req, res, next)=>{
        //données de la requête obligatoire
        const { name, presentation, imageName, street, phone, email, userId, cityId, typeId } = req.body;

        if(!name|| !presentation|| !imageName|| !street|| !phone|| !email|| !userId|| !cityId|| !typeId){
            throw ({ statusCode: 400, message: 'données manquantes pour créer un commerce' });
        }

        //vérification de l'existance du professionnel
        const user = await User.findByPk(userId);

        if(!user){
            throw ({ statusCode: 404, message: 'utilisateur non présent en base de données' });
        }

        if(user.role_id < userRole.admin){
            throw ({ statusCode: 403, message: 'vous ne pouvez pas créer de commerce' });
        }

        //création du store
        const store = await Store.create({
            name: name,
            presentation: presentation,
            image_url: imageName,
            street,
            phone,
            email,
            user_id: userId,
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
        //id du commerce
        const storeId = req.params.storeId;

        //données de la requête obligatoire
        const { name, presentation, imageName, street, phone, email, userId, cityId, typeId } = req.body;


        if(!name|| !presentation|| !imageName|| !street|| !phone|| !email|| !userId|| !cityId|| !typeId){
            throw ({ statusCode: 400, message: 'données manquantes pour mettre à jour le commerce' });
        }

        //récuperation du store
        const store = await Store.findByPk(storeId);

        // Vérification existance
        if(!store){
            throw ({ statusCode: 404, message: 'ce commerce n\'est pas présent en base de données' });
        }

        //id du professionnel
        const storeUserId = store.user_id;

        //Vérification si l'action est autorisé
        if(!belongTo(userId, storeUserId, req.payload.data.roleId)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas autorisé à faire cette action' });
        }

        //mise a jour des données
        const data = {...store, ...{name, presentation, image_url: imageName, street, phone, email, city_id: cityId, type_id: typeId}};

        await store.update({
            ...data
        });

        res.json({
            message: 'votre commerce est mis à jour'
        });
    },

    /**
     * récupération des données d'un store par son id
     */
    getStoreById: async(req, res, next)=>{
        //id du store
        const storeId = req.params.storeId;

        //récuperation su store par son id
        const store = await Store.findByPk(storeId);

        if(!store){
            throw ({ statusCode: 404, message: 'ce commerce n\'est pas présent en base de données' });
        }

        res.json({
            store
        });
    }
    
};