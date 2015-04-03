var express=require("express");
var mysql=require("mysql");
var collect=require("./collect");
var getdata=require("./getdata");
var uuid=require("node-uuid");

var app=express();

app.get("/collect",collect);

app.get("/get",getdata);

app.get("/all",function(req,res){
	res.send(501,"Not implemented yet");
});

app.get("/uuid",function(req,res){
	res.send(uuid.v4());
});

app.use(express.static("www"));

var ip=process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port=process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || 8080;

var server=app.listen(port,ip);
