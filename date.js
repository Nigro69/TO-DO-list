module.exports=function (){

    var today=new Date();
var options={
  weekday:"long",
  day:"numeric",
  month:"long",

}
var dname=today.toLocaleDateString("en-US",options);
    return dname;
}
