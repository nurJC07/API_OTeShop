const express = require('express');
const path = require ('path')
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 2020;

var app = express({defaultErrorHandler:false}); //Kirim error gak pake throw

app.use(cors());//Supaya API bisa diakses oleh front end
app.use(bodyParser.urlencoded({extended:false})); //Biar dari front end bisa kirim image
app.use(bodyParser.json());//Untuk menerima json melalui req.body
app.use(express.static('public')); //Untuk akses folder public




app.get('/', (req,res) => {
    res.send('<h3>Selamat Datang di API Purwadhikastore, dibuat menggunakan Node.js dengan database MySQL.</h3>');
});

// app.get('*', (req,res) => {
//     res.sendFile(path.join(publicPath, 'index.html'))
// })

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname,"client","build","index.html"));
//   });

// express().use(express.static(path.join(__dirname, 'public')))
// 	.set('views', path.join(__dirname, 'views'))
// 	.set('view engine', 'ejs')
// 	.get('/', (req, res) => res.render('pages/index'))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

const { 
    authRouter,
    productRouter,
    categoryRouter,
    cartRouter,
    transactionRouter,
} = require('./routers') // untuk route authcontoller

app.use ('/auth', authRouter)
app.use('/product', productRouter)
app.use('/category', categoryRouter)
app.use('/cart', cartRouter)
app.use('/transaction', transactionRouter)

app.listen(PORT, () => console.log('Node is running, API active at port: ' + PORT));