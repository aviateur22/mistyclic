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

//application
describe('Création d\'une offre',()=>{
    it('l\'offre doit être en echec', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .post('/api/offers')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                globalRefund: '499',
                individualRefund: '0.50',
                imageName: 'fleurkmdmmsqmqsùm^q.jpg',
                userId: '1',
                storeId: '2',
                conditions: ['1']
            })
            .set('Cookie',[cookieAuth, cookieCsurf]);
        expect(res.body).toHaveProperty('errorMessage');
        expect(res.statusCode).toEqual(500); 
    });

    it('génération d\'un jwt', async()=>{
    });
});