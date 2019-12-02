const conn = require('../database');
var fs = require('fs');
var { uploader } = require('../helpers/uploader')

module.exports = {
    getListCategory: (req,res) => {
        var sql = 'SELECT * FROM category order by id;';
        conn.query(sql, (err, results) => {
            if(err) throw err;
            res.send(results);
        })   
    },


addCategory: (req,res) => {
    try {
        const path = '/category/images'; //file save path
        const upload = uploader(path, 'PRD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

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
            console.log(data)
            data.image = imagePath;
            
            var sql = `INSERT INTO category SET ?`;
            conn.query(sql, data, (err, results) => {
                if(err) {
                    console.log(err.message)
                    fs.unlinkSync('./public' + imagePath);
                    return res.status(500).json({ 
                        message: "There's an error on the server. Please contact the administrator.", 
                        error: err.message });
                }
               
                console.log(results);
                sql = 'SELECT * from category;';
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

editCategory : (req,res) => {
    console.log("masuk")
    var categoryId = req.params.id;
    console.log(req.params.id)
    // console.log(req.body)
    var sql = `SELECT * from category where id = ${categoryId};`;
    conn.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        if(results.length > 0) {
            const path = '/category/images'; //file save path
            const upload = uploader(path, 'PRD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

        upload(req, res, (err) => {
            if(err){
                return res.status(500).json({ 
                    message: 'Upload category picture failed !', 
                    error: err.message });
            }

            const { image } = req.files;
            const imagePath = image ? path + '/' + image[0].filename : null;
            const data = JSON.parse(req.body.data);
            data.image = imagePath;
            console.log(data)

        try {
            if(imagePath) {
            sql = `Update category set ? where id = ${categoryId};`
            conn.query(sql,data, (err1,results1) => {
            if(err1) {
            fs.unlinkSync('./public' + imagePath);
            return res.status(500).json({ 
                message: "There's an error on the server. Please contact the administrator.", 
                error: err1.message });
            }
            fs.unlinkSync('./public' + results[0].image);
            sql = `Select * from category;`;
            conn.query(sql, (err2,results2) => {
            if(err2) {
            return res.status(500).json({ 
                message: "There's an error on the server. Please contact the administrator.", 
                error: err2.message });
                }
                res.send(results2);
                console.log('masuk')})
                })
                }
            else {
                sql = `Update category set namaCategory="${data.namaCategory}" where id = ${categoryId};`
                conn.query(sql, (err1,results1) => {
                if(err1) {
                    return res.status(500).json({ 
                        message: "There's an error on the server. Please contact the administrator.", 
                        error: err1.message });
                        }
                        sql = `select * from category order by id`;
                            conn.query(sql, (err2,results2) => {
                                if(err2) {
                                    return res.status(500).json({ 
                                        message: "There's an error on the server. Please contact the administrator.", 
                                        error: err2.message });
                                }
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

deleteCategory : (req,res) => {
    var categoryId = req.params.id;
    var sql = `SELECT * from category where id = ${categoryId};`;
    conn.query(sql, (err, results) => {
        if(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
        
        if(results.length > 0) {
            sql = `DELETE from category where id = ${categoryId};`
            conn.query(sql, (err1,results1) => {
                if(err1) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                }

                fs.unlinkSync('./public' + results[0].image);
                sql = `delete from product where id = ${categoryId}`;
                conn.query(sql, (err2,results2) => {
                    if(err2) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err2.message });
                    }

                    res.send(results2);
                })
            })
        }
    })   

}

}