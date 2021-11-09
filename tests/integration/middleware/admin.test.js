const request = require('supertest');
const { User } = require('../../../models/user');
let server = require('../../../index');


describe('admin middleware /api/categories POST', () => {

    let token;

    const postRequest = () => {
        return request(server)
            .post('/api/categories')
            .set('x-auth-token', token)
            .send({ name: 'category1' })
    }

    beforeEach(() => {
        token = new User({ isAdmin: false }).generateAuthToken();
    })

    it('should return 403 if client is not admin', async () => {
        const res = await postRequest();

        expect(res.status).toBe(403);
    })

})