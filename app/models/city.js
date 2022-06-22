const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class City extends Model{
}

City.init({
    name: DataTypes.STRING,
    zip_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'city'
});
module.exports = City;