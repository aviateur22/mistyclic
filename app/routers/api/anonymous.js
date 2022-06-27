const express = require('express');
const router = express.Router();

//controller
const anonymousController = require('../../controllers/anonymous');

//middleware
const controllerHandler = require('../../helpers/controllerHandler');

//se connecter
router.post('/login', controllerHandler(anonymousController.login));

//inscription client
router.post('/register', controllerHandler(anonymousController.register));

//inscription professionel
router.post('/register-professional', controllerHandler(anonymousController.professionalRegister));


module.exports = router;