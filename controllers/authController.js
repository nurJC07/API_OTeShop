const Crypto = require('crypto')
const conn = require('../database')
const transporter = require('../helpers/senderemail')

module.exports = {
    login : (req,res) => {
        var { username, password } = req.body;
        var hashPassword = Crypto.createHmac('sha256', 'abc123').update(`${password}`).digest('hex');
        var sql = `select * from users where username='${username}' and password='${hashPassword}'`;
        conn.query(sql, (err,results)=> {
                var dataLogin = { 
                    lastlogin: new Date()
                }
                sql = `update users set ? where username='${username}'`;
                conn.query(sql, dataLogin, (err, results1) => {
                    if(err) throw err
                    console.log(results1)
                  
                })

    
            res.send(results);
        })
    },
    keeplogin: (req,res) => {
        var sql = `select * from users where username='${req.body.username}';`
        conn.query(sql, (err, results) => {
            if (err) throw err;
            console.log("masuk keeplogin")
            console.log(results)
            res.send(results)
        })},

    register: (req,res) => {
        var {username, password, email, phone} = req.body;
        var sql = `select username from users where username='${username}'`
        conn.query(sql, (err,results) => {
            if(err){
                throw err
            }
            if(results.length > 0){
                res.send({status: 'error', message: 'Username has been taken!'})
            }
            else {
                var hashPassword = Crypto.createHmac('sha256', 'abc123').update(password).digest('hex');
                var dataUser = {
                    username,
                    password: hashPassword,
                    email,
                    phone,
                    role: 'User',
                    status: 'Unverified',
                    lastlogin: new Date()
                }
                sql = `insert into users set ?`;
                conn.query(sql, dataUser, (err1, res1) => {
                    if(err1) {
                        throw err1
                    }
                    res.send({
                        username
                    })
                    var linkverification = `http://localhost:3000/verified?username=${username}&password=${hashPassword}`;
                    var mailOption = {
                        from: 'Ote Shop <myjejakaki@gmail.com>',
                        to: email,
                        subject: 'Verifikasi Email',
                        html: 
                        `<h3>Hi ${username}</h3>, 
                        <p>Your user account with the e-mail address ${email} has been created </p> 
                        <br/>
                        <p>Please follow the link below to activate your account.: <a href="${linkverification}">Click here!</a></p>`
                    }
                    transporter.sendMail(mailOption, (err2, res2) => {
                        if(err2) {
                            console.log(err2)
                            throw err2
                        }
                        else {
                            res.send('Success')
                            res.send({username, email, password, role:'User', status:'Unverified'})
                        }
                    })
                })
            }
        })
    },
    verified:(req,res)=>{
        var {username, password} = req.body
        var sql = `SELECT * from users 
                WHERE username='${username}'
                and password='${password}'`;
        conn.query(sql,(err,results) => {
            if(err) 
                throw err
                if(results.length > 0) {
                    sql = `UPDATE users set status='Verified' WHERE id =${results[0].id}`;
                    conn.query(sql,(err1,results1) => {
                if(err1) throw err1;
                    res.send({
                    username,
                    email: results[0].email,
                    role: results[0].role,
                    status: 'Verified',
                    })
                    })
                }
                else {
                    throw 'User not exist!'
                }
        })
    },
    getuserList: (req,res) => {
        var sql = `select * from users`
    conn.query(sql, (err,results) => {
        if(err) throw err;
        res.send(results);
    })

}

    }