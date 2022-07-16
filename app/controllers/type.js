/**
 * store Controller
 */
module.exports = {
    /**
     * Création d'un nouveau type de magasin
     */
    createType: async(req, res, next)=>{             
        //réponse
        res.status(201).json({
        });
    },

    /**
     * Modification d'un type de magasin
     */
    updateType: async(req, res, next)=>{
        res.status(200).json({
        });
    }    
};