var express = require('express');
var router = express.Router();

const orden_controller = require('../controllers/sesion');

router.get('/login',orden_controller.login); 
router.post('/loginface',orden_controller.loginface); 
router.post('/registro',orden_controller.post_registro); 
router.get('/eliminar',orden_controller.eliminar); 

module.exports = router; 