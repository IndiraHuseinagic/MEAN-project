const request = require('supertest');
const { User } = require('../../../models/user');
const server = require('../../../index');


describe('/api/users', () => {

    //GET
    describe('GET /me', () => {

        afterEach(async () => { await User.deleteOne(); })
        let token;

        beforeEach(async () => {
            const user = new User({
                name: '12345',
                password: '12345',
                email: 'email@gmail.com',
                phone: '12345',
                isAdmin: true
            });

            await user.save();
            token = user.generateAuthToken();
        })

        const getRequest = async () => {
            return await request(server)
                .get('/api/users/me')
                .set('x-auth-token', token)
                .send()
        }

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await getRequest();

            expect(res.status).toBe(401);
        })

        it('should return user if token is valid', async () => {

            const res = await getRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', '12345');
        })
    })

    //POST
    describe('POST /', () => {

        afterEach(async () => { await User.deleteOne(); })

        const postRequest = async () => {
            return await request(server)
                .post('/api/users')
                .send({
                    name: 'user12345', password: '12345',
                    email: 'user12345@gmail.com', phone: '12345'
                })
        }

        //validate
        it('should return 400 if name is less than 3', async () => {

            const res = await request(server)
                .post('/api/users')
                .send({
                    name: '12', password: '12345',
                    email: 'user12345@gmail.com', phone: '12345'
                })

            expect(res.status).toBe(400);
        })

        //check
        it('should return 400 if already exists a user account with this email address', async () => {
            const user = new User({
                name: 'User1',
                password: '12345',
                email: 'user12345@gmail.com',
                phone: '12345',
            });
            await user.save();

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //save
        it('should save user', async () => {

            await postRequest();

            const userInDB = await User.find({ 'name': 'user12345', 'email': 'user12345@gmail.com' });

            expect(userInDB).not.toBeNull();
        })

        //response
        it('should return user in body and token in header', async () => {

            const res = await postRequest();

            expect(res.header).toHaveProperty('x-auth-token');
            expect(res.body.password).toBe(undefined);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'user12345');


        })
    })
})
