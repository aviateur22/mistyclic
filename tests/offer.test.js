require('dotenv').config();
const request = require('supertest');

//application
const app = require('../app');

//Cookies + token-csurf
let cookieAuthPro;
let cookieAuthUser;
let cookieAuthAdmin;
let cookieCsurf;
let csurfToken;

describe('récupération des cookie et token',()=>{
    it('les cookie et token doivent être récupéré', async()=>{
        //roleId = 2 - professionel 
        const auth  = await request(app)
            .get('/test/cookie-auth-pro');   
        
        //role id = 1 - utilisateur
        const auth_user = await request(app)
            .get('/test/cookie-auth-user');

        //role id = 3 - administrateur 
        const auth_admin = await request(app)
            .get('/test/cookie-auth-admin');

        //génération Token csurf   
        const token  = await request(app)
            .get('/test/cookie-csurf');
        
        cookieAuthPro = (auth['header']['set-cookie'][0].split(';'))[0];
        cookieAuthUser = (auth_user['header']['set-cookie'][0].split(';'))[0];
        cookieAuthAdmin = (auth_admin['header']['set-cookie'][0].split(';'))[0];
        cookieCsurf = (token['header']['set-cookie'][0].split(';'))[0];
        csurfToken = token['_body']['token'];            
       
        //vérification cookie + token
        expect(cookieAuthPro).toContain('authorization');
        expect(cookieAuthUser).toContain('authorization');
        expect(cookieAuthAdmin).toContain('authorization');
        expect(cookieCsurf).toContain('token_data');
        expect(csurfToken).toContain('eyJjb250ZW50Ijoi');
    });   
});

//création d'un offre
describe('Création d\'une offre',()=>{
    //utilisateur n'a pas les droits
    it('utilisateur - echec', async()=>{
        const res = await request(app)
            .post('/api/offers')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                globalRefund: '499',
                individualRefund: '0.50',
                imageName: 'fleur.jpg',
                userId: '3',
                storeId: '1',
                cityId: '1',
                conditions: ['1']
            })
            .set('Cookie',[cookieAuthUser, cookieCsurf]);
        expect(res.body).toHaveProperty('errorMessage');
        expect(res.body.errorMessage).toEqual('vous n\'avez pas les droits pour éffectuer l\'action demandée');
        expect(res.statusCode).toEqual(403);
    });

    //le professional à les droits
    it('Pro - success', async()=>{        
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
                userId: '1',
                storeId: '1',
                cityId: '1',
                conditions: ['1']
            })
            .set('Cookie',[cookieAuthPro, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('votre offre est créée');
        expect(res.statusCode).toEqual(201); 
    });

    //Admin à les droits
    it('Admin - success', async()=>{
        const res = await request(app)
            .post('/api/offers')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                globalRefund: '499',
                individualRefund: '0.50',
                imageName: 'fleur.jpg',
                userId: '1',
                storeId: '1',
                cityId: '1',
                conditions: ['1']
            })
            .set('Cookie', [cookieAuthAdmin, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('votre offre est créée');
        expect(res.statusCode).toEqual(201);
    });

    //Admin à les droits
    it('Admin - echec - Le bénificiaire n\'est pas un pro', async()=>{
        const res = await request(app)
            .post('/api/offers')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                globalRefund: '499',
                individualRefund: '0.50',
                imageName: 'fleur.jpg',
                userId: '1',
                storeId: '1',
                cityId: '1',
                conditions: ['1']
            })
            .set('Cookie', [cookieAuthAdmin, cookieCsurf]);
        expect(res.body).toHaveProperty('errorMessage');
        expect(res.body.errorMessage).toEqual('vous ne pouvez pas executer cette action');
        expect(res.statusCode).toEqual(403);
    });
});

//modification d'une offre
describe('Modification d\'une offre',()=>{
    //modification Pro 
    it('Pro - success ', async()=>{
        const res = await request(app)
            .patch('/api/offers/1')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                imageName: 'fleurkmdmmsqmqsùm^q.jpg',
                userId: '1',
                storeId: '1',
                conditions: ['1', '2']
            })
            .set('Cookie',[cookieAuthPro, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.statusCode).toEqual(200); 
    });

    it('Pro - offre non existante - echec ', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .patch('/api/offers/-1')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                imageName: 'fleurkmdmmsqmqsùm^q.jpg',
                userId: '1',
                storeId: '1',
                conditions: ['1', '2']
            })
            .set('Cookie',[cookieAuthPro, cookieCsurf]);
        expect(res.body).toHaveProperty('errorMessage');
        expect(res.body.errorMessage).toBe('l\'offre recherchée n\'existe pas');
        expect(res.statusCode).toEqual(404); 
    });

    it('Pro - l\'offre ne lui appartient pas - echec ', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .patch('/api/offers/1')
            .send({
                token: csurfToken,
                name: 'mes fleurs à vendres pour pas chers',
                presentation: 'pour l\'achat de 2 roses, vous bénificié d\'un remboursement immédiat de 0.50€',
                imageName: 'fleurkmdmmsqmqsùm^q.jpg',
                userId: '2',
                storeId: '1',
                conditions: ['1', '2']
            })
            .set('Cookie',[cookieAuthPro, cookieCsurf]);
        expect(res.body).toHaveProperty('errorMessage');
        expect(res.body.errorMessage).toBe('vous n\'avez pas le droit d\'éffectuer l\'action demandée');
        expect(res.statusCode).toEqual(403); 
    });
});

//récupération d'une offre
describe('Récupération d\'une offre par son Id',()=>{
    it('success', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .get('/api/offers/2');            
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