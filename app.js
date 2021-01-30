const express = require("express");
const winston = require("winston");
const app = express();

const cors = require('cors');
app.use(cors());

const logger = require("./startup/winston");
logger();

const router = require("./startup/routes");
router(app);


const port = process.env.PORT || 2000;

const server = app.listen(port, () => {
        winston.info(`Listening on port ${port}...`);
        console.log(`Server running at http://localhost:${port}/`);
    }
);

module.exports = server;
