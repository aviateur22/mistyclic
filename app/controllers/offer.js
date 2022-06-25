const { Offer, User, Store, Condition} = require('../models');
const belongTo = require('../helpers/belongTo');
/**
 * offer Controller
 */
module.exports = {
    /**
     * Création d'une offre
     */
    createOffer: async(req, res, next)=>{     
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;

        //données de l'annonce
        const { name, presentation, globalRefund, individualRefund, imageName, storeId, userId, conditions } = req.body;

        if(!name || !presentation || !globalRefund || !individualRefund || !imageName || !storeId || !userId || !conditions){
            throw ({ statusCode: 400, message: 'données manquantes pour créer une offre' });
        }

        //récupération du store
        const store = await Store.findByPk(storeId);

        //pas de résulat
        if(!store){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas autorisé à faire cette action' });
        }

        //Vérification si l'action est autorisé
        if(!belongTo(userId, store.user_id, requestRoleId)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas autorisé à faire cette action' });
        }

        const createOffer = await Offer.create({
            name,
            presentation,
            globalRefund,
            individualRefund,
            imageName,
            store_id: storeId,
            user_id: userId           

        });

        //Ajout de la liste des conditions
        await (async()=>{
            /** stocks les promesses */
            const promises = [];
            conditions.forEach((condition)=>{   
                const query =  createOffer.addCondintions(condition);         
                promises.push(query);
            });
            /** résolution des promesses */
            await Promise.all(promises);
        })();
    },

    /**
     * update d'une offre
     */
    updateOfferByOfferId: async(req, res, next)=>{

    },

    /**
     * suppression d'une offre
     */
    deleteOfferByOfferId: async(req, res, next)=>{

    },

    /**
     * génération d'un token pour une offre par un client
     */
    clientGenerateTokenByOfferId:()=>{

    },

    /**
     * Récupération de tous les tokens actifs
     */
    getAllTokenByOfferId:()=>{

    },

    /**
     * Validation d'un token d'une offre afin de valider le rembourssement immédiat
     */
    professionalValidateTokenByOfferId:()=>{

    },

    /**
     * activation du remboursement du client
     */
    professionalValidateRefundByOfferId:()=>{

    }

};