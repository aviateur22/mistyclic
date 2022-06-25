const express = require('express');
const router = express.Router();

/** modules router */
const userRouter = require('./user');
const professionalRouter = require('./professional');
const offerRouter = require('./offer');
const storeRouter = require('./store');
const unAuthenticateRouter = require('./unAuthenticated');
const tokenRouter = require ('./token');

/**middleware */
const controllerHandler = require('../../helpers/controllerHandler');
const userRole = require('../../helpers/userRole');
const cookie = require('../../middlewares/cookie');
const authorization = require('../../middlewares/authorization');
const userPrivilege = require('../../middlewares/userPrivilege');


//personne non authentifié
router.use('/unauthenticate', unAuthenticateRouter);

//gestion des commerces
router.use('/stores', storeRouter);

//gestion offre
router.use('/offers', offerRouter);

//Token
router.use('/token', tokenRouter);

//professionel
router.use('/professionals', 
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(userPrivilege(userRole.professional)),
    professionalRouter);

//utilisateur
router.use('/users', 
    controllerHandler(cookie),
    controllerHandler(authorization),    
    controllerHandler(userPrivilege(userRole.user)),
    userRouter);

module.exports = router;