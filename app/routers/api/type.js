/**
 * router Type
 */
const express = require('express');
const router = express.Router();

//controller
const typeController = require('../../controllers/type');

//validation de la données
const schemaValidation = require('../../validations');
const typeSchemaValidation = require('../../validations/schemas/type');

//middleware
const controllerHandler = require('../../helpers/controllerHandler');
const userRole = require('../../helpers/userRole');
const cookie = require('../../middlewares/cookie');
const authorization = require('../../middlewares/authorization');
const userPrivilege = require('../../middlewares/userPrivilege');
const validateCsurfToken = require('../../middlewares/checkCsurfToken');
const multer = require('multer')();


//création d'un type de store
router.post('/', 
    multer.none(),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    schemaValidation(typeSchemaValidation.typeSchema, 'body'),
    controllerHandler(typeController.createType));

//update d'un type de store
router.patch('/:typeId',
    multer.none(),
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(validateCsurfToken),
    controllerHandler(userPrivilege(userRole.professional)),
    schemaValidation(typeSchemaValidation.typeIdSchema, 'params'),
    schemaValidation(typeSchemaValidation.typeSchema, 'body'),
    controllerHandler(typeController.updateType));

module.exports = router;