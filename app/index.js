const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routers');
const corsOption = require('./helpers/corsOption');

//Cors middleware
app.use(cors(corsOption()));

//Gestion pour les fichiers a inclure(image...)
app.use(express.static(__dirname + '/statics'));

//Permet de gerer les formulaire (pas les formData)
app.use(express.urlencoded({ extended: true }));

//parse en format json
app.use(express.json());

//Router middleware
app.use(router);

module.exports = app;