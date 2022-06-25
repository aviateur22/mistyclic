const express = require('express');
const router = express.Router();

//controller
const professionalController = require('../../controllers/professional');

//middleware
const schemaValidation = require('../../validations');
const tokenSchemaValidation = require('../../validations/schemas/token');
const professionalSchema = require('../../validations/schemas/professional');
const controllerHandler = require('../../helpers/controllerHandler');


module.exports = router;