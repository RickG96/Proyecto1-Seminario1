var express = require('express');
var router = express.Router();

const orden_controller = require('../controllers/asistencia');

router.post('/registro',orden_controller.post_registro);
router.get('/asistencia',orden_controller.get_asistencia); 

module.exports = router; 