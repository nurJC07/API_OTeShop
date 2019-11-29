var express = require('express')
var router = express.Router()
const { cartController } = require('../controllers')

router.get('/getlistcart', cartController.getListCart)

router.post('/addcart', cartController.addCart)

router.put('/editcart/:id', cartController.editCart)

router.delete('/deletecart/:id', cartController.deleteCart )

router.delete('/clearcart/:username', cartController.clearCart )

module.exports = router