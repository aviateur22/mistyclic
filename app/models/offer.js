const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class Offer extends Model{
}

Offer.init({
    name: DataTypes.STRING,
    presentation: DataTypes.STRING,
    global_refund: DataTypes.FLOAT,
    individual_refund: DataTypes.FLOAT,
    is_active: DataTypes.BOOLEAN,
    image_url: DataTypes.STRING,
    user_id:DataTypes.INTEGER,
    store_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'offer'
});
module.exports = Offer;