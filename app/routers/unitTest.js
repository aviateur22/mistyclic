/**
 * Router pour faire des Test Unit
 * Edition des authorization cookie pour faire des tests unitaires 
 * @param {Number} roleId - role de l'utilisateur
 * @returns {Object} generateJwt - JWT
 */
const express = require('express');
const router = express.Router();

const jwtExpireIn = require('../helpers/jwtExpireIn');
const tokenController = require('../controllers/token');
const authController = require('../../tests/generateCookieAuth');
const controllerHandler = require('../helpers/controllerHandler');

//création d'une offre
router.get('/cookie-auth', controllerHandler(authController(2)));

router.get('/cookie-csurf', controllerHandler(tokenController.getToken(jwtExpireIn.testTime)));

module.exports = router;
