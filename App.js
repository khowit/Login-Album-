var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secrete = 'secrete key';
 
app.use(cors())

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password:'password',
  database: 'dbname'
});

app.post('/register', jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        connection.execute(
            'INSERT INTO users (email,password,fname,lname) VALUES (?,?,?,?)',
            [req.body.email,hash,req.body.fname,req.body.lname],
            function(err, results, fields) {
             if(err) {
                res.json({status:'Error' , message:err})
                return
             }
             res.json({status:'ok'})
            }
        );        
    });
})

app.post('/login', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE email=?',
        [req.body.email],
        function(err, users, fields) {
            if(err) {res.json({status:'Error' , message:err}); return}
            if(users.length == 0) {res.json({status:'Error' , message:'No user found'}); return}
            bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
                if(isLogin){
                    var token = jwt.sign({ email: users[0].email }, secrete, { expiresIn: '1h' });
                    res.json({status:'ok', message:'Login Success',token})
                }else{
                    res.json({status:'Error', message:'Login failed'})
                }                
            });
        }
    );        
})

app.post('/authen', jsonParser, function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secrete);
        res.json({status:'ok', decoded})
    } catch (err) {
        res.json({status:'Error', message: err.message})
    }
    
})
 
app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})