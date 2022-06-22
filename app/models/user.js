const sequelize = require('../database/client');
const {DataTypes, Model} = require('sequelize');

class User extends Model{
}

User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
},{
    sequelize,
    tableName:'user'
});
module.exports = User;