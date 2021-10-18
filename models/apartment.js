const Joi = require('joi');
const mongoose = require('mongoose');
const {categorySchema} = require('./category');
const {rentedSchema} = require('./range');

const Apartment = mongoose.model('Apartment', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: categorySchema,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    guests: {
        type: Number,
        required: true,
        min:1,
        max:15
    }, 
    area: {
        type: Number,
        required: true,
        min:10,
        max:200
    }, 
    unavailable: {
        type: [rentedSchema]
    },
    dailyPrice: {
        type: Number,
        required: true,
        min:0,
        max:255
    }
}));

function validateApartment(apartment) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        categoryId: Joi.objectId().required(),
        imageUrl: Joi.string().min(5).max(255).required(),
        address: Joi.string().min(5).max(255).required(),
        guests: Joi.number().min(1).max(15).required(),
        area: Joi.number().min(10).max(200).required(),
        unavailable: Joi.array(), 
        dailyPrice: Joi.number().min(5).max(255).required()
    });

  return schema.validate(apartment);    
}

exports.Apartment = Apartment;
exports.validate = validateApartment;
