const request = require('supertest');
const { User } = require('../../../models/user');
let server = require('../../../index'); 


describe('validate middleware /api/categories POST', ()=>{
   
    const token = new User({isAdmin: true}).generateAuthToken();

    const postRequest =() => {
        return request(server)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send({name: '1234'})
    }

    it('should return 400 if request is not valid (does not pass schema validation)', async ()=>{
  
        const res = await postRequest();           
        
        expect(res.status).toBe(400);
    })

})