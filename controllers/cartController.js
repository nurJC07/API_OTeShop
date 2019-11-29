const conn = require('../database')

module.exports = {
    getListCart: (req,res) => {
        var sql = `select c.id, p.id as productId, p.nama, p.harga, p.image, c.qty
        from product p
        join cart c
        on c.productId = p.id
        where c.username = '${req.query.username}';`;
        conn.query(sql, (err, results) => {
            if(err) throw err;            
            res.send(results);
        })   
    },

    addCart: (req,res) => {
        try {             
            var newCart = {
                username: req.body.username,
                productId: req.body.productId,
                nama: req.body.nama,
                harga: req.body.harga,
                image: req.body.image,
                qty: req.body.qty
                }
            var sql = 'insert into cart set ?;'
            conn.query(sql, newCart, (err, result) => {
                if (err) throw err;
                console.log(result); 
                res.send("masuk");
            })
           
        } catch(err) {
            return res.status(500).json({ 
                message: "There's an error on the server. Please contact the administrator.", 
                error: err.message 
            });
        }
        },
    
    editCart : (req,res) => {
        var cartId = req.params.id;
        var sql = `select * from cart where id = '${cartId}';`;
        
        conn.query(sql, (err, results) => {
            if(err) throw err;
            if(results.length > 0) {
            try {
                console.log(req.body.qty)
                var sql = `Update cart set qty=${req.body.qty} where id = ${cartId}`;
                conn.query(sql, (err1,result1) => {
                    if(err1) throw err;
                    res.send(result1)
                    console.log('masuk')
                })
            } catch(err) {
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err.message 
                });
            }
            }}
            )
        },

    deleteCart : (req,res) => {
        var cartId = req.params.id;
        var sql = `select * from cart where id = '${cartId}';`
        conn.query(sql, (err, results) => {
            if(err) throw err;
            if(results.length > 0) {
            try {
                var sql = `Delete from cart where id = ${cartId}`;
                conn.query(sql,(err1,result1) => {
                    if(err1) throw err;
                    // res.send(results)
                    sql = `select * from cart;`
                    conn.query(sql, (err2,results2) => {
                    if(err2) throw err;
                    res.send(results2)
                    })
                }) 
            }
            catch(err) {
            return res.status(500).json({ 
                message: "There's an error on the server. Please contact the administrator.", 
                error: err.message 
            });
        }
    }}
)
},
clearCart: (req, res) => {
    var sql = `DELETE FROM cart WHERE username = '${req.params.username}';`;

    conn.query(sql, (err, result) => {
        if(err) throw err;
      
        res.send("cart berhasil didelete");
    })
},
    }