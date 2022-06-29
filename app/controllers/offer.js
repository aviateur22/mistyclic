const { Offer, User, Store, Condition, OfferUser, ConditionOffer } = require('../models');
const OfferHelper = require('../helpers/controllerHelper/offer/offer');
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
        
        //instancie offerHelper et vérification de la données avant la créatrion de l'offre
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);
        const beforeCreateOffer = await offerHelper.beforeCreateOffer(conditions);    
        
        //echec vérification
        if(!beforeCreateOffer){
            throw ({ statusCode: 403, message: 'vous ne pouvez pas executer cette action' });
        }

        //création de l'offre
        const offer = await Offer.create({
            name,
            presentation,
            global_refund: globalRefund,
            individual_refund: individualRefund,
            image_url: imageName,
            store_id: storeId,
            user_id: userId,
            city_id: cityId           

        });    
        
        if(!offer){
            throw ({ statusCode: 500, message: 'echec d\'enregistrement de votre offre' });
        }

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

        //instancie et vérification des données avant de faire un update    
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);
        let offer = await offerHelper.beforeUpdateOffer(offerId, conditions);

        //données a modifier
        const data = { ...offer, ...{name, presentation, image_url: imageName }};

        //mise a jour des données
        await offer.update({
            ...data
        });  
        
        //Suppression des anciennes conditions de l'offre
        await offerHelper.deleteCondition(offerId);

        //ajout des nouvelles conditions
        await offerHelper.addCondition(offer, conditions);


        //récupération de l'offre à jour
        offer = await Offer.findByPk(offerId);

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
        const offer = await Offer.findByPk(offerId);

        //vérification existance de l'offre
        if(!offer){
            throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas'});
        }

        res.json({
            offer
        });
    },

    /**
     * Récupération de toutes les offres
     */
    getOffers:async(req, res, next)=>{
        //récupération des offres
        const offers = await Offer.findAll();

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

        //récupération de toutes les offres de la ville
        const offers = await Offer.findAll({
            where:{
                city_id: cityId
            }
        });

        res.json({
            offers
        });
    },

    /**
     * récupération des offres d'un commerce
     */
    getOffersByStore:async(req, res, next)=>{
        //id du commerce
        const storeId = req.params.storeId;

        //récupération de toutes les offres de la ville
        const offers = await Offer.findAll({
            where:{
                store_id: storeId
            }
        });

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
        
        //instancie offerHelper et vérifie les données sur l'offre
        const offerHelper = new OfferHelper(userId, storeId, requestRoleId);
        const offer = await offerHelper.beforeDestroyOffer(offerId);
        
        //destruction de l'offre
        await offer.destroy();

        res.json({
            message: 'votre offre est supprimée'
        });
    },

    /**
     * génération d'un token pour une offre par un client
     */
    clientGenerateTokenByOfferId:async(req, res, next)=>{
        //id utilisateur générant le token 
        const userId = req.params.userId;

        //id de l'offre recevant le token
        const offerId = req.params.offerId;

        //l'offre
        const offer = await Offer.findByPk(offerId);

        if(!offer){
            throw ({statusCode: 404, message: 'l\'offre recherchée n\'existe pas'});
        }

        //recherche du client
        const user = await User.findByPk(userId);

        if(!user){
            throw ({ statusCode: 404, message: 'l\'utilisateur concerné n\'existe pas'});
        }       

        //recherche des offres validé par des clients
        const offers = await OfferUser.findAll({
            where:{
                offer_id: offerId                
            }
        });

        //génération d'un token unique liant le client à l'offre        
        const token = await OfferHelper.checkOfferToken(['7pgqd', 'xuqz8', 'tam28', 'trcc0','l8fds','e20h7','h26jh']);
        
        //ajout du token + id utilisateur en base de données
        const addToken = await offer.addUsers(user, {
            through:{
                token
            }
        });

        res.json({
            addToken
        });
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