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

//création d'un store
describe('Création d\'un store',()=>{
    it('la création est une réussite', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .post('/api/stores')
            .send({
                token: csurfToken,
                name: 'Toto Fleur H24 - jour et nuit',
                presentation: 'Manasin de fleur magnifique',
                street: '32 bis chemin des fageolle',
                phone: '06 23 27 41 06',
                imageName: 'mon magasin .jpg',
                userId: '2',
                email: 'bonjour@hotmail.fr',
                cityId: '1',
                typeId: '1'
            })
            .set('Cookie',[cookieAuth, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.statusCode).toEqual(201); 
    });
});

//modification d'un sotre
describe('modification d\'un store',()=>{
    it('la modification est une réussite', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .patch('/api/stores/22')
            .send({
                token: csurfToken,
                name: 'Toto Fleur H24 - jour et nuit',
                presentation: 'Manasin de fleur magnifique',
                street: '32 bis chemin des fageolle',
                phone: '06 23 27 41 06',
                imageName: 'mon image modifié.jpg',
                userId: '2',
                email: 'bonjour@hotmail.fr',
                cityId: '1',
                typeId: '1'
            })
            .set('Cookie',[cookieAuth, cookieCsurf]);
        expect(res.body).toHaveProperty('message');
        expect(res.statusCode).toEqual(200); 
    });
});

//récupération des données d'un sotre
describe('récupération données d\'un store',()=>{
    it('réussite récupération', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .get('/api/stores/8');            
        expect(res.body).toHaveProperty('store');
        expect(res.statusCode).toEqual(200); 
    });
});