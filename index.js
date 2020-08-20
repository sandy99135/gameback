'use strict'
let express =require('express');
let app=express()
let mongoose=require("mongoose")
let cors=require('cors')
const bodyParser=require("body-parser")
let cookieParser=require('cookie-parser')
const port=8000||process.env.PORT
let url="mongodb://localhost:27017/db"
let controller=require('./controller/controller')
console.log()
const protectedRoute=require("./route/dashboard.route")
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},function(err){
	if(err){
		console.log(err)
		throw err
	}
	console.log('connected on :',url)
})
app.use(express.static("public"))
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/checktoken",controller.verifyToken,protectedRoute)
app.get('/',function(req,res){
  res.sendFile(__dirname + '/public/index.html');
 
});
app.get('/image/:_id',controller.lireImage)
app.get('/logout',controller.logout)
app.get('/loginGmail',controller.loginGmail)
app.get('/auth/google/callback',controller.validationGmail)
app.post('/register',controller.register)
app.post("/upload",controller.upload.single("file"),controller.uploadFile)
app.post("/modifier/:_id",controller.uploadDefinitive.single("image"),controller.modifierProfile)
app.post('/login',controller.login)
app.get ('/user/:_id',controller.getUserById)
app.listen(port,function(){
	console.log(`server listen on ${port}`)
})
