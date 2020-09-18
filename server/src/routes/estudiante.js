var express = require('express');
var router = express.Router();

const orden_controller = require('../controllers/estudiante');

router.post('/registro',orden_controller.post_registro); 

module.exports = router; 