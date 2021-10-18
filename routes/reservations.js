const { Reservation, validate } = require("../models/reservation");
const { Apartment } = require("../models/apartment");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

//GET
router.get("/my", auth, async (req, res) => { 

const reservation = await Reservation.find({'user._id': req.user._id})
.select("-__v")
.sort("-checkOut");

  if (!reservation)
    return res.status(404).send("The reservation with the given user ID was not found.");

res.send(reservation);
});

router.get("/", [auth, admin], async (req, res) => { 
  const reservation = await Reservation.find()
    .select("-__v")
    .sort("-checkOut");
  res.send(reservation);
});


router.get("/:id", auth, async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).select("-__v");
  
    if (!reservation)
      return res.status(404).send("The reservation with the given ID was not found.");
  
    res.send(reservation);
  });

  
//POST
router.post("/", auth, async (req, res) => {  

 const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("Invalid user.");

  const apartment = await Apartment.findById(req.body.apartmentId);
  if (!apartment) return res.status(400).send("Invalid apartment.");

  let reservation = new Reservation({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    },

    apartment: {
      _id: apartment._id,
      title: apartment.title,
      imageUrl: apartment.imageUrl,
      address: apartment.address,
      dailyPrice: apartment.dailyPrice
    },
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
  });

  reservation.setRentalFee();
  await reservation.save();  

  //Mark as Unavailable 
  let rented ={
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    reservationId: reservation._id
  }

  await Apartment.updateOne({ _id: reservation.apartment._id },
    {
      $push: { unavailable: rented }
    }
  );
  apartment.save(); 
  
  res.send(reservation);
});

//DELETE
router.delete('/:id', auth, async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);  
    if(!reservation) return res.status(404).send('The reservation with the given ID was not found'); 

    const apartment = await Apartment.findById(reservation.apartment._id);
       if (!apartment) return res.status(400).send("Invalid apartment.");

     await Apartment.updateOne({ _id: reservation.apartment._id },
       {
      $pull: { unavailable: {reservationId: reservation._id } }
       });

     apartment.save(); 
     
     reservation.delete();
     
    res.send(reservation);
})



module.exports = router;