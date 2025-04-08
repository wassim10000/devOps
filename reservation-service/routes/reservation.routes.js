const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservation.controller');

router.post('/', controller.createReservation);
router.get('/', controller.getAllReservations);
router.get('/user/:userId', controller.getByUser);
router.get('/room/:roomId', controller.getByRoom);
router.delete('/:id', controller.cancelReservation);

module.exports = router;
