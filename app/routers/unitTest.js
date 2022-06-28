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
const authController = require('../../tests/cookieAuth/generateCookieAuth');
const controllerHandler = require('../helpers/controllerHandler');

//génération d'un cookie auth avec le role professionnel
router.get('/cookie-auth', controllerHandler(authController(2)));

//génération cookie pour un utilisateur
router.get('/cookie-auth-user', controllerHandler(authController(1)));

router.get('/cookie-csurf', controllerHandler(tokenController.getToken(jwtExpireIn.testTime)));

module.exports = router;
