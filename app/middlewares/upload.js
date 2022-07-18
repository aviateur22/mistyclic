/** multer */
const multer = require('multer');

//géneration uuid
const { v4: uuidv4 } = require('uuid');

/**
 * gestion des uploads d'image
 */
module.exports = {
    /**
     * vérification des images a uploader
     */
    uploadImage: multer.diskStorage(  {     
        /** verification du format du document et parametrage de uploads path */
        destination: async function(req, file, cb) {   
            console.log(file.size);               
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.size > 5000){    
                //dossier de téléchargement des images
                cb(null, process.env.UPLOAD_FILE);                    
            } else {
                /** le format de l'image n'est pas correcte */
                cb({message: 'seules les images au format JPEG et PNG sont acceptées', statusCode:'400'});
            }        
        },
        /** si le format est validé on génére un identifiant unique est on la stock */
        filename: function(req, file, cb) {             
            /** genration d'un uuid pour l'image */
            const uniqueSuffix = uuidv4() + '-'+ new Date().getTime();            
            cb(null,  uniqueSuffix +'.jpeg');                       
        }
    })
};