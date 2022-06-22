const City = require('./city');
const Condition = require('./condition');
const Offer = require('./offer');
const OfferUser = require('./offerUser');
const Role = require('./role');
const Store = require('./store');
const Type = require('./type');
const User = require('./user');
const Zip = require('./zip');

//Utilisateur - role
User.belongsTo(Role,{
    foreignKey: 'role_id',
    as: 'userHasRole'
});

Role.hasMany(User,{
    foreignKey: 'role_id',
    as: 'roleUsers'
});

//utilisateur - store
User.hasMany(Store,{
    as: 'userStores',
    foreignKey: 'user_id'
});

Store.belongsTo(User,{
    foreignKey: 'user_id',
    as: 'storeHasUser'    
});

//Store - type
Store.belongsTo(Type,{
    foreignKey: 'type_id',
    as: 'storeHasType'
});

Type.hasMany(Store,{
    foreignKey: 'type_id',
    as: 'typeStores'
});

//utilisateur - city
User.belongsTo(City,{
    foreignKey: 'city_id',
    as: 'userHasCity'
});

City.hasMany(User,{
    foreignKey: 'city_id',
    as: 'cityUsers'
});

//city - store
City.hasMany(Store,{
    foreignKey: 'city_id',
    as: 'cityStores'

});

Store.belongsTo(City,{
    foreignKey: 'city_id',
    as: 'storeHasCity'
});

//city - zip
City.belongsTo(Zip,{
    foreignKey: 'zip_id',
    as: 'cityHasZip'
});

Zip.hasMany(City,{
    foreignKey: 'zip_id',
    as: 'zipCities'
});

//utilisateur - offer
User.belongsToMany(Offer,{
    through: 'offer_has_user',
    as: 'usersHasOffers'
});

Offer.belongsToMany(User, {
    through: 'offer_has_user',
    as: 'offersHasUsers'
});

User.hasMany(Offer,{
    foreignKey: 'user_id',
    as: 'userOffers'

});

Offer.belongsTo(User,{
    foreignKey: 'user_id',
    as: 'offerHasUser'
});

//offer - store
Offer.belongsTo(Store,{
    foreignKey: 'store_id',
    as: 'offerHasStore'
});

Store.hasMany(Offer, {
    foreignKey: 'store_id',
    as: 'storeOffers'
});

//offer - conditions
Offer.belongsToMany(Condition,{
    through: 'condition_has_offer',
    as: 'offersHasConditions'

});

Condition.belongsToMany(Offer,{
    through: 'condition_has_offer',
    as: 'conditionsHasOffers'
});


module.exports = {
    City,
    Condition,
    Offer,
    OfferUser,
    Role,
    Store,
    Type,
    User,
    Zip
};