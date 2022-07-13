const OfferHelper = require('../helpers/controllerHelper/offer');
const userRole = require('../helpers/userRole');

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
        const { name, presentation, globalRefund, individualRefund, imageName, storeId, userId, cityId, conditions } = req.body;

        if(!name || !presentation || !globalRefund || !individualRefund || !imageName || !storeId || !userId || !cityId || !conditions){
            throw ({ statusCode: 400, message: 'données manquantes pour créer une offre' });
        }             
        
        //Vérification de la données avant la créatrion de l'offre
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);        
        const createOffer = await offerHelper.beforeCreateOffer(conditions);            
        
        //echec vérification
        if(!createOffer){
            throw ({ statusCode: 403, message: 'vous ne pouvez pas executer cette action' });
        }

        //création de l'offre
        const offer = await offerHelper.createOffer({
            name,
            presentation,
            globalRefund,
            individualRefund,
            imageName,
            storeId,
            userId,
            cityId
        });    

        //ajout des nouvelles conditions
        await offerHelper.addCondition(offer, conditions);

        res.status(201).json({
            offer,
            message: 'votre offre est créée'
        });
    },

    /**
     * update d'une offre
     */
    updateOfferById: async(req, res, next)=>{
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;

        //id de l'offre
        const offerId = req.params.offerId;                

        //données de l'offre à modifier
        const { name, userId, presentation, imageName, conditions, storeId } = req.body;

        //Vérification de la données avant la modification de l'offre  
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);
        let offer = await offerHelper.beforeUpdateOffer(offerId, conditions);

        //données à modifier
        const data = { ...offer, ...{name, presentation, image_url: imageName }};


        //mise a jour des données
        const updateOffer = await offerHelper.updateOffer(offer, data);  
        
        //Suppression des anciennes conditions de l'offre
        await offerHelper.deleteCondition(updateOffer.id);

        //ajout des nouvelles conditions
        await offerHelper.addCondition(updateOffer, conditions);

        //récupération de l'offre à jour
        offer = await offerHelper.findOfferById(offerId);

        res.json({
            offer,
            message: 'votre offre est mise à jour'
        });
    },

    /**
     * récupération d'une offre par son id
     */
    getOfferById: async(req, res, next)=>{
        //id de l'offre
        const offerId = req.params.offerId;    

        //recherche de l'offre        
        const offerHelper = new OfferHelper();
        const offer = await offerHelper.findOfferById(offerId);

        res.json({
            offer
        });
    },

    /**
     * Récupération de toutes les offres
     */
    getOffers:async(req, res, next)=>{
        //recherche des offres
        const offerHelper = new OfferHelper();
        const offers = await offerHelper.findOffers();
        
        res.json({
            offers
        });
    },

    /**
     * récupération des offres pour une ville
     */
    getOffersByCity: async(req, res, next)=>{
        //id de la ville
        const cityId = req.params.cityId;

        //recherche des offres de la ville
        const offerHelper = new OfferHelper();
        const param = [
            {city_id: cityId}   
        ];   

        const offers = await offerHelper.findOffers(param);

        res.json({
            offers
        });
    },

    /**
     * récupération des offres d'un commerce
     * @param {boolean} inactiveOffer - affichage des offres qui sont aussi inactive (pour un professionnel)
     */
    getOffersByStore:(inactiveOffer)=>async(req, res, next)=>{  
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;

        //id du commerce
        const storeId = req.params.storeId;

        //paramètre de la requête      
        let param;

        let offerHelper;

        //Seule les professionnels peuvent avoir accès aux offres inactives
        if(inactiveOffer){
            //id du professionel
            const userId = req.params.userId;  
            
            //vérification des droits d'accès
            offerHelper = new OfferHelper(userId, storeId, requestRoleId);     
            await offerHelper.beforeProfessionalGetOffers(userRole.professional);

            //paramatres du filtre
            param = [
                {store_id: storeId}   
            ];            
        } else {
            offerHelper = new OfferHelper(null, storeId, requestRoleId);  
            
            //paramatres du filtre
            param = [            
                {is_active: true},    
                {store_id: storeId}   
            ];
        }   

        //récupération des offres liées aux commerces
        const offers = await offerHelper.findOffers(param);

        res.json({
            offers
        });
    },

    /**
     * Récupération des offres par id utilisateur
     * @param {Boolean} allOffer  - affichage de toutes offres active ou non active (pour un professionnel)
     * @returns 
     */
    getOffersByUserId:(allOffer)=>async(req, res, next)=>{
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;

        //userId
        const userId = req.params.userId;

        //paramètre de la requête      
        let paramRequest;

        const offerHelper = new OfferHelper(userId, null, requestRoleId);

        //Seule les professionnels peuvent avoir accès a toutes les offres
        if(allOffer){
            await offerHelper.beforeProfessionalGetOffers(userRole.professional);
            paramRequest = [
                {user_id: userId},    
            ];            
        } else {            
            paramRequest = [
                {user_id: userId},
                {is_active: true}
            ];
        }   
        
        //récupération des offres liées aux userId
        const offers = await offerHelper.getOffers(paramRequest);

        res.json({
            offers
        });
    },

    /**
     * suppression d'une offre
     */
    deleteOfferById: async(req, res, next)=>{
        //id de l'offre
        const offerId = req.params.offerId; 

        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;
        
        //id du professionnel
        const { userId, storeId } = req.body;
        
        //Vérification de la données avant la suppression de l'offre
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);
        const offer = await offerHelper.beforeDestroyOffer(offerId);
        
        //mise a jour de la donnée        
        const data = {...offer, ...{is_active: false}};

        //supprssion de l'offre - pas is_active à false
        await offerHelper.updateOffer(offer, data);        

        res.json({
            message: 'votre offre n\'est plus active'
        });
    },

    /**
     * génération d'un token pour une offre par un client
     */
    clientSubscribeByOfferId:async(req, res, next)=>{
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;

        //id utilisateur générant le token 
        const { userId, storeId, offerId } = req.params;

        //Vérification de la données avant la génération d'un token
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);

        //récupération de offer et user       
        const { offer, user } = await offerHelper.beforeGenerateToken(offerId);
       
        //recherche de toutes offres validés par des clients
        const offers = await offerHelper.findOffers([{ id: offerId }]);

        //génération d'un token unique liant le client à l'offre        
        const refundCode = await offerHelper.checkOfferToken(offers);
        
        //ajout du token + id utilisateur en base de données
        const addRefundCode = await offerHelper.clientSubscribeToOffer(offer, user, refundCode);

        res.json({
            addRefundCode
        });
    },

    /**
     * Récupération de tous les tokens actifs
     */
    getAllTokenByOfferId: async(req, res, next)=>{
        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;

        //id de l'offre concerné
        const { userId, storeId, offerId } = req.params;

        //Vérification de la données avant la récupération des token
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);
        const offers = await offerHelper.beforeGetAllTokenByOfferId(offerId);

        //Filtrage des données 
        const tokenData = offers?.users.map(user=>{
            const userData = {};
            userData.userId = user.id;
            userData.email = user.email;
            userData.token = user.offerUser.token;
            return userData;
        });

        return res.json({           
            tokenData,
            offerId: offers.id

        });
    },

    /**
     * Validation d'un token d'une offre afin de valider le rembourssement immédiat
     */
    professionalValidateTokenByOfferId:()=>{

    },

    /**
     * activation du remboursement du client
     */
    professionalValidateRefund:async(req, res, next)=>{
        //récupérer le code promo de l'offre
        const refundCode = req.params.refundCode;

        //id du store
        const storeId = req.body.storeId;

        //roleId de la personne que effectue la requete
        const requestRoleId = req.payload.data.roleId;

        //vérification avant de valider le remboursement
        const offerHelper = new OfferHelper(null, storeId, requestRoleId);
        const { offer, client, subscription } = await offerHelper.beforeRefund(refundCode);

        console.log(subscription);
        
        //ajout du remboursement effectif
        const registerRefund = await offerHelper.registerRefund(offer, client.id, storeId);

        //suppression de la souscription de l'offre
        await offerHelper.deleteOfferSubscription(subscription);

        res.json({
            registerRefund,
            globalRefund: offer.global_refund,
            individualRefund: offer.individual_refund
        });
    }

};