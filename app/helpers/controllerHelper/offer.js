const {Offer, Store, Condition, ConditionOffer, User, OfferUser } = require('../../models');
const MainHelper = require('./mainHelper');
const randomGenerator = require('../security/generateToken');
const userRole = require('../userRole');

/**
 * gestion du controller Offer
 */
class OfferHelper extends MainHelper {
    constructor(userId, storeId,requestUserRole){
        super(userId,storeId,requestUserRole);
    }

    /**
     * Vérification avant création de l'offre
     * @param {Array} conditions - liste des conditions pour l'offre
     * @return {boolean}
     */
    async beforeCreateOffer(conditions){
        //on vérifie l'existance user
        const user = await super.getUser();

        //on vérifie que le user est un professionnel
        super.checkUserRole(user.role_id, userRole.professional);

        //on vérifie que le commerce existe
        const store = await super.getStore();

        //on vérifie que le user est rattaché au commerce
        super.storeBelongToProfessional(store);

        //on vérifie que les conditions de l'offre existent
        await this.#checkOfferCondition(conditions);

        //Vérification authorisation modification/création
        super.authorizationUpdateData(user.id);

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
        const user = await super.getUser();

        //on vérifie que le user est un professionnel
        super.checkUserRole(user.role_id, userRole.professional);

        //on vérifie que le commerce existe
        const store = await super.getStore();

        //on vérifie que l'offre existe
        const offer = await super.getOffer(offerId);

        //on vérifie que les conditions de l'offre existent
        await this.#checkOfferCondition(conditions);

        //on vérifie que l'offre est rattaché au commerce
        await super.offerBelongToStore(store, offerId);

        //on vérifie que l'offre est rattaché au professionnel
        super.offerBelongToProfessional(offer);

        //Vérification authorisation modification/création
        super.authorizationUpdateData(user.id);

        return offer;
    }

    /**
     * vérifiction avant suppression
     * @param {Number} offerId - id de l'offre
     * @returns {object} offer
     */
    async beforeDestroyOffer(offerId){
        //on vérifie le user
        const user = await super.getUser();

        //on vérifie que le user est un pro
        super.checkUserRole(user.role_id, userRole.professional);

        //on vérifie que le commerce existe
        const store = await super.getStore();

        //on vérifie que l'offre existe
        const offer = await super.getOffer(offerId);

        //on vérifie que l'offre est rattaché au commerce
        await super.offerBelongToStore(store, offerId);

        //on verifie que l'offre est rattaché au professionelle
        super.offerBelongToProfessional(offer);

        //Vérification authorisation modification/création
        super.authorizationUpdateData(user.id);

        return offer;
    }  

    /**
     * suppression des conditions
     * @param {Number} offerId - id de l'offre
     */
    async deleteCondition(offerId){
        //suppression des anciennes conditions
        ConditionOffer.destroy({
            where:{
                offer_id: offerId
            }
        });
    }

    /**
     * vérification avant génération d'un token par un client
     * @param {Number} offerId - id de l'offre
     * @returns { Object} offer | user - l'offre et le client concerné 
     */
    async beforeGenerateToken(offerId){
        //on vérifie le user
        const user = await super.getUser();

        //on vérifie que le commerce existe
        const store = await super.getStore();

        //on vérifie que l'offre existe
        const offer = await super.getOffer(offerId);

        //on vérifie que l'offre est rattaché au commerce
        await super.offerBelongToStore(store, offerId);

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
        const user = await super.getUser();

        //on vérifie que le user à les privilége d'un collaborateur du commerce
        super.checkUserRole(user.role_id, userRole.professional);

        //on vérifie que le commerce existe
        const store = await super.getStore({token: true});

        //on que le commerce appartient au professionnel
        super.storeBelongToProfessional(store);

        //on vérifie que l'offre existe
        const offer = await super.getOffer(offerId, { modelName: User });

        //on vérifie que l'offre est rattaché au commerce
        await super.offerBelongToStore(store, offerId);

        //on verifie que l'offre est rattaché au professionelle
        super.offerBelongToProfessional(offer);

        //suppression des subscriptions expired
        await this.#removeSubscriptionOffer(offerId);

        //Vérification authorisation modification/création
        super.authorizationUpdateData(user.id, userRole.collaborator);

        return offer;
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
            if(!addCondition){
                throw ({ statusCode: 500, message: 'echec d\'enregistrement des conditions de l\'offre' });
            }
        }
    }

    /**
     * génration d'un token unique pour un client qui séléctionne une offre
     * @param {Array} offers - liste des tokens pour l'offre selectionnée
     * @returns {text} token 
     */
    static async checkOfferToken(tokens){
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
     * Vérification que les nouvelles conditions d'offre existent
     * @param {Array} conditions - liste des conditons à vérifier
     */
    async #checkOfferCondition(conditions){
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
     * Suppression des subscriptions expirées
     * @param {Number} offerId - id de l'offre
     */
    async #removeSubscriptionOffer(offerId){
        //recherche de toutes les subscription reliées a offerId
        const subscriptions = await OfferUser.findAll({
            where: {
                offer_id: offerId
            }
        });

        //enregistrement de l'heure actuelle
        const actualTime = new Date().getTime();
        
        for(const subscription of subscriptions){
            //récupération de l'heure de subscription d'une offre
            let offerSubscriptionTime = subscription.updated_at ?  subscription.updated_at.getTime() :  subscription.created_at.getTime();
            
            //Une subscription est valide 10 min
            if(Math.abs(offerSubscriptionTime - actualTime) > 10 * 60000){
                //suppresion si > 10 min
                await subscription.destroy();
            }
        }
    }
}

module.exports = OfferHelper;