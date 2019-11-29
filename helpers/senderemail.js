const nodemailer = require ('nodemailer');

var transporter = nodemailer.createTransport ({
    service:'gmail',
    auth : {
        user : 'myjejakaki@gmail.com',
        pass : 'lgwpvhxqbwhxwmaf'
    },
    tls: { 
        rejectUnauthorized: false
    }
})

module.exports = transporter