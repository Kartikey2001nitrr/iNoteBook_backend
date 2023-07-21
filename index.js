const connectToMongo = require('./database/db');
const express = require('express');
require('dotenv').config();
var cors = require('cors');
const app = express();
app.use(cors());

connectToMongo();
const port = process.env.PORT || 5000;
app.use(express.json())



app.get('/', (req, res) => {
  res.send('I NoteBook');
})

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`App running at port http://localhost:${port} successfully.`);
})