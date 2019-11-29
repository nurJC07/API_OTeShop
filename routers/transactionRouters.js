var express = require('express')
var router = express.Router()
const { transactionController} = require ('../controllers')

router.get('/getlisttransaction', transactionController.getListTransaction)
router.get('/gettransaction/:username', transactionController.getTransaction)
router.post('/addtransaction', transactionController.addTransaction)
router.post('/trxItem', transactionController.trxItem)
router.post('/addpayment', transactionController.addPayment)
router.post('/getlistpayment', transactionController.getListPayment)
router.get('/historydetail/:trxId', transactionController.historyDetail)
router.post('/verify', transactionController.verify)
router.post('/approvepayment', transactionController.approvePayment)
router.get('/totaltrxsales', transactionController.getListSales)
router.get('/getlisthistory', transactionController.getListHistory)




module.exports = router;