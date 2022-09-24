const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const date=require(__dirname+ "/date.js");
const mongoose = require("mongoose");
const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://Yash_3010:yash-3010@cluster0.rbc0vbk.mongodb.net/todolistDB');


const listSchema=new mongoose.Schema(
    {
        name:String
    }
);
const List=mongoose.model("list" ,  listSchema);


// const i1=new List({
//   name:"Wake up!"
// });
// const i2=new List({
//   name:"Eat"
// });
var item=[];
let dname=date();
var dropnames=[];

const customListSchema=new mongoose.Schema(
  {
    name:String,
    items:[listSchema]
  }
);

const customList=mongoose.model("customList",customListSchema);



app.get("/", function(req, res){
  

 

  List.find({},function(err,foundItem){
    // if(foundItem.length===0){
    //   List.insertMany(item,function(err){
    //     if(err)
    //     console.log("err");
    //     else
    //     console.log("succesfully added");
    //   });
    //   res.redirect("/");
    // }
    // else
   
   

    res.render("index", {day:dname,newitem:foundItem,dropn:dropnames});
  });
  customList.find(function(err,docs){
    if(!err){
      for(var i=0;i<docs.length;i++){
        if(docs[i].name!=dropnames[i]){
          dropnames.push(docs[i].name);
        }
      }
    }
  });

  
});



app.get("/:custom",function(req,res){
  
  const newListName=_.capitalize(req.params.custom);

  


  customList.findOne({name:newListName},function(err,result){
    if(!err){
      if(!result)
      {
        
        const newCustomList=new customList({
          name:newListName,
          items:item
        });
        newCustomList.save();
        res.redirect("/"+newListName);
      }
      else{
        
        res.render("index", {day:result.name,newitem:result.items,dropn:dropnames});
      }
      
    }
    
  });

 
 
});

app.post("/createlistname",function(req,res){
  const listnametitle=req.body.newlist;
  res.redirect("/"+listnametitle);
});

app.post("/",function(req,res){
  const itemName=req.body.newlist;
  const listName=req.body.listName;

  const item= new List({
    name : itemName
  });

  if(listName===dname){
    item.save();
    res.redirect("/");
  }
  else{
    customList.findOne({name:listName},function(err,foundlist){
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/"+listName);
    })
  }
  
});
app.post("/delete",function(req,res){
  const listName=req.body.listName;
  const checkedItemId=req.body.checkbox;
  if(listName===dname){
    List.findByIdAndRemove(checkedItemId,function(err){
      if(!err)
      console.log("deleted item");
    });
    res.redirect("/");
  }
  else{
    customList.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundlist){
      if(!err){
        res.redirect("/"+listName);
      }
      
    });
  }
  
});


let port= process.env.PORT;
if (port==null|| port==""){
  port=3000;
}


app.listen(port, function(){
  console.log("Server started on port 3000.");
});
