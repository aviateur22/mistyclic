/**
 * Controller de l'application
 */
const errorController = require('./error');
const notfoundController = require('./notFound');
const tokenController = require('./token');
const offerController = require('./offer');
const storeController = require('./store');
//test unitaire
const testController = require('../../tests/generateJWT');

module.exports = {
    errorController,
    notfoundController,
    tokenController,
    storeController,
    offerController
};