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
const multer = require('multer')();


//création d'un store
router.post('/', 
    multer.none(),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    schemaValidation(storeSchemaValidation.storeSchema, 'body'),
    controllerHandler(storeController.createStore));

//update d'un store
router.patch('/update-store',
    schemaValidation(storeSchemaValidation.deleteSchema),
    controllerHandler(storeController.updateStore));

module.exports = router;