const express = require('express');
const app = express();
const routers = require('./routers');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())
routers(app);

app.listen(8000);