/**Configurations des CORS */
module.exports= ()=>{
    let corsOption = {        
        credentials: true,
        methods: 'GET,PUT,PATCH,POST,DELETE',
        origin: process.env.CORS_ORIGIN.split(',')
    };
    return corsOption;
};