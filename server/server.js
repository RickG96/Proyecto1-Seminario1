const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json());


app.post('/iniciosesion', (req, res) => {
    console.log(req.body);
    res.json('ok');
});

app.post('/nuevousuario', (req, res) => {
    console.log(req.body);
    res.json('ok');
});

app.listen(3000, (err) => {
    if (err) console.log('Ocurrio un error'), process.exit(1);

    console.log('Escuchando en el puerto 3000');
});
