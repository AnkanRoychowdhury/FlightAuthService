const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');

const ApiRoutes = require('./routes/index');
const app = express();

const prepareAndStartServer = () => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api',ApiRoutes);
    
    app.listen(PORT, async () => {
        console.log(`Server Started ON ${PORT}`);
    });
}

prepareAndStartServer();