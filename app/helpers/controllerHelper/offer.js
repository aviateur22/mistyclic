const Offer =  require('../../models/postgreSQL/offer');
const commonFunction = require('./commonFunction');
const randomGenerator = require('../security/generateToken');
const userRole = require('../userRole');

/**
 * gestion du controller Offer
 */
class OfferHelper extends Offer {
    /**
     * 
     * @param {Number} userId - id utilisateur
     * @param {Number} storeId - id du commerce
     * @param {Number} requestUserRole - role de la personne effectuant l'action
     */
    constructor(userId, storeId,requestUserRole){
        super();
        this.userId = userId;
        this.storeId = storeId;
        this.requestUserRole = requestUserRole;
    }

    //#region Vérification avant action  
    
    /**
     * Vérification avant création de l'offre
     * @param {Array} conditions - liste des conditions pour l'offre
     * @return {boolean}
     */
    async beforeCreateOffer(conditions){  
        //on vérifie l'existance user
        const user = await super.getUser(this.userId);
        
        //Vérification authorisation modification/création
        await commonFunction.authorizationUpdateData({
            resultUser: user.id,
            userId: this.userId,
            userActualRole: this.requestUserRole
        });

        //on vérifie que le user est un professionnel
        commonFunction.checkUserRole(user.role_id, userRole.professional);
        
        //on vérifie que le commerce existe
        const { store } = await super.getStore(this.storeId);
       
        //on vérifie que le user est rattaché au commerce
        commonFunction.storeBelongToProfessional(store.account_id, this.userId);

        //on vérifie que les conditions de l'offre existent
        await super.checkOfferCondition(conditions);       

        return true;
    }

    /**
     * vérification avant modification d'une offre
     * @param {Number} offerId - id de l'offre
     * @param {Array} conditions - liste des nouvelles conditions de l'offre
     * @returns {Object} offer
     */
    async beforeUpdateOffer(offerId, conditions){
        //on vérifie le user
        const user = await super.getUser(this.userId);

        //Vérification authorisation modification/création
        commonFunction.authorizationUpdateData({
            resultUser: user.id,
            userId: this.userId,
            userActualRole: this.requestUserRole,            
        });

        //on vérifie que le user est un professionnel
        commonFunction.checkUserRole(user.role_id, userRole.professional);

        //on vérifie que le commerce existe et on récupére la liste des offres associées 
        const { store, offers } = await super.getStore(this.storeId);   

        //on vérifie que l'offre existe et qu'elle est rattachée au commerce       
        const offer = await commonFunction.offerBelongToStore(offers, offerId);
        
        //on vérifie que les nouvelles conditions de l'offre existent
        await super.checkOfferCondition(conditions);        

        //on vérifie que l'offre est rattaché au professionnel
        commonFunction.offerBelongToProfessional(offer.account_id, this.userId);      
        console.log(offer)  ;

        return offer;
    }

    /**
     * vérifiction avant suppression
     * @param {Number} offerId - id de l'offre
     * @returns {object} offer
     */
    async beforeDestroyOffer(offerId){
        //on vérifie le user
        const user = await super.getUser(this.userId);

        //Vérification authorisation modification/création
        commonFunction.authorizationUpdateData({
            resultUser: user.id,
            userId: this.userId,
            userActualRole: this.requestUserRole
        });

        //on vérifie que le user est un pro
        commonFunction.checkUserRole(user.role_id, userRole.professional);

        //on vérifie que le commerce existe
        const { store, offers } = await super.getStore(this.storeId);

        //on vérifie que l'offre existe et qu'elle est rattachée  au commerce
        const offer = await commonFunction.offerBelongToStore(offers, offerId);        

        //on verifie que l'offre est rattaché au professionelle
        commonFunction.offerBelongToProfessional(offer.account_id, this.userId);                

        return offer;
    }      

