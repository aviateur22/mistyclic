const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class User extends Model{
}

User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    active_account: DataTypes.BOOLEAN,
    actice_professional: DataTypes.BOOLEAN
},{
    sequelize,
    tableName:'user'
});
module.exports = User;