var express = require('express');
var router = express.Router();

const orden_controller = require('../controllers/sesion');

router.post('/registro',orden_controller.post_registro); 
router.post('/comparar',orden_controller.post_comparar); 

module.exports = router; 