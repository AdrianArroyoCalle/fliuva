/* save collected data */
var mysql=require("mysql");

module.exports=function(req,res){
	var connection=mysql.createConnection({
		host: process.env.OPENSHIFT_MYSQL_DB_HOST,
		port: process.env.OPENSHIFT_MYSQL_DB_PORT,
		user: process.env.OPENSHIFT_MYSQL_DB_USER,
		password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
		database: "fliuva"
	});
	connection.connect(function(err){
		if(err){
			res.send(501,"MySQL connection error");
		}
		connection.query("CREATE TABLE IF NOT EXISTS EVENTS(ID INT NOT NULL AUTO_INCREMENT,"+
		"CATEGORY TEXT, SUBCATEGORY TEXT, NAME TEXT, DESCRIPTION TEXT, DATA TEXT, "+
		"TIME DATETIME, SESSION TEXT"+
		")",function(err,results,fields){
			if(err){
				res.send(501,"MySQL table creation error");
			}
			connection.query("INSERT INTO EVENTS SET ?",{
				SESSION: req.query.SESSION,
				TIME: new Date(),
				CATEGORY: req.query.CATEGORY || "",
				SUBCATEGORY: req.query.SUBCATEGORY || "",
				NAME: req.query.NAME || "",
				DESCRIPTION: req.query.DESCRIPTION || "",
				DATA: req.query.DATA || ""
			},function(err,results,fields){
				res.send("OK");
			});
		});
	});
}
