const conn = require('../database');
const transporter = require('../helpers/senderemail');
var fs = require('fs');
var { uploader } = require('../helpers/uploader')


module.exports = {
    getListTransaction: (req,res) => {
        var sql = `select * from transaction`;
        conn.query(sql, (err, results) => {
            if(err) throw err;            
            res.send(results);
        })   
    },

    getTransaction: (req,res) => {
        var sql = `select * from transaction where username = '${req.params.username}'`;
        conn.query(sql, (err, results) => {
            if(err) throw err;            
            res.send(results);
        })   
    },
                
    addTransaction: (req, res) => {
        var { username, totalPrice, totalQty, email} = req.body;

        var newTransaction = {
            username,
            trxDate : new Date (),
            totalPrice, 
            totalQty,
            status : "Not Payment"
        }
        var sql = `insert into transaction set?`
        conn.query(sql, newTransaction, (err, result) => {
            if(err) 
            throw err;
            console.log(sql);
            console.log(result.insertId)
            // res.send("Trx berhasil ditambahkan");
            var mailOptions = {
                from: 'Ote Shop <myjejakaki@gmail.com>',
                to : email,
                subject : 'Payment Order',
                html: ` <h3>Hi ${username},</h3>
                        <h3>Terimakasih Sudah Berbelanja!</h3>
                        <p>Silahkan lakukan pembayaran untuk melanjutkan proses pemesanan yang sudah
                        anda lakukan, sebagai berikut: </p>
                        <p>Total Pembayaran: Rp. ${totalPrice.toLocaleString()}</p>
                        <p>Transfer Ke: (BNI) 12345678123</p>
                        <h4>Setelah melakukan transfer, harap <b>upload bukti pembayaran</b> di Halaman :</h4> 
                        <a href="http://localhost:3000/confirmationpayment?username=${username}&idtransaksi=${result.insertId}">Konfirmasi Pembayaran</a>`
            }

            transporter.sendMail(mailOptions, (err2, res2) => {
                if(err2){
                    console.log(err2);
                    throw err2;
                } else {
                    console.log('Success!')
                    res.send(result);
                }
            })

        })
    },

    trxItem: (req, res) => {
        
        var { trxId, username, productId, nama, image, qty, harga } = req.body;
        var newDetail = {
            trxId,
            username,
            productId,
            nama,
            image,
            qty,
            harga
        }
        var sql = `INSERT INTO trxdetail SET ?;`;
        conn.query(sql, newDetail, (err, result) => {
            if(err) {
                console.log(err.message);
                return res.status(500).json({ 
                    message: "trxDetail failed.", 
                    error: err.message });
            }
            res.send(result);
            console.log('trxdetail')
        })
    },

    historyDetail: (req,res) => {
        var sql = `select * from trxdetail where trxId = ${req.params.trxId};`;
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log(sql);
            console.log(result)
            res.send(result);
        })
    },

    productDetail: (req,res) => {
        var productId = req.params.productId;
        var sql = `select * from product where id = '${productId}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            // console.log(results);
            
            res.send(results);
        })   
    },

    addPayment: (req,res) => {
        try {
            const path = '/transaction/images'; //file save path
            const upload = uploader(path, 'RCP').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ 
                        message: 'Upload picture failed !', 
                        error: err.message });
                }
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                // req.body.data.payDate = new Date();
                console.log(data)
                data.image = imagePath;
                
                var sql = 'INSERT INTO payment SET ?';
                conn.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ 
                            message: "There's an error on the server. Please contact the administrator.", 
                            error: err.message });
                    }
                   
                    console.log(results);
                    sql = 'SELECT * from payment;';
                    conn.query(sql, (err, results) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results);
                        res.send(results);
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({
                 message: "There's an error on the server. Please contact the administrator.", 
                 error: err.message });
        }
    },

    getListPayment: (req, res) => {
                var sql = `SELECT t.trxId, t.username, t.trxDate, t.totalPrice, t.totalQty, t.status, p.payDate, p.image 
                FROM transaction t
                LEFT JOIN payment p
                ON t.trxId = p.trxId
                WHERE t.username = '${req.body.username}'
                AND t.status = 'Not Payment'
                    AND p.image IS NULL 
                    ORDER BY trxId;`
              
        conn.query(sql, (err, result) => {
            if(err) throw err;
            console.log("masuk");
            console.log(result)
            res.send(result);
        })
    },



verify: (req, res) => {
    var sql = `SELECT t.trxId, t.username, t.trxDate, t.totalPrice, t.totalQty, t.status, p.payDate, p.image 
    FROM transaction t
    LEFT JOIN  payment p
    ON p.trxId = t.trxId
    WHERE p.image IS NOT NULL 
    AND t.status = 'Not Payment'
    ORDER BY payDate;`
                
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log(sql);
        console.log(result)
        res.send(result);
    })
}, 
approvePayment: (req, res) => {
    var sql = `UPDATE transaction SET status = 'Paid' WHERE trxId = ${req.body.trxId};`;
    conn.query(sql, (err, result) => {
        if(err) throw err;
        // console.log(sql);
        // console.log(result)
        res.send(result);
    })
},

// totalSales: (req,res) => {
//     var sql = `select sum(totalPrice) from transaction WHERE status ='Paid';`;
//     conn.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(sql);
//         console.log(result)
//         res.send(result);
//     })
// },

getListSales: (req,res) => {
    var sql = `select * from transaction where status = 'Paid'`;
    conn.query(sql, (err, results) => {
        if(err) throw err;            
        res.send(results);
    })   
},
getListHistory: (req, res) => {
    var sql = `SELECT t.trxId, t.username, t.trxDate, t.totalPrice, t.totalQty, t.status, p.payDate, p.image 
    FROM transaction t
    LEFT JOIN  payment p
    ON p.trxId = t.trxId
    WHERE t.status = 'Paid'
    ORDER BY payDate;`
  
                
    conn.query(sql, (err, result) => {
        if(err) throw err;
        console.log(sql);
        console.log(result)
        res.send(result);
    })
},


}

