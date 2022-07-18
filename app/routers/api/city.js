/**
 * router Type
 */
const express = require('express');
const router = express.Router();

//controller
const cityController = require('../../controllers/city');

//validation de la données
const schemaValidation = require('../../validations');

//middleware
const controllerHandler = require('../../helpers/controllerHandler');
const multer = require('multer')();


//récupération d'une ville par nom
router.get('/:cityName', 
    controllerHandler(cityController.getCityByName));

module.exports = router;