/* Tracker client code */

function login(){
	var xhr=new XMLHttpRequest();
	xhr.open("GET","/uuid");
	xhr.addEventListener("load",function(){
		sessionStorage.__fliuvaSession=xhr.responseText;
	});
	xhr.send();
}

function sendEvent(category,subcategory,name,description,data){
	var xhr=new XMLHttpRequest();
	var url="/collect"+
	"?CATEGORY="+category+
	"&SUBCATEGORY="+subcategory+
	"&NAME"+name+
	"&DESCRIPTION"+description+
	"&DATA"+data+
	"&SESSION"+sessionStorage.__fliuvaSession;
	xhr.open("GET",url);
	xhr.send();
}
