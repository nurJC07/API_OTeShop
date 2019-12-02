const conn = require('../database')
var fs = require('fs');
var { uploader } = require('../helpers/uploader')


module.exports = {
    getListProduct: (req,res) => {
        var sql = 'SELECT * from product;';
        conn.query(sql, (err, results) => {
            if(err) throw err;            
            res.send(results);
        })   
    },

    getProduct: (req,res) => {
        var sql = `select p.id, p.nama, p.harga, p.description, p.image, c.namaCategory 
        from product p
        join category c
        on p.categoryId = c.id;`
        conn.query(sql, (err, results) => {
            if(err) throw err;            
            res.send(results);
        })
    },

    getProductbyCategory: (req,res) => {
        var categoryId = req.params.id
        var sql = `select p.id, p.nama, p.harga, p.description, p.image, c.namaCategory 
        from product p
        join category c
        on p.categoryId = c.id
        where c.id = ${categoryId}`
        conn.query(sql, (err, results) => {
            if(err) throw err;            
            res.send(results);
        })
    },

    addProduct: (req,res) => {
        try {
            const path = '/brand/images'; //file save path
            const upload = uploader(path, 'PRD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                const { image } = req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
    
                console.log(req.body.data)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.image = imagePath;
                
                var sql = 'INSERT INTO product SET ?';
                conn.query(sql, data, (err, results) => {
                    if(err) {
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                   
                    console.log(results);
                    sql =  `select * from product order by id Desc`;
                    conn.query(sql, (err, results1) => {
                        if(err) {
                            console.log(err.message);
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        }
                        console.log(results1);
                        res.send(results1);
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    
    editProduct : (req,res) => {
        console.log("edit")
        var productId = req.params.id;
        console.log(req.params.id)
        // console.log(req.body)
        var sql = `SELECT * from product where id = ${productId};`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
            console.log(results)

            if(results.length > 0) {
                const path = '/brand/images'; //file save path
                const upload = uploader(path, 'PRD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ 
                        message: 'Upload brand picture failed !', 
                        error: err.message });
                }
    
                const { image } = req.files;
                const imagePath = image ? path + '/' + image[0].filename : null;
                const data = JSON.parse(req.body.data);
                data.image = imagePath;
                console.log(data)
    
            try {
                if(imagePath) {
                sql = `Update product set ? where id = ${productId};`
                conn.query(sql,data, (err1,results1) => {
                if(err1) {
                fs.unlinkSync('./public' + imagePath);
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err1.message });
                }
                fs.unlinkSync('./public' + results[0].image);
                sql = `Select * from product;`;
                conn.query(sql, (err2,results2) => {
                if(err2) {
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err2.message });
                    }
                    res.send(results2);
                    console.log('update product')})
                    })
                    
                    }
                else {
                    sql = `Update product set  nama="${data.nama}", harga=${data.harga}, description="${data.description}",
                    namaCategory="${data.namaCategory}" where id = ${req.params.id};`
                    conn.query(sql, (err1,results2) => {
                    if(err1) {
                        return res.status(500).json({ 
                            message: "There's an error on the server. Please contact the administrator.", 
                            error: err1.message });
                            }
                            sql = `select * from product order by id`;
                                conn.query(sql, (err2,results2) => {
                                    if(err2) {
                                        return res.status(500).json({ 
                                            message: "There's an error on the server. Please contact the administrator.", 
                                            error: err2.message });
                                    }
                                    console.log('product diupdate')
                                    res.send(results2);
                                })
                            })
                        }
                    }
                    catch(err){
                        console.log(err.message)
                        return res.status(500).json({ 
                            message: "There's an error on the server. Please contact the administrator.", 
                            error: err.message });
                    }
                })
            }
        })
    },




    deleteProduct : (req,res) => {
        var productId = req.params.id;
        var sql = `SELECT * from product where id = ${productId};`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
            
            if(results.length > 0) {
                sql = `DELETE from product where id = ${productId};`
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                    }
    
                    fs.unlinkSync('./public' + results[0].image);
                    sql = `SELECT * from product`;
                    conn.query(sql, (err2,results2) => {
                        if(err2) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err2.message });
                        }
    
                        res.send(results2);
                    })
                })
            }
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
    }
    
    }