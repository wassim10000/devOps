const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const salleRoutes = require('./routes/salle.routes');
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/salles', salleRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Salle service running on port ${PORT}`);
});
