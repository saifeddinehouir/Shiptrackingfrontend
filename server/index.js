const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres', // replace with your PostgreSQL username
  host: 'localhost',
  database: 'test',
  password: 'root', // replace with your PostgreSQL password
  port: 5432,
});

// Endpoint to get all vessels
app.get('/vessel', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vessel');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get a specific vessel by MMSI
app.get('/vessel/:mmsi', async (req, res) => {
  const { mmsi } = req.params;
  try {
    const result = await pool.query('SELECT * FROM vessel WHERE mmsi = $1', [mmsi]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Vessel not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
