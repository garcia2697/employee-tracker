const mysql = require('mysql2')

require('dotenv').config()


const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    // your MySQL password
    password:process.env.DB_PASSWORD,
    database:'employees'
    
})

db.connect(err=>{
    if(err) throw err
    console.log('Successfully connected to database')
})

module.exports=db;