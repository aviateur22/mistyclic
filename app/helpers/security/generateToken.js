/**
 * generation de token aléatoire
 * @param {Number} tokenLength - longueur du token
 * @returns {string} token
 */
module.exports = async(tokenLength) =>{
    try {
        /**tableau de char */
        const charArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        let token= null;
        /**recuperation aléatoire */
        await (async()=>{
            for(let i = 1; i <= tokenLength; i++) { 
                let randomNumber = Math.floor(Math.random() * (charArray.length));
                if(token){
                    token = token + charArray[randomNumber];
                } else {
                    token = charArray[randomNumber];
                }
            }
        })();
        return token;
    } catch (error) {
        console.log(error);        
    }    
};