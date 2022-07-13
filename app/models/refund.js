const sequelize = require('../database/client');
const {DataTypes, Model, Sequelize} = require('sequelize');

class Refund extends Model{
}

Refund.init({    
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    store_id: DataTypes.INTEGER
},{
    sequelize,
    tableName:'refund'
});
module.exports = Refund;