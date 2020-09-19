'use strict'; 
const express = require('express');
const logger = require('morgan'); 
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();

app.use(logger('dev')); 
app.use(cors());
app.use(bodyParser.json({ limit: '5mb', extended: true }));

var sesion = require('./src/routes/sesion'); 
var estudiante = require('./src/routes/estudiante'); 
var asistencia = require('./src/routes/asistencia'); 

app.use('/sesion',sesion); 
app.use('/estudiante',estudiante); 
app.use('/asistencia',asistencia); 

app.listen(3000, (err) => {
    if (err) console.log('Ocurrio un error'), process.exit(1);

    console.log('Escuchando en el puerto 3000');
});