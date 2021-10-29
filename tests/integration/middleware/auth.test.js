const request = require('supertest');
const { User } = require('../../../models/user');
let server = require('../../../index'); 


describe('auth middleware /api/categories POST', ()=>{
   
    let token;

    const postRequest =() => {
        return request(server)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({name: 'category1'})
    }

    beforeEach(()=>{
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token is provided', async ()=>{
        token ='';

        const res = await postRequest();           

        expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid', async ()=>{
        token ='a';

        const res = await postRequest();           

        expect(res.status).toBe(400);
    })
})