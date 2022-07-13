const { Op } = require('sequelize');
const {Offer, Store, User, Type, City, OfferUser, Refund, ConditionOffer, Condition } = require('../../../models');
const CommonSQL = require('./commonSQL');


class StoreSQL extends CommonSQL{    
    /**
     * sélection du model pour effectuer des assciations
     * @param {Number} number - le numéro du model
     * @returns {object} - le model 
     */
    getModels(number){
        switch (number){
        case 1:
            return { model: User, as: 'users' };
        default: return null;
        }
    }

    /**
     * vérifie existance d'une offre
     * @param {Number} offerId - id de l'offre
     * @param {Object} includeModel - model a recuperer
     * @param {Boolean} inactiveOffer - affichage des offre inactive
     * @returns {Object} offer - renvoie l'offre
     */
    async getOffer(offerId, model){
        //recherche de l'offre       
        let offer;        
        if(model){
            offer = await Offer.findByPk(offerId, {
                include: model
            });
        } else {
            offer = await Offer.findByPk(offerId);
        }
       
        //offre pas trouvé
        if(!offer){
            throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas' });
        }

        return offer;
    }

    /**
     * vérifie qu'un code de remboursement existe
     * @param {Text} refundCode - code de remboursement
     * @returns {Object} - refund
     */
    async getSubscriptionByRefundCode(refundCode){
        //recherche du code promo 
        const findRefundCode = await OfferUser.findOne({
            where: {
                refund_code: refundCode,                
            }
        });

        //code refund pas trouvé
        if(!findRefundCode){
            throw ({ statusCode: 404, message: 'ce code de remboursement n\'existe pas'});
        }

        return findRefundCode;
    }

    /**
     * renvoie une liste d'offre en fonction de certains parametres
     * @param {Array} param - tableau d'objet contenant les parametres de filtre
     * @return {Array} liste des offres
     */
    async getOffers(param){
        let offers;        

        //si pas de parametres
        if(!param){
            offers = await Offer.findAll();
        } else {
            offers = await Offer.findAll({
                where: {
                    [Op.and]: [...param]
                }
            });
        }

        return offers;
    }     

    /**
     * renvoie le nombre de personne ayant utilisé l'offre
     * @param {Number} offerId - id de l'offre
     * @return {Number} nombre de personne
     */
    async getOfferUsed(offerId){
        //compte le nombre d'utilisateur
        const offerUsed = await Refund.count({
            where:{
                offer_id: offerId
            }
        }); 

        return offerUsed;
    }

    /**
     * récupération de toutes les souscriptions à une offre
     * @param {Number} offerId 
     * @return {Array} Liste des souscriptions
     */
    async getSubscriptionByOfferId(offerId){
        //recherche de toutes les subscription reliées a offerId
        const subscriptions = await OfferUser.findAll({
            where: {
                offer_id: offerId
            }
        });

        return subscriptions;
    }

    /**
     * vérification existance souscription d'offre
     */
    async getSubscriptionById(subscriptionId){
        //recherche de la souscription
        const subscription = await OfferUser.findByPk(subscriptionId);

        //si pas trouvé
        if(!subscription){
            throw ({ statusCode: 404, message: 'cette souscription n\'existe plus' });
        }
        
        return subscription;
    }

    /**
     * création d'une offre
     * @param {Object} data - données pour créer l'offre
     */
    async createOffer(data){
        //création de l'offre
        const offer = await Offer.create({
            name: data.name,
            presentation: data.presentation,
            global_refund: data.globalRefund,
            individual_refund: data.individualRefund,
            image_url: data.imageName,
            store_id: data.storeId,
            user_id: data.userId,
            city_id: data.cityId
        });   
        
        //echec création
        if(!offer){
            throw ({ statusCode: 500, message: 'echec d\'enregistrement de votre offre' });
        }

        return offer;
    }

    /**
     * mise à jour d'une offre
     * @param {Object} offer - l'offre
     * @param {Object} data - données a mettre a jour
     */
    async updateOffer(offer, data){        
        //mise a jour des données
        const updateOffer = await offer.update({
            ...data
        });  
       
        //echec création
        if(!updateOffer){
            throw ({ statusCode: 500, message: 'echec d\'modification de l\'offre' });
        }

        return updateOffer;
    }

    /**
     * ajout du code de remboursement en base de données
     * @param {Object} offer - l'offre
     * @param {Object} user - le client
     * @param {Text} refundCode - code de remboursment
     * @returns {object} l'ajout du code de remboursment
     */
    async clientSubscribeToOffer(offer, user, refundCode){
        //ajout du token + id utilisateur en base de données
        const addRefundCode = await offer.addUsers(user, {
            through:{
                refund_code: refundCode
            }
        });

        //echec sauvergade du code de remboursement
        if(!addRefundCode){
            throw ({statusCode: 500, message: 'echec sauvegarde code de remboursement' });
        }

        return addRefundCode;
    }

    /**
     * enregistrement remboursement client
     * @param {Object} offer - l'offre
     * @param {Number} clientId - l'id du client
     * @param {Number} storeId - l'id du commerce
     * @returns {Object} - l'enregistrement
     */
    async registerRefund(offer, clientId, storeId){
        //test
      
        //ajout du remboursement
        const addRefund = await offer.addUserRefunds(clientId,{
            through: {
                store_id: storeId
            },  
            duplicating: true                     
        });  
        
        //echec sauvegarde
        if(!addRefund){
            throw ({statusCode: 500, message: 'echec sauvegarde remboursement' });
        }

        return addRefund;
    }    

    /**
     * Vérification que les nouvelles conditions d'offre existent
     * @param {Array} conditions - liste des conditons à vérifier
     */
    async checkOfferCondition(conditions){
        if(conditions.length === 0){
            throw ({ statusCode: 400, message: 'selectionner au moins 1 condition' });
        }
        //Vérification si les conditions de l'offre existe 
        for(let condition of conditions){  
            const findCondition = await Condition.findByPk(condition);
            if(!findCondition){
                throw ({ statusCode: 404, message: 'la conditon renseignée n\'existe pas' });
            }        
        }
    }    

    /**
     * suppression des conditions
     * @param {Number} offerId - id de l'offre
     */
    async deleteCondition(offerId){
        //suppression des anciennes conditions
        await ConditionOffer.destroy({
            where:{
                offer_id: offerId
            }
        });
    }

    /**
     * suppression souscription offre
     * @param {Object} subscription - souscription offre a supprimée
     */
    async deleteOfferSubscription(subscription){
        await subscription.destroy();
    }

    /**
     * ajout de conditions à une offre
     * @param {Object} offer - offre concerné par les conditions
     * @param {Array} conditions - consition a ajouter à l'offre
     */
    async addCondition(offer, conditions){
        //Ajout des conditions dans la table de liasion
        for(const condition of conditions){            
            const addCondition = await offer.addConditions(condition);              

            //echech ajout
            if(!this.addCondition){
                throw ({statusCode: 500, message: 'echec sauvegarde des conditions de l\'offre' });
            }
        }        
    }
}

module.exports = StoreSQL;