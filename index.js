// // console.log("hello world eberthjjk")
// // const http=require("http")
// import http from "http"
// // const gf=require("./feature")
// import gf from "./feature.js"
// import fs from "fs"
// import path from "path"
// const home=fs.readFileSync("./index.html")
// console.log(path.dirname("/home/index.js"))
// const app=http.createapp((req,res)=>{
//     // console.log("appd")
//     // console.log(req.url)
//     // res.end("<h1>Noice</h1>")
//     console.log(req.method);
//     if(req.url==="/about"){
//         res.end("<h1>About page</h1>")
//     }
//   else  if(req.url==="/"){
//         res.end(home)
//     }
//    else if(req.url==="/contact"){
//         res.end("<h1>contact page</h1>")
//     }
//     else{
//         res.end("invalid page")
//     }
// })
// app.listen(5000,()=>{
// console.log("start servser")
// })
// XPathExpression.js =========================================================
import express from "express";
import mongoose  from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
// import fs from "fs"
import path from "path"
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true",{
    dbName:"backened"
}).then(()=>{
    console.log("connect")
}).catch((e)=>{
console.log(e)
})
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const users=mongoose.model("users",userSchema)

const app=express();
const user=[]
// static serve file
app.use(express.static(path.join(path.resolve(),"public")))
// middelwares 
app.use(express.urlencoded({extended:true}))
// setting up view engine
app.set("view engine","ejs")
// use cookie parse 
app.use(cookieParser())
const auth=async(req,res,next)=>{
    // y middelware hai 
const {token}=req.cookies;
if(token){
    const jt=jwt.verify(token,"gjhggyiggghuu")
    // console.log(jt)
    req.use=await users.findById(jt._id)
    next()
}
else{
    res.redirect("/login")
}
}
app.get("/",auth,(req,res)=>{
    // console.log(req.use)
   
    res.render("logout",{name:req.use.name})
   })
   app.get("/login",(req,res)=>{
    res.render("login")
    })
app.get("/register",(req,res)=>{
res.render("register")
})
app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.redirect("/")
})
app.post("/login",async(req,res)=>{
const {email,password}=req.body;
let user =await users.findOne({email})
console.log(user)
if(!user){
   return  res.redirect("/register")
}
console.log(req.body.password)
// const xmatch = user.password===password;
const xmatch=await bcrypt.compare(password,user.password)
if(!xmatch){
    // return res.render("login",{message:"incorect password"})
     res.send("incorrectb password")
}
const token =jwt.sign({_id:user._id},"gjhggyiggghuu")
// console.log(token)
// console.log(req.body)
res.cookie("token",token,{
    httpOnly:true,
    expires:new Date(Date.now()+60*1000)
})
res.redirect("/")
})
app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    console.log(email)
    let man=await users.findOne({email})
    if(man){
        // return console.log("register first ")
     return   res.redirect("/login")
    }
    const haspass= await bcrypt.hash(password,10)
    const user=  await users.create({name:req.body.name,email:req.body.email,password:haspass})
    // console.log(user._id)
    const token =jwt.sign({_id:user._id},"gjhggyiggghuu")
    // console.log(token)
    // console.log(req.body)
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    })
    res.redirect("/")
})


app.listen(5000,()=>{
    console.log("app is working")
})