var mysql=require("mysql");

module.exports=function(req,res){
	var connection=mysql.createConnection({
		host: process.env.OPENSHIFT_MYSQL_DB_HOST,
		port: process.env.OPENSHIFT_MYSQL_DB_PORT,
		user: "adminU56jbl7" || process.env.OPENSHIFT_MYSQL_DB_USER,
		password: "bn82YgzLYJTv" || process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
		database: "fliuva"
	});
	connection.query("SELECT * FROM EVENTS",function(err,results,fields){
		res.send(JSON.stringify(results));
	});
}
