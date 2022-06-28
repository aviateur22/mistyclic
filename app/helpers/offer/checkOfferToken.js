/**
 * vérification si token généré est unique
 * @param {Array} offers - liste des offres
 * @param {Text} token - token a vérifier
 */
module.exports = (offers, token)=>{
    offers.forEach(offer=>{            
        const storeToken = offer.token;
        //le token est déka référencé
        if(token === storeToken){
            console.log('token déja existant');
            return true;
        }
    });
    console.log('token unique');
    return false;
};