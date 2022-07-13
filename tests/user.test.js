require ('dotenv').config();
const request = require('supertest');
const app = require('../app');

//test inscription utilisateur
describe('gestion inscription utilsateur',()=>{
    it('réussite', async()=>{        
        //crétion d'une offre
        const res = await request(app)
            .post('/api/anonymous/register')
            .send({
                email: 'jjjjm',
            });
        expect(res.statusCode).toEqual(200); 
    });
});

describe('create a professional', ()=>{
    it('success creation', ()=>{

    });
});