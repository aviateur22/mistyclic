const express = require('express');
const router = express.Router();

/** modules router */
const userRouter = require('./user');
const professionalRouter = require('./professional');

//professionel
router.use('/professional', professionalRouter);

//utilisateur
router.use('/user', userRouter);

module.exports = router;