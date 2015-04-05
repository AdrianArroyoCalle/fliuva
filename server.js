require("newrelic");
var express=require("express");
var mysql=require("mysql");
var collect=require("./collect");
var getdata=require("./getdata");
var session=require("./session");
var uuid=require("node-uuid");
var http=require("http");
var pdf=require("html-pdf");

var app=express();

app.set("views",__dirname + "/jade");
app.set("view engine","jade");

app.get("/collect",collect);

app.get("/get",getdata);

app.get("/all",function(req,res){
	res.send(501,"Not implemented yet");
});

app.get("/uuid",function(req,res){
	res.send(uuid.v4());
});

app.get("/pdf",function(req,res){
	http.get("http://fliuva-divel.rhcloud.com",function(resp){
		var html;
		resp.on("data",function(chunk){
			html+=chunk;
		});
		resp.on("end",function(){
			var options={
				format: "A4",
				orientation: "portrait",
				type: "pdf"
			};
			pdf.create(html,options).toStream(function(err,stream){
				stream.pipe(res);
			});
		});
	});
});

app.get("/session/:session",session);

app.use(express.static("www"));

var ip=process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port=process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || 8080;

var server=app.listen(port,ip);
