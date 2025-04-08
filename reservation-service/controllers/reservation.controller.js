const pool = require('../models/db');
const produceEvent = require('../kafka/producer');

exports.createReservation = async (req, res) => {
    const { user_id, room_id, date, start_time, end_time } = req.body;
  
    try {
      // Vérifier s’il y a conflit
      const conflictCheck = await pool.query(
        `SELECT * FROM reservations 
         WHERE room_id = $1 AND date = $2 
         AND (
           (start_time < $4 AND end_time > $3)
         )`,
        [room_id, date, start_time, end_time]
      );
  
      if (conflictCheck.rows.length > 0) {
        return res.status(409).json({ message: 'La salle est déjà réservée pour cet horaire.' });
      }
  
      // Si disponible → insérer
      const result = await pool.query(
        'INSERT INTO reservations (user_id, room_id, date, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, room_id, date, start_time, end_time]
      );
  
      // Publier un événement Kafka
      const reservation = result.rows[0];
      await produceEvent('reservation-created', reservation);
  
      res.status(201).json(reservation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la réservation' });
    }
  };
  

exports.getAllReservations = async (req, res) => {
    const result = await pool.query('SELECT * FROM reservations');
    res.json(result.rows);
};

exports.getByUser = async (req, res) => {
    const result = await pool.query('SELECT * FROM reservations WHERE user_id = $1', [req.params.userId]);
    res.json(result.rows);
};

exports.getByRoom = async (req, res) => {
    const result = await pool.query('SELECT * FROM reservations WHERE room_id = $1', [req.params.roomId]);
    res.json(result.rows);
};

exports.cancelReservation = async (req, res) => {
    await pool.query('DELETE FROM reservations WHERE id = $1', [req.params.id]);
    res.json({ message: 'Reservation cancelled' });
};
