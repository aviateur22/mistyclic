const { Offer, User, Store, Condition, OfferUser, ConditionOffer } = require('../models');
const belongTo = require('../helpers/belongTo');
const offerHelper = require('../helpers/offer');
const randomToken = require('../helpers/security/generateToken');
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

        //récupération du store
        const store = await Store.findByPk(storeId);

        //pas de résulat
        if(!store){
            throw ({ statusCode: 404, message: 'le commerce recherché n\'existe pas' });
        }

        //Vérification si l'action est autorisé
        if(!belongTo(userId, store.user_id, requestRoleId)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas autorisé à faire cette action' });
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

        //Ajout de la liste des conditions
        await (async()=>{
            /** stocks les promesses */
            const promises = [];
            conditions.forEach(async(condition)=>{   
                //verification condition
                const query =  ConditionOffer.create({
                    condition_id: condition,
                    offer_id: offer.id
                });

                promises.push(query);
            });
            /** résolution des promesses */
            await Promise.all(promises);
        })();

        res.status(201).json({
            offer,
            message: 'votre offre est créée'
        });
    },

    /**
     * update d'une offre
     */
    updateOfferById: async(req, res, next)=>{
        //id de l'offre
        const offerId = req.params.offerId;        

        //données à modifier
        const { name, userId, presentation, imageName } = req.body;

        //recherche de l'offre
        const offer = await Offer.findByPk(offerId);

        if(!offer){
            throw ({ statusCode: 404, message: 'l\'offre recherchée n\'existe pas' });
        }

        //Vérification si l'action est autorisé
        if(!belongTo(userId, offer.user_id, req.payload.data.roleId)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas autorisé à faire cette action' });
        }

        //données a modifier
        const data = { ...offer, ...{name, presentation, image_url: imageName }};

        //mise a jour des données
        await offer.update({
            ...data
        });

        res.json({
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
        
        //id du professionnel
        const userId = req.body;
        
        //recherche de l'offre
        const offer = await Offer.findByPk(offerId);

        //vérification existance de l'offre
        if(!offer){
            throw ({ statusCode: 404, message: 'cette offre n\'existe pas en base de données' });
        }

        //Vérification si l'action est autorisé
        if(!belongTo(userId, offer.user_id, req.payload.data.roleId)){
            throw ({ statusCode: 403, message: 'vous n\'êtes pas autorisé à faire cette action' });
        }

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
        const userId = req.body.userId;

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
        let token = await randomToken(5);        
        
        //Vérification token unique pour l'offre concernée
        if(offerHelper.checkOfferToken(offers, token)){
            token = await randomToken(5);
        }

        res.json({
            token
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