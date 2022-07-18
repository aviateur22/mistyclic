/**
 * router store
 */

const express = require('express');
const router = express.Router();

//controller
const storeController = require('../../controllers/store');

//validation de la données
const schemaValidation = require('../../validations');
const storeSchemaValidation = require('../../validations/schemas/store');

//middleware
const controllerHandler = require('../../helpers/controllerHandler');
const userRole = require('../../helpers/userRole');
const cookie = require('../../middlewares/cookie');
const authorization = require('../../middlewares/authorization');
const userPrivilege = require('../../middlewares/userPrivilege');
const validateCsurfToken = require('../../middlewares/checkCsurfToken');

//gestion des images et des formDatas
const multer = require('multer');
const upload = require('../../middlewares/upload');
const uploadImage = multer({ storage: upload.uploadImage });


//création d'un store
router.post('/',  
    uploadImage.single('image'),
    //vérification de l'image
    schemaValidation(storeSchemaValidation.storeImageSchema, 'file'),
    controllerHandler(cookie),
    //controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    //controllerHandler(userPrivilege(userRole.professional)),
    schemaValidation(storeSchemaValidation.storeSchema, 'body'),
    controllerHandler(storeController.createStore));

//update d'un store
router.patch('/:storeId',
    multer().none(),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    schemaValidation(storeSchemaValidation.storeSchema, 'body'),
    schemaValidation(storeSchemaValidation.storeIdSchema, 'params'),
    controllerHandler(storeController.updateStoreById));

//update d'un store
router.get('/:storeId',
    schemaValidation(storeSchemaValidation.storeIdSchema, 'params'),
    controllerHandler(storeController.getStoreById));


module.exports = router;