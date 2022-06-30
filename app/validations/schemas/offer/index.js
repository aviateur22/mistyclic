/**
 * validation de la données pour les offres
 */
const createOfferSchema = require('./createOffer');
const generateTokenSchema = require('../offer/generateToken');
const deleteOfferSchema = require('./deleteOffer');
const updateOfferSchema = require('./updateOffer');
const offerIdSchema = require('./offerId');
const validateOfferTokenSchema = require('./validateOfferToken');
const storeIdSchema = require('./storeId');
const cityIdSchema = require('./cityId');
const getOfferTokenSchema = require('./getOfferTokens');
 
module.exports = {
    createOfferSchema,
    generateTokenSchema,
    deleteOfferSchema,
    updateOfferSchema,
    offerIdSchema,
    validateOfferTokenSchema,
    cityIdSchema,
    storeIdSchema,
    getOfferTokenSchema
};