var mongoose=require("mongoose")
var Schema=mongoose.Schema
var fileSchema=new Schema({
	file:{data:Buffer,contentType:String}
})
module.exports=mongoose.model("file",fileSchema)