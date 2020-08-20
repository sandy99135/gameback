'use strict'
const mongoose=require('mongoose')
let Schema=mongoose.Schema
let userSchema=new mongoose.Schema({
	nom:{type:String,require:true},
	prenom:String,
	pseudo:String,
	email:String,
	birthday:Date,
	password:String,
	password_confirm:String,
	country:String,
	image:{data:Buffer},
	Video:Array,
	abonnement:Array,
	solde:Number,
	jeux:Array,
	amis:Array,
	online:Boolean

})
var userModele=mongoose.model("user",userSchema)
module.exports=userModele;