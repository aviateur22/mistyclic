const { Type, Store} = require('../models');
/**
 * store Controller
 */
module.exports = {
    /**
     * Création d'un nouveau type de magasin
     */
    createType: async(req, res, next)=>{     
        const { name } = req.body;

        if(!name){
            throw { statusCode: 400, message: 'le nom de type de magasin est obligatoire'};
        }

        //Création du nouveau type de commerce
        const createType = await Type.findOrCreate({
            where:{
                name: name
            },
            defaults:{
                name
            }
        });

        //Vérification de l'insertion
        if( createType[1] === false){
            throw ({ statusCode: 409, message: 'ce type de magasin existe déja'});
        }

        //réponse
        res.status(201).json({
            type: createType[0]
        });
    },

    /**
     * Modification d'un type de magasin
     */
    updateType: async(req, res, next)=>{
        //type à modifier
        const typeId = req.params.typeId;

        //données
        const { name } = req.body;

        //recherche
        const findType = await Type.findByPk(typeId);

        if(!findType){
            throw ({ statusCode: 404, message: 'ce type de magasin n\'éxiste pas'});
        }

        //Mise a jour des données
        await findType.update({
            name: name
        });
        
        res.status(200).json({
            type: findType
        });
    }    
};