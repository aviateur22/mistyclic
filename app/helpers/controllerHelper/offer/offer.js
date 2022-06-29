const {Offer, Store, Condition, ConditionOffer, User } = require('../../../models');
const userRole = require('../../userRole');
const randomGenerator = require('../../../helpers/security/generateToken');

class OfferData {
    /**
     * 
     * @param {Number} userId - id utilisateur
     * @param {Number} storeId - id du commerce
     * @param {Number} requestUserRole - role de la personne effectuant l'action
     */
    constructor(userId, storeId, requestUserRole){
        this.userId = userId;
        this.storeId = storeId;
        this.requestUserRole = requestUserRole;
    }    

    /**
     * vérification avant création d'une offre
     * @param {Array} conditions - liste des conditions selectionnée pour l'offre
     * @returns {Boolean} true|false
     */
    async beforeCreateOffer(conditions){  
        // récupération des informations du store 
        const store = await this.#storeInformation();  

        
        //vérification client et store
        if(Number(store.user_id) !== Number(this.userId)){
            throw ({ statusCode: 403, message: 'Le client n\'est pas rattaché au commerce désigné' });
        }

        //verification des conditions de l'offre
        await this.#checkOfferCondition(conditions);

        //Vérification  si modification possible
        return (await this.authorizationUpdateData(store.user_id));
    }

    /**
     * vérification avant mise a jour d'une offre
     * @param {*} offerId 
     * @param {Array} conditions - liste des conditions selectionnée pour l'offre
     * @returns {Object | error}
     */
    async beforeUpdateOffer(offerId, conditions){
        //récupération des élémént du store
        const store = await this.#storeInformation();

        //verification des conditions de l'offre
        await this.#checkOfferCondition(conditions);

        //Validation de l'offre a modifier
        const offer = await this.#validateOffer(offerId);

        //Vérification que l'offre appartient au commerce
        const offerBelongToStore = store?.storeOffers.some(offer => Number(offerId) === Number(offer.id));
        if(!offerBelongToStore)
        {
            throw ({ statusCode: 400, message: 'l\'offre à modifiée n\'est pas rattachée au bon commerce' }); 
        }   
        
        //Vérification  si modification possible
        if(await this.authorizationUpdateData(offer.user_id)) {
            return offer;
        } 
    }

    /**
     * vérification avant suppression d'une offre
     * @param {Number} offerId - id de l'offre
     * @returns {Object} offer - l'offre a supprimer
     */
    async beforeDestroyOffer(offerId){        
        //Validation de l'offre a modifier
        const offer = await this.#validateOffer(offerId);
        
        //Vérification  si modification possible
        if(await this.authorizationUpdateData(offer.user_id)) {
            return offer;
        }
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
     * vérification que l'offre existe et appartient au professionnel
     * @param {Number} offerId 
     * @returns {object} offre sélectionnée 
     */
    async #validateOffer(offerId){
        //Vérification existance de l'offre
        const offer = await Offer.findByPk(offerId);

        if(!offer){
            throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas' });
        }

        //vérification rattachement du compte
        if(Number(offer.user_id) !== Number(this.userId)){            
            throw ({ statusCode: 403, message: 'cette offre n\'est pas rattachée à votre compte' });
        }

        if(Number(offer.store_id !== Number(this.storeId))){
            throw ({ statusCode: 403, message: 'cette offre n\'est pas rattachée à votre commerce' });
        }
        
        return offer;
    }

    /**
     * vérifie le commerce
     * @returns {Object} store - le commerce concerné par l'offre
     */
    async #storeInformation(){
        //récupération du store
        const store = await Store.findByPk(this.storeId,{
            include: ['storeOffers']
        });

        //pas de résulat
        if(!store){
            throw ({ statusCode: 404, message: 'le commerce concerné n\'existe pas' });
        }   
        return store;  
    }  

    /**
     * Vérification que les nouvelles conditions d'offre existent
     * @param {Array} conditions - liste des conditons à vérifier
     */
    async #checkOfferCondition(conditions){
        //Vérification si les conditions de l'offre existe 
        for(let condition of conditions){  
            const findCondition = await Condition.findByPk(condition);
            if(!findCondition){
                throw ({ statusCode: 404, message: 'la conditon renseignée n\'existe pas' });
            }        
        }
    }

    /**
     * récupération info utilisateur
     * @param {Number} userId - id de l'utilisateur
     * @returns {boolean} - true si action autorisée
     */
    async #userInformation(userId){
        const user = await User.findByPk(userId);

        //si pas d'utilisateur de trouvé
        if(!user){
            throw ({ statusCode: 404, message: 'Aucune personne coorespond a cet identifiant' });
        }

        return user.user_role;
    }

    async authorizationUpdateData(userIdCompare){        
        //Si Admin, alors on vérifie que le client a les droits nécessaires
        if(this.requestUserRoleId === userRole.admin){
            const roleId = await this.#userInformation(this.userId);
            if(Number(roleId) < Number(userRole.professional)){
                throw ({message: 'vous ne pouvez pas executer cette action', statusCode:'403'});
            }
            return true;
        } else {
            if(Number(userIdCompare) !== Number(this.userId)){
                throw ({message: 'vous ne pouvez pas executer cette action', statusCode:'403'});
            }
            return true;
        }
    }  
}

module.exports = OfferData;