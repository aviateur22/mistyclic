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
router.get('/cookie-auth-pro', controllerHandler(authController(3)));

//génération cookie avec le role d'un utilisateur
router.get('/cookie-auth-user', controllerHandler(authController(1)));

//génération cookie avec le role admin
router.get('/cookie-auth-admin', controllerHandler(authController(4)));

router.get('/cookie-csurf', controllerHandler(tokenController.getToken(jwtExpireIn.testTime)));

module.exports = router;
