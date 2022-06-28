require('dotenv').config();
const request = require('supertest');

//application
const app = require('../app');

//Cookies + token-csurf
let cookieAuth;
let cookieAuthUser;
let cookieCsurf;
let csurfToken;

describe('récupération des cookie et token',()=>{
    it('les cookie et token doivent être récupéré', async()=>{
        //roleId de 1 ne permettant pas la création d'offre        
        const auth  = await request(app)
            .get('/test/cookie-auth');   
        
        const auth_user = await request(app)
            .get('/test/cookie-auth-user');

        //génération Token csurf   
        const token  = await request(app)
            .get('/test/cookie-csurf');
        
        cookieAuth = (auth['header']['set-cookie'][0].split(';'))[0];
        cookieAuthUser = (auth_user['header']['set-cookie'][0].split(';'))[0];
        cookieCsurf = (token['header']['set-cookie'][0].split(';'))[0];
        csurfToken = token['_body']['token'];     
        
        //vérification cookie + token
        expect(cookieAuth).toContain('authorization');
        expect(cookieCsurf).toContain('token_data');
        expect(csurfToken).toContain('eyJjb250ZW50Ijoi');
    });   
});

//création d'un offre
describe('Création d\'une offre',()=>{
    it('success', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .post('/api/offers')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                globalRefund: '499',
                individualRefund: '0.50',
                imageName: 'fleur.jpg',
                userId: '2',
                storeId: '3',
                cityId: '1',
                conditions: ['1']
            })
            .set('Cookie',[cookieAuth, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('votre offre est créée');
        expect(res.statusCode).toEqual(201); 
    });

    it('echec - role-id = 1 -> user', async()=>{
        //crétion d'une offre
        const res = await request(app)
            .post('/api/offers')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                globalRefund: '499',
                individualRefund: '0.50',
                imageName: 'fleur.jpg',
                userId: '2',
                storeId: '3',
                conditions: ['1']
            })
            .set('Cookie',[cookieAuthUser, cookieCsurf]);
        expect(res.body).toHaveProperty('errorMessage');
        expect(res.statusCode).toEqual(403); 
    });

    it('echec - user id = 1 ', async()=>{

    });
});

//modification d'une offre
describe('Modification d\'une offre',()=>{
    it('success', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .patch('/api/offers/2')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                imageName: 'fleurkmdmmsqmqsùm^q.jpg',
                userId: '1',
                storeId: '2',
                conditions: ['1', '2']
            })
            .set('Cookie',[cookieAuth, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.statusCode).toEqual(200); 
    });
});

//récupération d'une offre
describe('Récupération d\'une offre par son Id',()=>{
    it('success', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .get('/api/offers/3');            
        expect(res.body).toHaveProperty('offer');
        expect(res.statusCode).toEqual(200); 
    });
});

//récupération de toutes les offres
describe('récupération de toutes les offres',()=>{
    it('sucess', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .get('/api/offers');            
        expect(res.body).toHaveProperty('offers');
        expect(res.statusCode).toEqual(200); 
    });
});

//récupération des offre par store
describe('récupération des offres par store',()=>{
    it('success', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .get('/api/offers/by-store/1');            
        expect(res.body).toHaveProperty('offers');
        expect(res.statusCode).toEqual(200); 
    });
});

//récupération des offre par ville
describe('récupération des offres par ville',()=>{
    it('success', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .get('/api/offers/by-city/1');            
        expect(res.body).toHaveProperty('offers');
        expect(res.statusCode).toEqual(200); 
    });
});