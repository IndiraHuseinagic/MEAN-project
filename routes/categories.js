const { Category, validateCategory } = require('../models/category')
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');

//GET
router.get('/', async (req, res) => {
    const categories = await Category.find()
        .select("-__v")
        .sort('name');
    res.send(categories);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const category = await Category.findById(req.params.id).select("-__v");

    if (!category) return res.status(404).send('The category with the given ID was not found.');
    res.send(category);
});

//POST
router.post('/', [auth, admin, validate(validateCategory)], async (req, res) => { // 

    let category = new Category({ name: req.body.name });

    category = await category.save();

    res.send(category);
});

//PUT 
router.put('/:id', [auth, admin, validateObjectId, validate(validateCategory)], async (req, res) => {

    const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!category) return res.status(404).send('The category with the given ID was not found');

    res.send(category);
});

//DELETE
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id);

    if (!category) return res.status(404).send('The category with the given ID was not found');

    res.send(category);
})

module.exports = router;
