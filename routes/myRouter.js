//จัดการ Routing
const express = require('express')
const router = express.Router()
//เรียกใช้งาน model
const Product = require('../models/products')
//อัพโหลดไฟล์
const multer = require('multer')
const FileAppender = require('multer/lib/file-appender')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/products') //ตำแหน่งการจัดเก็บไฟล์
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg") //เปลี่ยนชื่อไฟล์ไม่ให้ซ้ำกัน
    }
})

//เริ่มต้นอัพโหลด
const upload = multer({
    storage:storage
})

router.get('/',(req,res) => { 
    Product.find().exec((err,doc)=>{ //ดึงข้อมูลจาก database มาแสดงผล
        res.render('index.ejs',{products:doc})
    }) 
})

router.get('/delete/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id,{useFindAndModify:false}).exec(err=>{
        if(err) console.log(err)
        res.redirect('/manage')
    })
})

router.get('/addProduct',(req,res)=>{
    // use cookie
    // if (req.cookies.login) {
    //     res.render('form.ejs')
    // }else {
    //     res.render('admin.ejs')
    // }

    //use session
    if (req.session.login) {
        res.render('form.ejs')
    }else {
        res.render('admin.ejs')
    }
})

router.get('/manage',(req,res)=>{
    // use cookie
    // if(req.cookies.login) {
    //     Product.find().exec((err,doc)=>{ //ดึงข้อมูลจาก database มาแสดงผล
    //         res.render('manage.ejs',{products:doc})
    //     })
    // }else {
    //     res.render('admin.ejs')
    // }

    //use session
    if(req.session.login) {
        Product.find().exec((err,doc)=>{ //ดึงข้อมูลจาก database มาแสดงผล
            res.render('manage.ejs',{products:doc})
        })
    }else {
        res.render('admin.ejs')
    }
})

//ออกจากระบบ
router.get('/logout',(req,res)=>{
    //use coolie
    // res.clearCookie('username')
    // res.clearCookie('password')
    // res.clearCookie('login')
    // res.redirect('/manage')

    //use session
    req.session.destroy((err)=>{
        res.redirect('/manage')
    })
})

router.post('/insert',upload.single("image"),(req,res)=>{
    let data = new Product({
        name:req.body.name,
        price:req.body.price,
        image:req.file.filename,
        description:req.body.description
    })
    Product.saveProduct(data,(err)=>{ ///ฟังชั้น save data ไปยัง database
        if(err) console.log(err)
        res.redirect('/') //กลับไปหน้าแรก
    })
})

router.get('/:id',(req,res)=>{
    const product_id = req.params.id
    Product.findOne({_id:product_id}).exec((err,doc)=>{
        res.render('product.ejs',{product:doc})
    })
})

router.post('/edit',(req,res)=>{
    const edit_id = req.body.edit_id
    Product.findOne({_id:edit_id}).exec((err,doc)=>{
        res.render('edit.ejs',{product:doc})
    })
})

router.post('/update',(req,res)=>{
    const update_id = req.body.update_id
    let data = {
        name:req.body.name,
        price:req.body.price,
        description:req.body.description
    }

    Product.findByIdAndUpdate(update_id,data,{useFindAndModify:false}).exec(err=>{
        if (err) console.log(err)
        res.redirect('/manage')
    })
})

router.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const timeExpire = 30000 // 30 วินาที

    if (username === "admin" && password === "123") {
        // //สร่าง cookie
        // res.cookie('username',username,{maxAge:timeExpire})
        // res.cookie('password',password,{maxAge:timeExpire})
        // res.cookie('login',true,{maxAge:timeExpire}) //true => login เข้าสู่ระบบ
        //สร้าง session
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge = timeExpire
        res.redirect('/manage')
    }else {
        res.render('404.ejs')
    }
})

module.exports = router