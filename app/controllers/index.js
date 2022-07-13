/**
 * Controller de l'application
 */
const errorController = require('./error');
const notfoundController = require('./notFound');
const tokenController = require('./token');
const offerController = require('./offer');
const storeController = require('./store');
const typeController = require('./type');

module.exports = {
    errorController,
    notfoundController,
    tokenController,
    storeController,
    offerController,
    typeController
};