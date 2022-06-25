const request = require('supertest');
require('dotenv').config();

//application
const app = require('../app');
describe('ajout d\'une offre',()=>{
    it('ajout d\'une offre',async()=>{
        const res = await request(app)
            .post('/api/offers')
            .send({
                token: 'jjdjdjd'

            });
        expect(res.body).toHaveProperty('message');
        expect(res.statusCode).toEqual(200); 
    });
});