const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class offerUser extends Model{
}

offerUser.init({
    user_id: DataTypes.INTEGER,
    offer_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'offer_has_user'
});
module.exports = offerUser;