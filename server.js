const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
let option = { useNewUrlParser: true };

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, option, (err, database) => {
    if (err) return console.log(err)
    let db = database.db("rgdb")
    require('./app/routes')(app, db);

    app.listen(port, () => {
        console.log('We are live on ' + port);
    });

})
