const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class Store extends Model{
}

Store.init({
    name: DataTypes.STRING,
    presentation: DataTypes.STRING,
    image_url: DataTypes.STRING,
    location: DataTypes.GEOGRAPHY('POINT'),
    adress: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    type_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'store'
});
module.exports = Store;