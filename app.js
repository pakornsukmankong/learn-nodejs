const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const router = require('./routes/myRouter')

const app = express()

//แสดง dinamic webpage
app.set('views',path.join(__dirname,'views')) //อ้างอิงตำแหน่งtemplate
app.set('view engine','ejs') //ระบุรูปแบบengine เป็น ejs (เวลาเรียกใช้ไฟล์จะได้ไม่ต้องมี.ejsข้างหลังไฟลฺ์)
app.use(express.urlencoded({extended:false})); //ทำให้สามารถเห็นข้อมูลที่ส่งมาใน method post ใน console.log

app.use(cookieParser()) //ใช้ระบบ cookie parser

app.use(session({
    secret:"mySession",
    resave:false,
    saveUninitialized:false
}))

app.use(router)

//แสดง static webpage
app.use(express.static(path.join(__dirname,'public')))

const PORT = 8080
app.listen(PORT,()=>{
    console.log(`This server run in ${PORT}`)
})