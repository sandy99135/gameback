
// function getXMLHttpRequest() {
// var xhr = null;
// if (window.XMLHttpRequest || window.ActiveXObject) {
// if (window.ActiveXObject) {
// try {
// xhr = new ActiveXObject("Msxml2.XMLHTTP");
// } catch(e) {
// xhr = new ActiveXObject("Microsoft.XMLHTTP");
// }
// } else {
// xhr = new XMLHttpRequest();
// }
// } else {
// alert("Navigateur ne supporte pas XMLHTTPRequest...");
// return null;
// }
// return xhr;
// }
// var xhr= new getXMLHttpRequest() 
// function request(callback){
// 	xhr.onreadystatechange=function(result){
// 		if(xhr.readystate==4 && (xhr.status==200||xhr.status==0)){
// 			callback(xhr.responseText)
// 		}
// 	}
// 	xhr.open("GET" , "http://localhost:8000", true);
// 	xhr.send(null);
// 	// alert(xhr.responseText)
// }
// function afficher(data){
// 	alert(data)
// }
// request(afficher)
