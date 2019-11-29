var express = require('express')
var router = express.Router()
const { productController} = require ('../controllers')

router.get('/getlistproduct', productController.getListProduct)

router.get('/getproduct', productController.getProduct)

router.post('/addproduct', productController.addProduct)

router.put('/editproduct/:id', productController.editProduct)

router.delete('/deleteproduct/:id', productController.deleteProduct )

router.get('/productdetail/:productId', productController.productDetail )



module.exports = router;