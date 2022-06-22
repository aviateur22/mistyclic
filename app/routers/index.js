const express = require('express');
const router = express.Router();

//traitement des erreurs
const error = require('../controllers/error');
//traitement des paths inconnus
const notFound = require('../controllers/notFound');
const apiRouter = require('./api');

//api
router.use('/api', apiRouter);

//404
router.use(notFound);

//error
router.use(error);






module.exports = router;