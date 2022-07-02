const express = require('express');
const router = express.Router();
const multer = require('multer')();

//controller
const offerController = require('../../controllers/offer');

//middleware
const userRole = require('../../helpers/userRole');
const cookie = require('../../middlewares/cookie');
const authorization = require('../../middlewares/authorization');
const userPrivilege = require('../../middlewares/userPrivilege');
const validateCsurfToken = require('../../middlewares/checkCsurfToken');

//Validation de la données
const validation = require('../../validations');
const offerSchema = require('../../validations/schemas/offer');

//wrapper de controller
const controllerHandler = require('../../helpers/controllerHandler');

//#region Professionnel

//création d'une offre
router.post('/',
    multer.none(),
    validation(offerSchema.createOfferSchema, 'body'),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),    
    controllerHandler(offerController.createOffer));

//update d'une offre
router.patch('/:offerId', 
    multer.none(),
    validation(offerSchema.offerIdSchema, 'params'),
    validation(offerSchema.updateOfferSchema,'body'),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),    
    controllerHandler(userPrivilege(userRole.professional)),   
    controllerHandler(offerController.updateOfferById));

//récupére toutes les offres d'un professionnel
router.get('/token/:token/professional/:userId',    
    validation(offerSchema.userOffersSchema, 'params'),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),  
    controllerHandler(offerController.getOffersByUserId(true))
);

//récuperation de toutes les offres pour un commerce par un professionnelle ou collaborateur
router.get('/token/:token/professional/:userId/store/:storeId',    
    validation(offerSchema.professionalStoreOffer, 'params'),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)), 
    controllerHandler(offerController.getOffersByStore(true))
);

//Récupérations de tous les tokens pour une offres
router.get('/get-tokens-by-offer/token/:token/professional/:userId/store/:storeId/offer/:offerId',
    multer.none(),    
    validation(offerSchema.getOfferTokenSchema, 'params'),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),    
    controllerHandler(offerController.getAllTokenByOfferId),
);

// vérification d'un token par un professionnel
router.post('/refund/:refundCode',
    multer.none(),        
    validation(offerSchema.refundOfferSchema, 'body'),
    validation(offerSchema.refundCodeSchema, 'params'),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.collaborator)),
    controllerHandler(offerController.professionalValidateRefund));

//delete d'une offre
router.delete('/:offerId',
    multer.none(),   
    validation(offerSchema.deleteOfferSchema, 'body'),    
    validation(offerSchema.offerIdSchema, 'params'),  
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),    
    controllerHandler(offerController.deleteOfferById));

//#endregion

//récupération de toutes les offres actives
router.get('/', controllerHandler(offerController.getOffers));

//récupération d'une offre par son id
router.get('/:offerId', 
    validation(offerSchema.offerIdSchema, 'params'),
    controllerHandler(offerController.getOfferById));

//récuperation des offres par ville
router.get('/by-city/:cityId', 
    validation(offerSchema.cityIdSchema, 'params'),
    controllerHandler(offerController.getOffersByCity));

//récupération des offres par store
router.get('/by-store/:storeId', 
    validation(offerSchema.storeIdSchema, 'params'),
    controllerHandler(offerController.getOffersByStore));

// génération token 5 lettres par un client
router.get('/generate-token-by-offer/token/:token/user/:userId/store/:storeId/offer/:offerId',
    multer.none(),    
    validation(offerSchema.generateTokenSchema, 'params'),
    controllerHandler(cookie),
    controllerHandler(authorization),
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.user)),    
    controllerHandler(offerController.clientSubscribeByOfferId));


module.exports = router;