    /**
     * vérification du professionnel avant récupération des offres
     * @param {Number} requestUserRole - role nécessaire pour faire cette requête
     * @returns {boolean}
     */
    async beforeProfessionalGetOffers(UserRoleValidation){
        //récupération données utilisateurs
        const user = await super.getUser(this.userId);

        //Vérification authorisation modification/création
        commonFunction.authorizationUpdateData({
            resultUser: user.id,
            userId: this.userId,
            userActualRole: this.requestUserRole
        });

        //vérification des privilèges
        commonFunction.checkUserRole(user.role_id, UserRoleValidation);       

        //vérification appartenance commerce et user
        if(this.storeId){            
            //on vérifie que le commerce existe
            const { store } = await super.getStore(this.storeId);            

            //on vérifie que le user est rattaché au commerce
            commonFunction.storeBelongToProfessional(store.account_id, this.userId);    
        }

        return true;
    }

    /**
     * vérification avant génération d'un code de remboursement par un client
     * @param {Number} offerId - id de l'offre
     * @returns { Object} offer | user - l'offre et le client concerné 
     */
    async beforeGenerateRefundCode(offerId){
        //on vérifie le user
        const user = await super.getUser(this.userId);

        //on vérifie que le commerce existe et on récupère les offres associées a ce commerce
        const { store, offers } = await super.getStore(this.storeId);     

        //on vérifie que l'offre existe rt qu'elle est rattaché au commerce
        const offer = await commonFunction.offerBelongToStore(offers, offerId);

        //renvoie l'offre et l'utilisateur
        return ({
            offer,
            user
        });
    }

    /**
     * vérification subscription offer
     * @param {Number} offerId - id de l'offre
     * @returns {Object} store - le store
     */
    async beforeGetAllTokenByOfferId(offerId){
        //on vérifie le user
        const user = await super.getUser(this.userId);

        //Vérification authorisation modification/création
        commonFunction.authorizationUpdateData({
            resultUser: user.id,
            userId: this.userId,
            userActualRole: this.requestUserRole,
            levelRoleRequest: userRole.collaborator
        });

        //on vérifie que le commerce existe
        const { store, offers } = await super.getStore(this.storeId); 

        //on que le commerce appartient au professionnel
        commonFunction.storeBelongToProfessional(store.account_id, this.userId);
     
        //on vérifie que l'offre existe et on récupére les clients ayant souscrit à l'offre
        const offer = await super.getOffer(offerId, super.getModels(1));
      
        //on vérifie que l'offre est rattaché au commerce
        await commonFunction.offerBelongToStore(offers, offer.id);

        //on verifie que l'offre est rattaché au professionelle
        commonFunction.offerBelongToProfessional(offer.account_id, this.userId);

        //suppression des subscriptions expired (au dela de XX minutes)
        await this.#removeSubscriptionOffer(offerId);      
       
        return offer;
    }    

    /**
     * vérification avant de faire un remboursement 
     * @param {Text} refundCode - code de remboursement
     * @returns 
     */
    async beforeRefund(refundCode){
        //vérifie que le code de remboursement existe
        const subscription = await super.getSubscriptionByRefundCode(refundCode);        

        //on vérifie que mle store existe
        const store = await super.getStore(this.storeId);

        //récupérer id de l'offre à partir du code promo
        const offerId = subscription.offer_id;

        //vérifier que l'offre existe
        const offer = await super.getOffer(offerId);

        //vérifier que l'offre est rattachée au commerce    
        await commonFunction.offerBelongToStore(store, offerId);

        //verifie que l'offre est rattache au professionel
        commonFunction.storeBelongToProfessional(store, offer.user_id);

        //Vérification authorisation modification/création
        commonFunction.authorizationUpdateData({
            resultUser: offer.user_id,
            userId: store.user_id,
            userActualRole: this.requestUserRole,
            levelRoleRequest: userRole.collaborator
        });

        //récupérer id du client à partir du code promo
        const clientId = subscription.user_id;

        //vérifier que le client existe
        const client = await super.getUser(clientId);

        //on vérifie le montant d'argent pour l'offre   
        const refundPossible = await this.checkOfferMoney(offer);           

        if(!refundPossible){
            throw ({ statusCode:400, message:'le montant disponible ne permets pas de faire un remboursement'});
        }

        return {
            offer,
            client,
            subscription
        };
    }
    //#endregion

