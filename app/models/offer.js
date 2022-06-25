const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class Offer extends Model{
}

Offer.init({
    description: DataTypes.STRING,
    global_refund: DataTypes.INTEGER,
    individual_refund: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    image_url: DataTypes.STRING,
    user_id:DataTypes.INTEGER,
    store_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'offer'
});
module.exports = Offer;