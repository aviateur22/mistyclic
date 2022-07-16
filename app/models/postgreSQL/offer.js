const CommonSQL = require('./commonSQL');
const client = require('../../database/pg');


class Offer extends CommonSQL{    
    /**
     * sélection du model pour effectuer des assciations
     * @param {Number} number - le numéro du model
     * @returns {object} - le model 
     */
    getModels(number){
        switch (number){
        case 1:
            return { model: 'offer_has_user' };
        default: return null;
        }
    }

    /**
     * offre par id
     * @param {Number} offerId - id de l'offre
     * @param {Object} includeModel - model a recuperer
     * @param {Number} storeId - id du store
     * @returns {Object} offer - renvoie l'offre
     */
    async getOffer(offerId, model, storeId){        
        //recherche de l'offre       
        let offer;  

        //Jointure avec un model
        if(model){   
            switch (model.model){
            //récupération des codes de rembourssement + email des clients 
            case 'offer_has_user': 
                
                //donnée de l'offre
                offer = await client.query('SELECT * FROM "offer" WHERE id = $1',
                    [offerId]);
                
                //offre pas trouvé
                if(offer.rowCount === 0 ){
                    throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas' });
                }
                
                //données sur les clients ayant souscrit à l'offre
                offer.rows[0].client = await client.query(`
                SELECT
                offer_has_user.id AS refund_code_id,
                offer_has_user.account_id AS refund_code_client_id,
                offer_has_user.refund_code AS refund_code_code,
                offer_has_user.offer_id AS refund_code_offer_id,
                account.email AS refund_code_client_email
                FROM "offer_has_user"               
                INNER JOIN "account" ON offer_has_user.account_id = account.id
                WHERE offer_has_user.offer_id = $1
                `,
                [offerId]
                ).then(client => client.rows);

               
                return offer.rows[0];
            default: throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas' });
            }            
        } else {        
            offer = await client.query('SELECT * FROM "offer" WHERE offer.id = $1',                
                [offerId]
            );

            //offre pas trouvé
            if(offer.rowCount === 0 ){
                throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas' });
            }
            return offer.rows[0];
        }       
    }

    /**
     * vérifie qu'un code de remboursement existe
     * @param {Text} refundCode - code de remboursement
     * @returns {Object} - refund
     */
    async getSubscriptionByRefundCode(refundCode){        
        //recherche du code promo 
        const findRefundCode = await client.query('SELECT * FROM "offer_has_user" WHERE refund_code = $1',
            [refundCode]
        );

        //code refund pas trouvé
        if(!findRefundCode.rowCount === 0){
            throw ({ statusCode: 404, message: 'ce code de remboursement n\'existe pas'});
        }

        return findRefundCode.rows[0];
    }

    /**
     * renvoie une liste d'offre en fonction de certains parametres
     * @param {Array} filters - tableau d'objet contenant les parametres de filtre
     * @return {Array} liste des offres
     */
    async getOffers(filters){ 
        //offres a récupérer
        let offers; 

        //filtres disponibles
        if(filters){
            //paramètre sup requête
            let queryParam = '';    
            
            //mise en forme des paramètre de filtre
            filters.forEach(param => {                           
                if(!queryParam){
                    queryParam = `${Object.keys(param)} = ${Object.values(param)}`;
                } else {
                    queryParam += ` AND ${Object.keys(param)} = ${Object.values(param)}` ; 
                }                   
            });
            //requète sql avec filtre
            offers = await client.query(`SELECT * FROM "offer" WHERE ${queryParam}`);
        } else {
            //requète sql sans filtre
            offers = await client.query('SELECT * FROM "offer"');
        }

        return offers.rows;
    }     

    /**
     * renvoie le nombre de personne ayant utilisé une offre
     * @param {Number} offerId - id de l'offre
     * @return {Number} nombre de personne
     */
    async getOfferUsed(offerId){
        //compte le nombre d'utilisateur
        const offerUsed = await client.query('SELECT * FROM "refund" WHERE offer_id = $1', 
            [offerId]
        );

        return offerUsed.rowCount;
    }

    /**
     * récupération de toutes les souscriptions à une offre
     * @param {Number} offerId 
     * @return {Array} Liste des souscriptions
     */
    async getSubscriptionByOfferId(offerId){
        //recherche de toutes les subscription reliées a offerId
        const subscriptions = await client.query('SELECT * FROM "offer_has_user" WHERE offer_id = $1',
            [offerId]
        );
        return subscriptions.rows;
    }

