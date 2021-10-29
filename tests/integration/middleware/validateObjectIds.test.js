const request = require('supertest');
let server = require('../../../index'); 


describe('validateObjectIds middleware /api/categories GET /:id', ()=>{

    it('should return 404 if object ID is invalid', async ()=>{
        const id = 1;

        const res = await request(server).get('/api/categories/' + id).send();        

        expect(res.status).toBe(404);
    })

})