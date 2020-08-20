function ValiderRegister(nom,prenom,pseudo,email,birthday,password,password_confirm){
	let error={}
	let count=0

	if(nom.length==0){
		count+=1
		error.nom= "nom  est obligatoire"
	}
	if(prenom.length==0){
		count+=1
		error.prenom= "prenom  est obligatoire"
	}
	if(pseudo.length==0){
		count+=1
		error.pseudo=  "pseudo est obligatoire"
	}
	if(email.length==0){
		count+=1
		error.email= "email  est obligatoire"
	}
	if(birthday.length==0){
		count+=1
		error.birthday= "birthday  est obligatoire"
	}
	if(password.length==0){
		count+=1
		error.password= "password  est obligatoire"
	}
	if(password.length<6){
		count+=1
		error.password= "password  doit contenir au moins 6 caractères"
	}
	if(password!==password_confirm){
		count+=1
		error.password_confirm= "les 2 mots de passe doivent être identiqueq"
	}
	if(count>0){
		return {error:error};
		
	}
	else{
		return null
	}
	
}
module.exports=ValiderRegister