const { Apartment, validateApartment } = require('../models/apartment');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');


//GET
router.get('/', async (req, res) => {
    const apartments = await Apartment.find()
        .select("-__v")
        .sort('title');
    res.send(apartments);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const apartment = await Apartment.findById(req.params.id).select("-__v");

    if (!apartment) return res.status(404).send('The apartment with the given ID was not found.');
    res.send(apartment);
});

//POST
router.post('/', [auth, admin, validate(validateApartment)], async (req, res) => {

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid category.');

    const apartment = new Apartment({
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        },
        imageUrl: req.body.imageUrl,
        address: req.body.address,
        guests: req.body.guests,
        area: req.body.area,
        unavailable: req.body.unavailable,
        dailyPrice: req.body.dailyPrice
    });
    await apartment.save();

    res.send(apartment);
})

//PUT 
router.put('/:id', [auth, admin, validateObjectId, validate(validateApartment)], async (req, res) => {

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send('Invalid category.');

    const apartment = await Apartment.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        category: {
            _id: category._id,
            name: category.name
        },
        imageUrl: req.body.imageUrl,
        address: req.body.address,
        guests: req.body.guests,
        area: req.body.area,
        unavailable: req.body.unavailable,
        dailyPrice: req.body.dailyPrice
    }, { new: true });


    if (!apartment) return res.status(404).send('The apartment with the given ID was not found');


    res.send(apartment);
});

//DELETE
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const apartment = await Apartment.findByIdAndRemove(req.params.id);

    if (!apartment) return res.status(404).send('The apartment with the given ID was not found');

    res.send(apartment);
})

module.exports = router;
