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

//récupération de toutes les lecons
router.get('/', controllerHandler(offerController.getOffers));

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

// génération token 5 lettres par un client
router.get('/generate-token/:offerId/token/:token/user/:userId',
    multer.none(),    
    validation(offerSchema.generateTokenSchema, 'params'),
    controllerHandler(cookie),
    controllerHandler(authorization),
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.user)),    
    controllerHandler(offerController.clientGenerateTokenByOfferId));

//Récupérations de tous les token pour une offres
router.get('/tokens/:offerId',
    multer.none(),    
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    validation(offerSchema.offerIdSchema, 'params'),
    controllerHandler(offerController.getAllTokenByOfferId),
);

// vérification d'un token par un professionnel
router.get('/validate-token/:offerId',
    multer.none(),        
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    validation(offerSchema.offerIdSchema, 'params'),    
    validation(offerSchema.validateOfferTokenSchema, 'query'),
    controllerHandler(offerController.deleteOfferById));
module.exports = router;