const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class Zip extends Model{
}

Zip.init({
    code: DataTypes.STRING,
    zip_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'zip'
});
module.exports = Zip;