    /**
     * vérification existance souscription d'offre
     */
    async getSubscriptionById(subscriptionId){
        const subscription = await client.query('SELECT * FROM "offer_has_user" WHERE id = $1',
            [subscriptionId]
        );       

        //si pas trouvé
        if(subscription.rowCount === 0){
            throw ({ statusCode: 404, message: 'cette souscription n\'existe plus' });
        }        
        return subscription.rows[0];
    }

    /**
     * création d'une offre
     * @param {Object} data - données pour créer l'offre
     */
    async createOffer(data){
        //création de l'offre
        const offer = await client.query('INSERT INTO "offer" ("name", "presentation", "global_refund", "individual_refund", "image_url", "store_id", "account_id", "city_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [data.name, data.presentation, data.globalRefund, data.individualRefund, data.imageName, data.storeId, data.userId, data.cityId]
        );       
        
        //echec création
        if(!offer.rowCount === 0){
            throw ({ statusCode: 500, message: 'echec d\'enregistrement de votre offre' });
        }

        return offer.rows[0];
    }

    /**
     * mise à jour d'une offre
     * @param {Object} offer - l'offre
     * @param {Object} data - données a mettre a jour
     */
    async updateOffer(offer, data){         
        data.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        //mise a jour des données
        const updateOffer = await client.query(`
        UPDATE offer SET
        name = $1,
        presentation = $2,
        global_refund = $3,
        individual_refund = $4,
        image_url = $5,
        store_id = $6,
        account_id = $7,
        city_id = $8,
        is_active = $9,
        updated_at = $10
        WHERE id = $11
        RETURNING *`
        , 
        [data.name, data.presentation, data.global_refund, data.individual_refund, data.image_url, data.store_id, data.account_id, data.city_id, data.is_active, data.updated_at, offer.id]
        );   
       
        //echec création
        if(!updateOffer.rowCount === 0){
            throw ({ statusCode: 500, message: 'echec d\'modification de l\'offre' });
        }

        return updateOffer.rows[0];
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
        const addRefundCode = await client.query('INSERT INTO "offer_has_user" ("account_id", "offer_id","refund_code") VALUES ($1, $2, $3) RETURNING *',
            [user.id, offer.id, refundCode]);

        //echec sauvergade du code de remboursement
        if(addRefundCode.rowCount === 0){
            throw ({statusCode: 500, message: 'echec sauvegarde code de remboursement' });
        }

        return addRefundCode.rows[0];
    }

    /**
     * enregistrement remboursement client
     * @param {Object} offer - l'offre
     * @param {Number} clientId - l'id du client
     * @param {Number} storeId - l'id du commerce
     * @returns {Object} - l'enregistrement
     */
    async registerRefund(offer, clientId, storeId){
        //test sql query
        const addRefund = await client.query('INSERT INTO "refund" ("account_id", "offer_id","store_id") VALUES ($1,$2,$3) RETURNING *', 
            [clientId, offer.id, storeId]
        );
        
        //echec sauvegarde
        if(addRefund.rowCount === 0){
            throw ({statusCode: 500, message: 'echec sauvegarde remboursement' });
        }

        return addRefund.rows[0];
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
            const findCondition = await client.query('SELECT * FROM "condition" WHERE id = $1',
                [condition]
            );

            if(findCondition.rowCount === 0){
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
        await client.query('DELETE FROM "condition_has_offer" WHERE id = $1',
            [offerId]
        );
    }

    /**
     * suppression souscription offre
     * @param {Object} subscription - souscription offre a supprimée
     */
    async deleteOfferSubscription(subscription){
        await client.query('DELETE FROM "offer_has_user" WHERE id = $1',
            [subscription.id]);
    }

    /**
     * ajout de conditions à une offre
     * @param {Object} offer - offre concerné par les conditions
     * @param {Array} conditions - consition a ajouter à l'offre
     */
    async addCondition(offer, conditions){        
        //Ajout des conditions dans la table de liasion
        for(const condition of conditions){            
            const addCondition =await client.query('INSERT INTO "condition_has_offer" ("condition_id", "offer_id") VALUES ($1, $2)',
                [condition, offer.id]
            );

            //echech ajout
            if(addCondition.rowCount === 0){
                throw ({statusCode: 500, message: 'echec sauvegarde des conditions de l\'offre' });
            }
        }        
    }
}

module.exports = Offer;