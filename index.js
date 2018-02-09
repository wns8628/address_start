var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();


// DB setting
mongoose.connect(process.env.MONGO_DB_V); // 1
var db = mongoose.connection; // 2
// 3﻿
db.once("open", function(){
 console.log("DB connected");
});
// 4
db.on("error", function(err){
 console.log("DB ERROR : ", err);
});

app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//여기까지 세팅? ----------------------------------------------

//스키마
var contactSchema = mongoose.Schema({
 name:{type:String, required:true, unique:true},
 email:{type:String},
 phone:{type:String}
});
var Contact = mongoose.model("contact",contactSchema);


//라우터

app.get("/",function(req,res){
  res.redirect("/contacts");
});

app.get("/contacts", function(req,res){
 Contact.find({}, function(err, contacts){
   if(err){ return res.json(err); }
   res.render("contacts/index", {contacts:contacts});
 });
});

app.get("/contacts/new", function(req, res){
 res.render("contacts/new");
});

app.post("/contacts", function(req, res){
 Contact.create(req.body, function(err, contact){
  if(err) return res.json(err);
  res.redirect("/contacts");
 });
});


app.listen(3000,function(){
  console.log('서버온');
});
