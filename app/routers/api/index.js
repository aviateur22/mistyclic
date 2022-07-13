const express = require('express');
const router = express.Router();

/** modules router */
const userRouter = require('./user');
const professionalRouter = require('./professional');
const offerRouter = require('./offer');
const storeRouter = require('./store');
const typeRouter = require('./type');
const anonymousRouter = require('./anonymous');
const tokenRouter = require ('./token');

/**middleware */
const controllerHandler = require('../../helpers/controllerHandler');
const userRole = require('../../helpers/userRole');
const cookie = require('../../middlewares/cookie');
const authorization = require('../../middlewares/authorization');
const userPrivilege = require('../../middlewares/userPrivilege');

//personne non authentifié
router.use('/anonymous', anonymousRouter);

//gestion des commerces
router.use('/stores', storeRouter);

//gestion des type de commerces
router.use('/types', typeRouter);

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