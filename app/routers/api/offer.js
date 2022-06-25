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
    //validation(csurfTokenSchema.csurfTokenSchema, 'body'),    
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    validation(offerSchema.createOfferSchema, 'body'),
    controllerHandler(offerController.createOffer));

//update d'une offre
router.patch('/:offerId', 
    multer.none(),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    validation(offerSchema.offerIdSchema, 'params'),
    validation(offerSchema.updateOfferSchema),
    controllerHandler(offerController.updateOffer));

//delete d'une offre
router.delete('/:offerId',
    multer.none(),    
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    validation(offerSchema.offerIdSchema, 'params'),    
    validation(offerSchema.deleteOfferSchema, 'body'),
    controllerHandler(offerController.deleteOffer));

// génération token 5 lettres par un client
router.get('/generate-token/:offerId',
    multer.none(),    
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.user)),
    validation(offerSchema.offerIdSchema, 'params'),    
    validation(offerSchema.generateTokenSchema, 'query'),
    controllerHandler(offerController.clientGenerateToken));

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
    controllerHandler(offerController.deleteOffer));
module.exports = router;