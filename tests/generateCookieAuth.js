//genration de JWT
const JWT = require('../app/helpers/security/jwt');
//dur"
const jwtExpireIn = require('../app/helpers/jwtExpireIn');
const cookieOption = require('../app/helpers/cookieOption');

/**
 * Test Unit
 * Edition des authorization cookie pour faire des tests unitaires 
 * @param {Number} roleId - role de l'utilisateur
 * @returns {Object} generateJwt - JWT
 */
module.exports= (roleId) => async(req, res, next)=>{
    //instancie le JWT
    const jwt = new JWT({expiresIn: jwtExpireIn.testTime, subject: 'authorization'});

    //génération
    const generateJwt = await jwt.generateJwt({
        roleId       
    });

    /**option des cookie */
    const option =  cookieOption.cookieOption;
    res.cookie('authorization', generateJwt, {secure: option.secure, sameSite:option.sameSite, httpOnly: option.httpOnly });

    res.status(200).json({
        message: 'ok'
    });
};