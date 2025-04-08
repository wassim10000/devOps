const pool = require('../models/db');
const produceEvent = require('../kafka/producer');

exports.createSalle = async (req, res) => {
    const { name, capacity, available } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO salles (name, capacity, available) VALUES ($1, $2, $3) RETURNING *',
            [name, capacity, available]
        );

        const salle = result.rows[0];

        // 🔥 Publier l'événement
        await produceEvent('salle-created', salle);

        res.status(201).json(salle);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create salle' });
    }
};


exports.getAllSalles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM salles');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch salles' });
    }
};

exports.getSalleById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM salles WHERE id = $1', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch salle' });
    }
};

exports.updateSalle = async (req, res) => {
    const { name, capacity, available } = req.body;
    try {
        const result = await pool.query(
            'UPDATE salles SET name = $1, capacity = $2, available = $3 WHERE id = $4 RETURNING *',
            [name, capacity, available, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update salle' });
    }
};

exports.deleteSalle = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM salles WHERE id = $1 RETURNING *', [req.params.id]);

        if (result.rows.length > 0) {
            await produceEvent('salle-deleted', result.rows[0]);
        }

        res.json({ message: 'Salle deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete salle' });
    }
};

