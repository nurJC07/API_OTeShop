var express = require('express');
var router = express.Router()
const {authController} = require('../controllers')


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/verified', authController.verified)
router.post('/keeplogin', authController.keeplogin)
router.get('/getuserList', authController.getuserList)


module.exports = router