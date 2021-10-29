const { Reservation } = require('../../../models/reservation');
const { User } = require('../../../models/user');
const { Apartment } = require('../../../models/apartment')
const request = require('supertest');
const server = require('../../../index');
const mongoose = require('mongoose');

describe('/api/reservations', () => {

    let token;
    let userId;
    let apartmentId;
    let id;
    let route;
    let reservation;

    const createReservation = async () => {

        apartmentId = mongoose.Types.ObjectId();
        userId = mongoose.Types.ObjectId();
        token = new User({ _id: userId, isAdmin: true }).generateAuthToken();

        reservation = new Reservation({
            user: {
                _id: userId,
                name: '12345',
                email: 'email@gmail.com',
                phone: '12345'
            },
            apartment: {
                _id: apartmentId,
                title: 'New Apartment',
                imageUrl: 'imageUrl',
                address: 'Munich',
                dailyPrice: 100
            },
            checkIn: new Date('2021/11/11'),
            checkOut: new Date('2021/11/12')
        });

        await reservation.save();
        id = reservation._id;
    }

    const getRequest = async () => {
        return await request(server)
            .get(route)
            .set('x-auth-token', token)
            .send()
    }

    //GET  
    describe('GET /', () => {

        beforeEach(async () => {
            await createReservation();
            route = '/api/reservations';
        })
        afterEach(async () => { await Reservation.deleteOne(); })

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await getRequest();

            expect(res.status).toBe(401);
        })

        //admin
        it('should return 403 if client is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await getRequest();

            expect(res.status).toBe(403);
        })

        //response
        it('should return all reservations', async () => {

            const res = await getRequest();

            expect(res.status).toBe(200);
            expect(res.body.some(r => r.user.name === "12345")).toBeTruthy();
            expect(res.body.some(r => r.apartment.title === "New Apartment")).toBeTruthy();
        })
    })

    describe('GET /:id', () => {

        beforeEach(async () => {
            await createReservation();
            route = '/api/reservations/' + id;
        })

        afterEach(async () => { await Reservation.deleteOne(); })

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await getRequest();

            expect(res.status).toBe(401);
        })

        //objectId
        it('should return 404 if ID is invalid', async () => {
            id = 1;
            route = '/api/reservations/' + id;

            const res = await getRequest();

            expect(res.status).toBe(404);
        })

        //check
        it('should return 404 if reservation with given ID was not found', async () => {
            id = mongoose.Types.ObjectId();
            route = '/api/reservations/' + id;

            const res = await getRequest();

            expect(res.status).toBe(404);
        })

        //repsonse
        it('should return reservation if valid ID is passed', async () => {

            const res = await getRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('user.name', '12345');
            expect(res.body).toHaveProperty('apartment.title', 'New Apartment');
        })
    })

    describe('GET /my', () => {

        beforeEach(async () => {
            await createReservation();
            route = '/api/reservations/my';
        })
        afterEach(async () => { await Reservation.deleteOne(); })

        //auth 
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await getRequest();

            expect(res.status).toBe(401);
        })

        //check
        it('should return 404 if reservation with given user ID is not found', async () => {
            const newuserId = mongoose.Types.ObjectId();
            token = new User({ _id: newuserId, isAdmin: true }).generateAuthToken();

            const res = await getRequest();

            expect(res.status).toBe(404);
        })

        //response
        it('should return reservation if valid ID is passed', async () => {

            const res = await getRequest();

            expect(res.status).toBe(200);
            expect(res.body.some(r => r._id)).not.toBeNull();
            expect(res.body.some(r => r.user.name === '12345')).toBeTruthy();
            expect(res.body.some(r => r.apartment.title === 'New Apartment')).toBeTruthy();
        })
    })

    //POST
    describe('POST /', () => {

        afterEach(async () => { await User.deleteOne(); await Apartment.deleteOne(); })

        let userId;
        let apartmentId;
        let token;
        let checkIn;
        let checkOut;
        let apartment;

        beforeEach(async () => {
            const user = new User({
                name: '12345',
                password: '12345',
                email: 'email@gmail.com',
                phone: '12345',
                isAdmin: true
            });

            await user.save();
            userId = user._id;

            apartment = new Apartment({
                title: 'New Apartment',
                category: { name: 'category1' },
                imageUrl: 'imageUrl',
                address: 'Munich',
                guests: 4,
                area: 50,
                unavailable: [],
                dailyPrice: 100
            });

            await apartment.save();
            apartmentId = apartment._id;

            token = user.generateAuthToken();
            checkIn = new Date('2021/11/11');
            checkOut = new Date('2021/11/12');
        })

        const postRequest = async () => {
            return await request(server)
                .post('/api/reservations')
                .set('x-auth-token', token)
                .send({ userId: userId, apartmentId: apartmentId, checkIn: checkIn, checkOut: checkOut })
        }
        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await postRequest();

            expect(res.status).toBe(401);
        })

        //validate Reservation
        it('should return 400 if userId is not provided', async () => {
            userId = '';

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //check
        it('should return 404 if user with given userId is not found', async () => {
            userId = mongoose.Types.ObjectId();

            const res = await postRequest();

            expect(res.status).toBe(404);
        })

        //check
        it('should return 404 if apartment with given apartmentId is not found', async () => {
            apartmentId = mongoose.Types.ObjectId();

            const res = await postRequest();

            expect(res.status).toBe(404);
        })

        //check
        it('should return 400 if rentalFee is not set', async () => {
            checkIn = new Date('2021/11/11');
            checkOut = new Date('2021/11/11');

            const res = await postRequest();

            expect(res.status).toBe(400);
        })

        //save
        it('should save reservation if it is valid', async () => {

            await postRequest();

            const reservationInDB = await Reservation.find({ 'user._id': userId, 'apartment._id': apartmentId });
            expect(reservationInDB).not.toBeNull();
        })

        //update apartment unavailable range
        it('should update apartment unavailable range', async () => {

            const res = await postRequest();

            const apartmentInDB = await Apartment.findById(apartmentId);

            expect(apartmentInDB.unavailable.some(u => u.reservationId.toHexString() === res.body._id)).toBeTruthy();
        })

        //response
        it('should return reservation if it is valid', async () => {

            const res = await postRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('user.name', '12345');
            expect(res.body).toHaveProperty('apartment.title', 'New Apartment');
            expect(res.body).toHaveProperty('rentalFee', 100);
        })
    })

    //DELETE
    describe('DELETE /:id', () => {

        afterEach(async () => { await Reservation.deleteOne(); await Apartment.deleteOne(); })

        let token;
        let userId;
        let apartmentId;
        let id;
        let checkIn;
        let checkOut;

        beforeEach(async () => {
            userId = mongoose.Types.ObjectId();
            token = new User({ _id: userId, isAdmin: true }).generateAuthToken();
            checkIn = new Date('2021/11/11');
            checkOut = new Date('2021/11/12');

            let apartment = new Apartment({
                title: 'New Apartment',
                category: { name: 'category1' },
                imageUrl: 'imageUrl',
                address: 'Munich',
                guests: 4,
                area: 50,
                dailyPrice: 100,
                unavailable: []
            });

            await apartment.save();
            apartmentId = apartment._id;

            const reservation = new Reservation({
                user: {
                    _id: userId,
                    name: '12345',
                    email: 'email@gmail.com',
                    phone: '12345'
                },
                apartment: {
                    _id: apartmentId,
                    title: apartment.title,
                    imageUrl: apartment.imageUrl,
                    address: apartment.address,
                    dailyPrice: apartment.dailyPrice
                },
                checkIn: checkIn,
                checkOut: checkOut,
                rentalFee: 100
            });

            await reservation.save();
            id = reservation._id;

            let rented = {
                checkIn: checkIn,
                checkOut: checkOut,
                reservationId: id
            }

            apartment.unavailable.push(rented);

            await apartment.save();
        })

        const deleteRequest = async () => {
            return await request(server)
                .delete('/api/reservations/' + id)
                .set('x-auth-token', token)
                .send()
        }

        //auth
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await deleteRequest();

            expect(res.status).toBe(401);
        });

        //objectId
        it('should return 404 if ID is invalid', async () => {
            id = 1;

            const res = await deleteRequest();

            expect(res.status).toBe(404);
        })

        //check
        it('should return 404 if reservation with given ID was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await deleteRequest();

            expect(res.status).toBe(404);
        })

        //check
        it('should return 400 if apartment with given ID was not found in reservation', async () => {
            await Apartment.deleteOne();

            const res = await deleteRequest();

            expect(res.status).toBe(400);
        })

        //delete
        it('should delete reservation if input is valid', async () => {
            await deleteRequest();

            const reservationInDB = await Reservation.findById(id);

            expect(reservationInDB).toBeNull();
        })

        //response
        it('should return removed reservation', async () => {
            const res = await deleteRequest();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('user.name', '12345');
            expect(res.body).toHaveProperty('apartment.title', 'New Apartment');
            expect(res.body).toHaveProperty('rentalFee', 100);
        })

        //remove unvailable in apartment
        it('should remove unavailable range from apartment', async () => {

            const res = await deleteRequest();

            const apartmentInDB = await Apartment.findById(apartmentId);

            expect(apartmentInDB.unavailable.some(u => u.reservationId.toHexString() === res.body._id)).toBeFalsy();
        })
    })

})