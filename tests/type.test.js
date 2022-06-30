require('dotenv').config();
const request = require('supertest');

//application
const app = require('../app');

//Cookies + token-csurf
let cookieAuth;
let cookieCsurf;
let csurfToken;

describe('récupération des cookie et token',()=>{
    it('les cookie et token doivent être récupéré', async()=>{
        //roleId de 1 ne permettant pas la création d'offre        
        const auth  = await request(app)
            .get('/test/cookie-auth');   

        //génération Token csurf   
        const token  = await request(app)
            .get('/test/cookie-csurf');
        
           
        cookieAuth = (auth['header']['set-cookie'][0].split(';'))[0];
        cookieCsurf = (token['header']['set-cookie'][0].split(';'))[0];
        csurfToken = token['_body']['token'];   

        //vérification cookie + token
        expect(cookieAuth).toContain('authorization');
        expect(cookieCsurf).toContain('token_data');
        expect(csurfToken).toContain('eyJjb250ZW50Ijoi');
    });   
});

//gestion type de magasin
describe('gestion type de magasin',()=>{
    it('réussite', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .post('/api/types')
            .send({
                token: csurfToken,
                name: 'boucherie',
            })
            .set('Cookie',[cookieAuth, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.statusCode).toEqual(200); 
    });
});