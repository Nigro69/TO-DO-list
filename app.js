const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const date=require(__dirname+ "/date.js");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var item=[];
app.get("/", function(req, res){
  let dname=date();
  res.render("index", {day:dname,newitem:item});
});

app.post("/",function(req,res){
  item.push(req.body.newlist);
  res.redirect("/");
});
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
