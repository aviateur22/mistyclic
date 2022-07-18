const express = require('express');
const router = express.Router();

//durée de vie des jwt
const jwtExpireIn = require('../../helpers/jwtExpireIn');

//controller
const tokenController = require('../../controllers/token');

//wrapper de controller
const controllerHandler = require('../../helpers/controllerHandler');

//token pour faire les test unitaires
router.get('/test', controllerHandler(tokenController.getToken(jwtExpireIn.testTime)));

//token
router.get('/', controllerHandler(tokenController.getToken(jwtExpireIn.professionalLoginTime)));
module.exports = router;
