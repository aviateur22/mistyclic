const bcrypt = require('bcrypt');
const { User, City} = require('../models');

module.exports = {
    /**
     * connexion client
     */
    login:(req, res, next)=>{

    },

    /**
     * inscription client 
     */
    register:async(req, res, next)=>{
        //données d'inscription
        const { email, password } = req.body;

        //donnée manquante
        if(!email || !password){
            throw ({statusCode: 400, message: 'données manquantes pour créer un compte'});        
        }

        //hash du mot de passe
        const passwordHash = await bcrypt.hash(password, 10); 
        
        const createUser = await User.findCreateFind({
            where: {
                email: email
            },
            defaults: {
                email,
                password: passwordHash,
            }
        });

        //Vérification de la création 
        if(createUser[1] === false){
            throw ({statusCode: 400, message: 'cet email est déja existant'}); 
        }

        res.status(201).json({
            message: 'féliciation votre compte est créé',
            user: createUser[0].id
        });
    },


    /**
     * inscription professionnel
     */
    professionalRegister:async(req, res, next)=>{
        //données pour inscrire un commercant
        const { email, password, cityId } = req.body;

        if(!email || !password || !cityId ){
            throw ({ statusCode: 400, message: 'données manquantes pour créer un compte'});
        }

        //Vérification de la ville
        const findCity = await City.findByPk(cityId);

        if(!findCity){
            throw ({ statusCode: 400, message: 'la ville n\'existe pas'});
        }

        //hash du mot de passe
        const passwordHash = await bcrypt.hash(password, 10);

        //enregistrement 
        const registerProfessional = await User.findCreateFind({
            where: {
                email: email
            },
            defaults:{
                email,
                passwordHash,
                city_id: cityId,
            }
        });

        //vérification de la création
        if(registerProfessional[1]===false){
            throw ({ statusCode: 400, message: 'cet email est déja existant'});
        }

        res.status(201).json({
            message: 'féliciation votre compte est créé',
            user: registerProfessional[0].id
        });
    }
};