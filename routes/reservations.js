const { Reservation, validateReservation } = require("../models/reservation");
const { Apartment } = require("../models/apartment");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const validate = require('../middleware/validate')
const validateObjectId = require('../middleware/validateObjectId');


//GET
router.get("/my", auth, async (req, res) => {

  const reservation = await Reservation.find({ 'user._id': req.user._id })
    .select("-__v")
    .sort("-checkOut");

  if (reservation.length === 0)
    return res.status(404).send("The reservation with the given user ID was not found.");

  res.send(reservation);
});

router.get("/", [auth, admin], async (req, res) => {
  const reservation = await Reservation.find()
    .select("-__v")
    .sort("-checkOut");
  res.send(reservation);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).select("-__v");

  if (!reservation)
    return res.status(404).send("The reservation with the given ID was not found.");

  res.send(reservation);
});


//POST
router.post("/", [auth, validate(validateReservation)], async (req, res) => {

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).send("Invalid user.");


  const apartment = await Apartment.findById(req.body.apartmentId);
  if (!apartment) return res.status(404).send("Invalid apartment.");


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
  if (!reservation.rentalFee) return res.status(400).send("Invalid checkIn/checkOut.");

  await reservation.save();

  //Mark as Unavailable 
  let rented = {
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    reservationId: reservation._id
  };

  await Apartment.updateOne({ _id: reservation.apartment._id },
    {
      $push: { unavailable: rented }
    }
  );
  await apartment.save();

  res.send(reservation);
});

//DELETE
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  const reservation = await Reservation.findByIdAndRemove(req.params.id);
  if (!reservation) return res.status(404).send('The reservation with the given ID was not found');

  const apartment = await Apartment.findById(reservation.apartment._id);
  if (!apartment) return res.status(400).send("Invalid apartment.");

  await Apartment.updateOne({ _id: reservation.apartment._id },
    {
      $pull: { unavailable: { reservationId: reservation._id } }
    });

  await apartment.save();

  res.send(reservation);
})

module.exports = router;