const express = require('express');
const router = express.Router();

//durée de vie des jwt
const jwtExpireIn = require('../../helpers/jwtExpireIn');

//controller
const tokenController = require('../../controllers/token');

//wrapper de controller
const controllerHandler = require('../../helpers/controllerHandler');

//création d'une offre
router.get('/test', controllerHandler(tokenController.getToken(jwtExpireIn.testTime)));

module.exports = router;
