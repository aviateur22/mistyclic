const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class Condition extends Model{
}

Condition.init({
    text: DataTypes.STRING,
    offer_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'condition'
});
module.exports = Condition;