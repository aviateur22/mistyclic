const express = require('express');
const router = express.Router();

//controller
const unAuthenticateController = require('../../controllers/unAuthenticate');

//se connecter
router.post('login', unAuthenticateController.login);

//s'inscrire
router.post('register', unAuthenticateController.register);




module.exports = router;