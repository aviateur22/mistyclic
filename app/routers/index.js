const express = require('express');
const router = express.Router();

//traitement des erreurs
const error = require('../controllers/error');
const notFound = require('../controllers/notFound');
const apiRouter = require('./api');
const unitTestRouter = require('./unitTest');

//api
router.use('/api', apiRouter);

//unit test
router.use('/test', unitTestRouter);

//404
router.use(notFound);

//error
router.use(error);






module.exports = router;