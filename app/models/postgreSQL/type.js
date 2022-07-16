const client = require('../../database/pg');
const CommonSQL = require('./commonSQL');
/**
 * SQL pour les types de commerces
 */
class Type extends CommonSQL {
    constructor(){
        super();
    }
}
module.exports = Type;