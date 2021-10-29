const request = require('supertest');
const { Category } = require('../../../models/category')
const { User } = require('../../../models/user');
const server = require('../../../index');
const mongoose = require('mongoose');

describe('/api/categories', () => {

    afterEach(async () => { await Category.deleteMany(); })

    //GET
    describe('GET /', () => {

        //response
        it('should return all categories', async () => {
            await Category.collection.insertMany([
                { name: "category1" },
                { name: "category2" }
            ])
            const res = await request(server).get('/api/categories');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(c => c.name === "category1")).toBeTruthy();
            expect(res.body.some(c => c.name === "category2")).toBeTruthy();
        })
    })

    describe('GET /:id', () => {

        //objectId
        it('should return 404 if ID is invalid', async () => {
            const res = await request(server).get('/api/categories/1');

            expect(res.status).toBe(404);
        })

        //check
        it('should return 404 if category with given ID was not found', async () => {
            const category = new Category({ name: "category1" });
            await category.save();

            const id = mongoose.Types.ObjectId(); //not category_id

            const res = await request(server).get('/api/categories/' + id);

            expect(res.status).toBe(404);
        })

        //reponse
        it('should return a category if valid ID is passed', async () => {
            const category = new Category({ name: "category1" });
            await category.save();

            const res = await request(server).get('/api/categories/' + category._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', category.name);
        })
    })

    //POST
    describe('POST /', () => {
        let token;
        let category;

        const postRequest = async () => {
            return await request(server)
                .post('/api/categories')
                .set('x-auth-token', token)
                .send({ name: category })
        }

        beforeEach(() => {
            const user = new User({ isAdmin: true }); //admin
            token = user.generateAuthToken();    //auth
            category = 'category1'
        })

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await postRequest();

            expect(res.status).toBe(401);
        })

        //admin
        it('should return 403 if client is not admin', async () => {
            const user = new User({ isAdmin: false });
            token = user.generateAuthToken();

            const res = await postRequest();

            expect(res.status).toBe(403);
        })

        //validate
        it('should return 400 if category is less than 5 characters', async () => {
            category = '1234';  //<5  

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //validate
        it('should return 400 if category is more than 50 characters', async () => {
            category = new Array(52).join('a'); //>50

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //save
        it('should save category if it is valid', async () => {

            await postRequest();

            const category = await Category.find({ name: 'category1' });
            expect(category).not.toBeNull();
        })

        //response
        it('should return category if it is valid', async () => {

            const res = await postRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'category1');
        })
    })

    //PUT
    describe('PUT /:id', () => {
        let token;
        let newName;
        let category;
        let id;

        const putRequest = async () => {
            return await request(server)
                .put('/api/categories/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        }

        beforeEach(async () => {
            category = new Category({ name: 'category1' });
            await category.save();

            token = new User({ isAdmin: true }).generateAuthToken();
            id = category._id;
            newName = 'updatedName';
        })

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await putRequest();

            expect(res.status).toBe(401);
        });

        //admin
        it('should return 403 if client is not admin', async () => {
            const user = new User();
            token = user.generateAuthToken();

            const res = await putRequest();

            expect(res.status).toBe(403);
        })

        //objectId
        it('should return 404 if ID is invalid', async () => {
            id = 1;

            const res = await putRequest();

            expect(res.status).toBe(404);
        })

        //validate
        it('should return 400 if category is less than 5 characters', async () => {
            newName = '1234';  //<5  

            const res = await putRequest();

            expect(res.status).toBe(400);
        })

        //validate
        it('should return 400 if category is more than 50 characters', async () => {
            newName = new Array(52).join('a'); //>50

            const res = await putRequest();

            expect(res.status).toBe(400);
        })

        //check
        it('should return 404 if category with given ID was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await putRequest();

            expect(res.status).toBe(404);
        })

        //update
        it('should update category if input is valid', async () => {
            await putRequest();

            const updatedCategory = await Category.findById(id);

            expect(updatedCategory.name).toBe(newName);
        })

        //response
        it('should return category if it is valid', async () => {
            const res = await putRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', newName);
        })
    })

    //DELETE
    describe('DELETE /:id', () => {
        let token;
        let category;
        let id;

        const deleteRequest = async () => {
            return await request(server)
                .delete('/api/categories/' + id)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach(async () => {
            category = new Category({ name: 'category1' });
            await category.save();
            id = category._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        })

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await deleteRequest();

            expect(res.status).toBe(401);
        });

        //admin
        it('should return 403 if client is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await deleteRequest();

            expect(res.status).toBe(403);
        })

        //objectId
        it('should return 404 if ID is invalid', async () => {
            id = 1;

            const res = await deleteRequest();

            expect(res.status).toBe(404);
        })

        //check
        it('should return 404 if category with given ID was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await deleteRequest();

            expect(res.status).toBe(404);
        })

        //delete
        it('should delete category if input is valid', async () => {
            await deleteRequest();

            const categoryInDB = await Category.findById(id);

            expect(categoryInDB).toBeNull();
        })

        //response
        it('should return removed category', async () => {
            const res = await deleteRequest();

            expect(res.body).toHaveProperty('_id', category._id.toHexString());
            expect(res.body).toHaveProperty('name', category.name);
        })


    });

})