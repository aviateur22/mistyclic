/**
 * validation de la données pour les offres
 */
const createOfferSchema = require('./createOffer');
const generateTokenSchema = require('../offer/generateToken');
const deleteOfferSchema = require('./deleteOffer');
const updateOfferSchema = require('./updateOffer');
const offerIdSchema = require('./offerId');
const validateOfferTokenSchema = require('./validateOfferToken');
 
module.exports = {
    createOfferSchema,
    generateTokenSchema,
    deleteOfferSchema,
    updateOfferSchema,
    offerIdSchema,
    validateOfferTokenSchema
};