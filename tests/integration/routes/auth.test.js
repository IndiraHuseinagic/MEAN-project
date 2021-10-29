const request = require('supertest');
const { User } = require('../../../models/user');
const server = require('../../../index');
const bcrypt = require('bcrypt');


//POST
describe('/api/auth  POST /', () => {

    afterEach(async () => { await User.deleteOne(); })

    let email;
    let password;

    beforeEach(async () => {
        email = 'user12345@gmail.com';
        password = '12345'
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = new User({
            name: 'user12345',
            password: password_hash,
            email: email,
            phone: '12345',
        });

        await user.save();


    })

    const postRequest = async () => {
        return await request(server)
            .post('/api/auth')
            .send({ email: email, password: password })
    }

    //validate
    it('should return 400 if password is less than 5 characters', async () => {
        password = '1234'

        const res = await postRequest();

        expect(res.status).toBe(400);
    })

    //check
    it('should return 400 if user with given email is not registered', async () => {
        email = "newemail@gmail.com"
        const res = await postRequest();

        expect(res.status).toBe(400);
    })

    //check
    it('should return 400 if email/password does not match with DB password', async () => {
        password = 'newPassword'

        const res = await postRequest();

        expect(res.status).toBe(400);
    })

    //response
    it('should return user in body and token in header if email/password are valid', async () => {

        const res = await postRequest();

        expect(res.header).toHaveProperty('x-auth-token');
        expect(res.body.password).toBe(undefined);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', 'user12345');
    })
})