    //#region offerHelper
    /**
     * génration d'un token unique pour un client qui séléctionne une offre
     * @param {Array} offers - liste des tokens pour l'offre selectionnée
     * @returns {text} token 
     */
    async checkOfferToken(tokens){
        //vérification du token généré et de la liste des token 
        const tokenExist=()=>{            
            if(randomToken){
                //valeur initial
                let tokenExist = false;
                tokens.forEach(token=>{                                
                    //le token est déja référencé
                    if(randomToken === token){                        
                        tokenExist = true;
                    }
                }); 
                return tokenExist;               
            }
            return tokenExist;
        };        
         
        //boucle tant que le token n'est pas unique
        let randomToken;
        do {            
            randomToken = await randomGenerator(5);
        } while(tokenExist());

        return randomToken;
    }       

    /**
     * Suppression des souscriptions offres expirées
     * @param {Number} offerId - id de l'offre
     */
    async #removeSubscriptionOffer(offerId){
        //recherche de toutes les subscription reliées a offerId
        const subscriptions = await super.getSubscriptionByOfferId(offerId);

        //enregistrement de l'heure actuelle
        const actualTime = new Date().getTime();
        
        for(const subscription of subscriptions){
            //récupération de l'heure de subscription d'une offre
            let offerSubscriptionTime = subscription.updated_at ?  subscription.updated_at.getTime() :  subscription.created_at.getTime();
            
            //Une subscription est valide 10 min
            if(Math.abs(offerSubscriptionTime - actualTime) > 10 * 60000){
                //suppresion si > 10 min
                await super.deleteOfferSubscription(subscription);
            }
        }
    }

    /**
     * vérification que l'argent restant permets de faire un remboursement immédiat
     * @param {Object} offer - l'offre
     * @returns {boolean}
     */
    async checkOfferMoney(offer){
        //recupère le nombre de personne ayant utilisé l'offre
        const offerUsed = await super.getOfferUsed(offer.id);

        //calcul l'argent restant pour l'offre
        const moneyAvail = Number(offer.global_refund) - Number(offerUsed * offer.individual_refund);
        
        //si l'argent restant ne permets pas un remboursement, on pas le status de l'offre à inactive
        if(moneyAvail < offer.individual_refund){
            const data = {...offer, ...{is_active: false}};

            //mise a jour de la donnée            
            await super.updateOffer(offer, data);
            return false;        
        }
        return true;
    }

    //#endregion
    
    //#region offer CRUD
    /**
         * creation d'une offre
         * @param {Object} data - données de l'offre
         */
    async createOffer(data){
        const offer = await super.createOffer(data);
        return offer;
    }

    /**
     * mise à jour d'une offre
     * @param {Object} offer - l'offre à modifier
     * @param {Object} data - les nouvelles données
     */
    async updateOffer(offer, data){
        const updateOffer = await super.updateOffer(offer, data);
        return updateOffer;
    }

    /**
     * recherche de l'offre par son id
     * @param {Number} offerId - id de l'offre
     * @return {object} l'offre recherchée
     */
    async findOfferById(offerId){        
        const offer = await super.getOffer(offerId);
        return offer;
    }

    /**
     * renvoi toutes les offres
     * @param {Array} [filters] - liste des filtres
     * @returns {Array} liste des offres
     */
    async findOffers(filters){
        const offers = await super.getOffers(filters);
        return offers;
    }

    /**
     * ajout de nouvelles conditions à une offre
     */
    async addCondition(offer, conditions){
        await super.addCondition(offer, conditions);
    }

    /**
     * suppression des conditions associées à une offre
     * @param {Number} offerId - id de l'offre
     */
    async deleteCondiditon(offerId){
        await super.deleteCondition(offerId);
    }

    /**
     * ajout du code de remboursement en base de données
     * @param {Object} offer - l'offre
     * @param {Object} user - le client
     * @param {Text} refundCode - code de remboursment
     * @returns {object} l'ajout du code de remboursment
     */
    async clientSubscribeToOffer(offer, user, refundCode){
        /**ajout du code de emboursement */
        const addRefundCode = await super.clientSubscribeToOffer(offer, user, refundCode);
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
        //enregistrement du remboursement
        const registerRefund = await super.registerRefund(offer, clientId, storeId);
        return registerRefund;
    }

    /**
     * suppresion d'une souscription
     * @param {Object} subscription - la souscription a supprimé
     */
    async deleteOfferSubscription(subscription){                
        //suppression souscription
        await super.deleteOfferSubscription(subscription);
    }   
    //#endregion    
}

module.exports = OfferHelper;