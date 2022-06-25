const { Store, User} = require('../models');
/**
 * store Controller
 */
module.exports = {
    createStore: async(req, res, next)=>{
        //données de la requête obligatoire
        const { name, presentation, imageName, street, phone, email, userId, cityId, typeId } = req.body;

        if(!name|| !presentation|| !imageName|| !street|| !phone|| !email|| !userId|| !cityId|| !typeId){
            throw ({ statusCode: 400, message: 'données manquantes pour créer un commerce' });
        }

        //création du store
        const createStore = await Store.create({
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

        res.json({
            message: 'ok'
        });
    },

    updateStore: async(req, res, next)=>{

    }
};