var mysql=require("mysql");

module.exports=function(req,res){
	var session=req.params.session;
	var connection=mysql.createConnection({
		host: process.env.OPENSHIFT_MYSQL_DB_HOST,
		port: process.env.OPENSHIFT_MYSQL_DB_PORT,
		user: "adminU56jbl7" || process.env.OPENSHIFT_MYSQL_DB_USER,
		password: "bn82YgzLYJTv" || process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
		database: "fliuva"
	});
	connection.query("SELECT * FROM EVENTS WHERE SESSION = ?",[session],function(err,results){
		if(err)
			res.send(502,"Error: "+err);
		res.render("jade/session.jade",{events: results});
	});
}
