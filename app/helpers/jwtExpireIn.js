/**
 * gestion de la durée de vie des JWT
 */
 module.exports = {
    //test - 150j
    testTime: '350d',

    //validation d'une offre - 15 min
    offerSubscriptionTime: '900s',

    //connexion compte professionel
    professionalLoginTime: '5h',

    //connexion compte particulier
    userLoginTime: '24h',
};
