const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class Refund extends Model{
}

Refund.init({
    user_id: DataTypes.INTEGER,
    offer_id: DataTypes.INTEGER,
    store_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'refund'
});
module.exports = Refund;