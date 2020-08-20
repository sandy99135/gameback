'use strict'
let User=require('../modele/user.modele')
let ValiderRegister=require("../validator.register")
let ValiderLogin=require("../validator.login")
let jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
var LocalStorage = require('node-localstorage').LocalStorage;
 let localStorage = new LocalStorage('./scratch');
const { google } = require('googleapis');
const OAuth2Data = require('../google_key.json')
const CLIENT_ID = OAuth2Data.client_id;
const CLIENT_SECRET = OAuth2Data.client_secret;
const REDIRECT_URL = OAuth2Data.redirect_uris
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
let multer=require("multer")
let File=require("../modele/file.modele")
let fs=require("fs")
let MongoClient=require("mongodb").MongoClient
var storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'public/upload/profile')
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
});
var storageDefinitive=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'public/upload/profileDefinitive')
	},
	filename:function(req,file,cb){
		cb(null,file.originalname)
	}
});
exports.upload=multer({storage:storage})
exports.uploadDefinitive=multer({storage:storageDefinitive})
exports.uploadFile=(req,res,next)=>{
	const file=req.file
	if(!file){
		const error=new Error('Please upload a file')
		error.httpStatusCode=400
		return next(error)
	}
	var img =fs.readFileSync(req.file.path)
	var encode_image=img.toString("base64")
	const finalimage=new File({
		file:{data:new Buffer(encode_image,"base64"),contentType:"image/jpg"}
	})
	finalimage.save().then(file=>{
		console.log(file._id)
		res.send(file._id)
	})
	

}
exports.lireImage=(req,res)=>{
	File.findOne({'_id':req.params._id}).then(image=>{
		res.contentType("image/jpg"||"image/png");
		console.log(image.file.data)
		res.send(image.file.data)
	}).catch(error=>res.send(error))
}
exports.modifierProfile=async (req,res)=>{
	const file=req.file

	if(!file){
		const error=new Error('Please upload a file')
		error.httpStatusCode=400
		return next(error)
	}else{
		try{
			var img =fs.readFileSync(req.file.path)
	var encode_image=img.toString("base64")
	const updateUser={
		nom:req.body.nom,
		prenom:req.body.prenom,
		pseudo:req.body.pseudo,
		email:req.body.email,
		birthday:req.body.birthday,
		// image:{data:new Buffer(encode_image,"base64"),contentType:"image/jpg"}
	}
	console.log(req.params._id)
	
		 User.findOneAndUpdate({"_id":req.params._id},updateUser,(user)=>{
		 	
		 	console.log(user)
		 })
	
	

	
		}catch(error){
			throw error
		}
	
	}
	
	
}
// exports.supprimerImage=(req,res)=>{
// 	File.findByIdAndDelete(req.params._id).then(file=>{
// 		fs
// 	}
// }
exports.register= async function(req,res){
	// const bcrypt=require('bcrypt')
	// const salt=bcrypt.genSalt(10)
	var img =fs.readFileSync("./public/Desert.jpg")
	var encode_image=img.toString("base64")
	let user=new User({
		nom:req.body.nom,
		prenom:req.body.prenom,
		pseudo:req.body.pseudo,
		email:req.body.email,
		birthday:req.body.birthday,
		password:req.body.password,
		password_confirm:req.body.password_confirm,
		image:{data:new Buffer(encode_image,"base64")},
		video:[],
		jeux:[],
		abonnement:[],
		amis:[],
		solde:0,
		online:false

	})
	try{
		let use= await User.findOne({pseudo:req.body.pseudo})
		// User.findOne({pseudo:req.body.pseudo}).then( use=>{
		if(use){
			res.json({
				error:{disponibilité:" ce pseudo n' est plus disponible"}
			})
		}
		else{
			let use2= await User.findOne({email:req.body.email})
			if(use2){
				res.json({
					error:{disponibilité:" cet mail est déjà associée à un compte"}
				})
			}
			else{
				let validation=ValiderRegister(req.body.nom,req.body.prenom,req.body.pseudo,req.body.email,req.body.birthday,req.body.password,req.body.password_confirm)
				console.log(validation)
				if(validation!==null){
					res.send(validation)
					console.log(validation)
				}else{
					let salt= await bcrypt.genSalt(10)
					let hash= await bcrypt.hash(req.body.password,salt)
					
							user.password=hash
							user.save().then(result=>res.status(200).json({
								data:result,
								error:null
							}))
						
					
				}
			}
			
		}
	// })
}catch(error){
	throw error
}

	
	
}

exports.login= async  (req,res)=>{
let  loginvalidation = ValiderLogin(req.body.pseudo,req.body.password)
if(loginvalidation!==null){
	res.send(loginvalidation)
}else{
	try{
		let user = await User.findOne({pseudo:req.body.pseudo})
		if(!user){
			res.json({error:"cet utilisateur n'existe pas "})
		}else{
			let isMatch=  await bcrypt.compare(req.body.password,user.password)
			// .then(isMatch=>{
				if(!isMatch){
					console.log(isMatch)
					res.json({error:"mot de passe incorrecte"})
				}
				else{
					console.log(isMatch)
					console.log(process.env.TOKEN_SECRET)

					const payload={
						pseudo:user.pseudo,
						_id:user._id
					}
					const token=jwt.sign(payload,'secret')
					localStorage.setItem('token',token)
					localStorage.setItem('_id',user._id)
					localStorage.setItem('nom',user.pseudo)
					console.log(localStorage.getItem('token'))
					res.cookie("auth-token",token).json({
								error:null,
								data:{token},
								_id:user._id,
								pseudo:user.pseudo
							})

				 User.findOneAndUpdate({_id:user._id},{online:true}).then(userConnected=>{
				 	console.log(userConnected)
				 })
				
				}
			// })
		} 
		

	}catch(error){
			throw error
		}
	    
	
	
  }
}
exports.logout=(req,res)=>{
	localStorage.removeItem("token")
	 User.findOneAndUpdate({_id:localStorage.getItem("_id")},{online:false}).then(userDeconnected=>{
				 	res.send(userDeconnected)
	})
}

exports.verifyToken=(req,res,next)=>{
	
	const token= localStorage.getItem('token');
	console.log(token)
	if(!token){
		return res.status(401).json({error:"access denied"})

	}
	try{
		const verified=jwt.verify(token,"secret")
		req.user=verified
		next()
	}catch(error){
		res.status(400).json({error:"token is not valid"})
	}
}
exports.loginGmail=(req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
        });
        console.log(url)
        res.redirect(url);
    } else {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        gmail.users.labels.list({
            userId: 'me',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const labels = res.data.labels;
            if (labels.length) {
                console.log('Labels:');
                labels.forEach((label) => {
                    console.log(`- ${label.name}`);
                });
            } else {
                console.log('No labels found.');
            }
        });
        res.send('Logged in')
    }
}
exports.validationGmail=function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                authed = true;
                res.redirect('/')
            }
        });
    }
}
exports.getUserById=(req,res)=>{
User.findById(req.params._id).then(user=>res.status(200).json(user)).catch(error=>res.status(500).json(error))
}