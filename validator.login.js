function ValiderLogin(pseudo,password){
	let error={}
	let count=0

	
	if(pseudo.length==0){
		count+=1
		error.pseudo=  "pseudo est obligatoire"
	}
	
	if(password.length==0){
		count+=1
		error.password= "password  est obligatoire"
	}

	if(count>0){
		return error;
		
	}
	else{
		return null
	}
	
}
module.exports=ValiderLogin