const request = require('supertest');
const { Apartment } = require('../../../models/apartment');
const { User } = require('../../../models/user');
const server = require('../../../index');
const mongoose = require('mongoose');
const { Category } = require('../../../models/category');

describe('/api/apartments', () => {

    let id;
    let route;

    const createApartment = async () => {

        const apartment = new Apartment({
            title: 'Apartment1',
            category: { name: 'category1' },
            imageUrl: 'imageUrl',
            address: 'Munich',
            guests: 4,
            area: 50,
            unavailable: [],
            dailyPrice: 60
        });

        await apartment.save();
        id = apartment._id;
    }

    const getRequest = async () => {
        return await request(server)
            .get(route).send()
    }

    //GET
    describe('GET /', () => {
        beforeEach(async () => {
            await createApartment();
            route = '/api/apartments';
        })
        afterEach(async () => { await Apartment.deleteOne(); })

        //response
        it('should return all apartments', async () => {

            const res = await getRequest();

            expect(res.status).toBe(200);
            expect(res.body.some(a => a.title === "Apartment1")).toBeTruthy();
            expect(res.body.some(a => a.dailyPrice === 60)).toBeTruthy();
        })
    })

    describe('GET /:id', () => {

        beforeEach(async () => {
            await createApartment();
            route = '/api/apartments/' + id;
        })

        afterEach(async () => { await Apartment.deleteOne(); })

        //objectId
        it('should return 404 if ID is invalid', async () => {
            id = 1;
            route = '/api/apartments/' + id;

            const res = await getRequest();

            expect(res.status).toBe(404);
        })

        //check
        it('should return 404 if apartment with given ID was not found', async () => {
            id = mongoose.Types.ObjectId();
            route = '/api/apartments/' + id;

            const res = await getRequest();

            expect(res.status).toBe(404);
        })

        //response
        it('should return apartment if valid ID is passed', async () => {

            const res = await getRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('title', 'Apartment1');
            expect(res.body).toHaveProperty('dailyPrice', 60);
        })


    })

    //POST
    describe('POST /', () => {

        afterEach(async () => { await Category.deleteOne(); })

        let categoryId;
        let token;
        let title;
        let guests;

        beforeEach(async () => {
            const category = new Category({ name: 'Category1' });

            await category.save();
            categoryId = category._id;
            title = 'Apartment1';
            guests = 4;

            token = new User({ isAdmin: true }).generateAuthToken();
        })

        const postRequest = async () => {
            return await request(server)
                .post('/api/apartments')
                .set('x-auth-token', token)
                .send({
                    categoryId: categoryId,
                    title: title, imageUrl: 'imageUrl', address: 'Munich',
                    guests: guests, area: 50, unavailable: [], dailyPrice: 60
                })
        }

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await postRequest();

            expect(res.status).toBe(401);
        })

        //admin
        it('should return 403 if client is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await postRequest();

            expect(res.status).toBe(403);
        })

        //validate Apartment
        it('should return 400 if title is less than 5 characters', async () => {
            title = '1234';  //<5  

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //validate Apartment
        it('should return 400 if number of guests is more than 15', async () => {
            guests = 16;  //>15  

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //check
        it('should return 400 if category with given ID was not found', async () => {
            categoryId = mongoose.Types.ObjectId();

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //save
        it('should save apartment if it is valid', async () => {

            await postRequest();

            const apartmentInDB = await Apartment.find({ 'category._id': categoryId, 'title': 'Apartment1' });

            expect(apartmentInDB).not.toBeNull();
        })

        //response
        it('should return apartment if it is valid', async () => {

            const res = await postRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).not.toHaveProperty('phone');
            expect(res.body).toHaveProperty('title', 'Apartment1');
            expect(res.body).toHaveProperty('dailyPrice', 60);
        })

    })

    //PUT
    describe('PUT /:id', () => {

        afterEach(async () => { await Category.deleteOne(); await Apartment.deleteOne(); })

        let categoryId;
        let token;
        let id;

        beforeEach(async () => {
            const category = new Category({ name: 'Category1' });

            await category.save();
            categoryId = category._id;

            const apartment = new Apartment({
                title: 'Apartment1',
                category: category,
                imageUrl: 'imageUrl',
                address: 'Munich',
                guests: 4,
                area: 50,
                unavailable: [],
                dailyPrice: 60
            });

            await apartment.save();
            id = apartment._id;

            token = new User({ isAdmin: true }).generateAuthToken();
        })

        const putRequest = async () => {
            return await request(server)
                .put('/api/apartments/' + id)
                .set('x-auth-token', token)
                .send({
                    categoryId: categoryId,
                    title: 'New Apartment', imageUrl: 'new imageUrl', address: 'London',
                    guests: 5, area: 60, unavailable: [], dailyPrice: 70
                })
        }

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await putRequest();

            expect(res.status).toBe(401);
        })

        //admin
        it('should return 403 if client is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

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
        it('should return 400 if title is less than 5 characters', async () => {

            const res = await request(server)
                .put('/api/apartments/' + id)
                .set('x-auth-token', token)
                .send({
                    categoryId: categoryId,
                    title: '1234', imageUrl: 'imageUrl', address: 'Munich',
                    guests: 4, area: 50, unavailable: [], dailyPrice: 60
                });

            expect(res.status).toBe(400);
        })

        //check
        it('should return 400 if category with given ID was not found', async () => {
            categoryId = mongoose.Types.ObjectId();

            const res = await putRequest();

            expect(res.status).toBe(400);
        })

        //check
        it('should return 404 if apartment with given ID was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await putRequest();

            expect(res.status).toBe(404);
        })

        //update
        it('should update apartment if it is valid', async () => {

            await putRequest();

            const apartmentInDB = await Apartment.find({ 'category._id': categoryId, 'title': 'New Apartment' });

            expect(apartmentInDB).not.toBeNull();
        })

        //response
        it('should return updated apartment', async () => {

            const res = await putRequest();

            expect(res.body).toHaveProperty('title', 'New Apartment');
            expect(res.body).toHaveProperty('dailyPrice', 70);
        })

    })

    //DELETE
    describe('DELETE /:id', () => {

        afterEach(async () => { await Apartment.deleteOne(); })

        let token;
        let id;

        beforeEach(async () => {

            const apartment = new Apartment({
                title: 'Apartment1',
                category: { name: 'Category1' },
                imageUrl: 'imageUrl',
                address: 'Munich',
                guests: 4,
                area: 50,
                unavailable: [],
                dailyPrice: 60
            });

            await apartment.save();
            id = apartment._id;

            token = new User({ isAdmin: true }).generateAuthToken();
        })

        const deleteRequest = async () => {
            return await request(server)
                .delete('/api/apartments/' + id)
                .set('x-auth-token', token)
                .send()
        }

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await deleteRequest();

            expect(res.status).toBe(401);
        })

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
        it('should return 404 if apartment with given ID was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await deleteRequest();

            expect(res.status).toBe(404);
        })

        //delete
        it('should delete apartment if it is valid', async () => {

            await deleteRequest();

            const apartmentInDB = await Apartment.findById({ _id: id });

            expect(apartmentInDB).toBeNull();
        })

        //response
        it('should return removed apartment', async () => {

            const res = await deleteRequest();

            expect(res.body).toHaveProperty('title', 'Apartment1');
            expect(res.body).toHaveProperty('dailyPrice', 60);
        })

    })

})