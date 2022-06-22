const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class ConditionOffer extends Model{
}

ConditionOffer.init({
    condition_id: DataTypes.INTEGER,
    offer_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'condition_has_offer'
});
module.exports = ConditionOffer;