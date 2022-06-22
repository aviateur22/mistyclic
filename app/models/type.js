const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class Type extends Model{
}

Type.init({
    name: DataTypes.STRING,
},{
    sequelize,
    tableName:'type'
});
module.exports = Type;