const http=require("http");
const fs=require("fs");
var requests=require("requests");
const express=require('express');
const app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var city;
app.get('/',function(req,res){
  res.sendFile(__dirname+"/first.html");
  // app.send("hello");
})
 
const indexfile = fs.readFileSync("index.html","utf-8");

const replaceVal = (tempval, orval) => {
  let temp = tempval.replace("{%tempval%}", orval.main.temp);
  temp = temp.replace("{%tempmin%}", orval.main.temp_min);
  temp = temp.replace("{%tempmax%}", orval.main.temp_max);
  temp = temp.replace("{%location%}", orval.name);
  temp = temp.replace("{%country%}", orval.sys.country);
  return temp;
};

app.post('/',function(req,res){
  
    var city=req.body.city_name;
  
      requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=374cb2352e308a68fb4eaa4d5a6f3d61&units=metric`)
      .on("data",(chunk)=>{
        const objdata=JSON.parse(chunk);
        const arr=[objdata];
        const realtime=arr.map((val)=>
          replaceVal(indexfile,val)
        ).join("");
        res.write(realtime);
      //   res.end();
      })
    //   .on("end",(err)=>{
    //     if(err)return 
    //     // console.log("connection closed  due to errors",err);
    //     res.send("<h1>err</h1>");
    //   res.end();   
    // });
    .on("error", (err) => {
      console.error("Error fetching data:", err);
    //   res.sendFile(__dirname + "/error.html");
    
  });
 
  
 
})

// app.post('/', function (req, res) {
//   var city = req.body.city_name;
//   requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=374cb2352e308a68fb4eaa4d5a6f3d61&units=metric`)
//       .on("data", (chunk) => {
//           try {
//               const objdata = JSON.parse(chunk);
//               if (objdata.cod === "404") {
                  
//                console.error("Invalid city or city not found.");
//                    res.sendFile(__dirname + "/error.html");
//                       res.end();
//               } else {
//                   const arr = [objdata];
//                   const realtime = arr.map((val) =>
//                       replaceVal(indexfile, val)
//                   ).join("");
//                   res.write(realtime);
//               }
//           } catch (err) {
//               console.error("Error parsing data:", err);
//               res.sendFile(__dirname + "/error.html");
//           }
//       })
//       .on("end", () => {
//           res.end();
//       })
//       .on("error", (err) => {
//           console.error("Error fetching data:", err);
//           // res.sendFile(__dirname + "/error.html");
//       });
// });

// const server = http.createServer((req,res)=>{
//   if(req.url =="/"){
//     requests("https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=374cb2352e308a68fb4eaa4d5a6f3d61&units=metric")
//     .on("data",(chunk)=>{
//       const objdata=JSON.parse(chunk);
//       const arr=[objdata];
//       const realtime=arr.map((val)=>
//         replaceVal(indexfile,val)
//       ).join("");
//       res.write(realtime);
//     //   res.end();
//     })
//     .on("end",(err)=>{
//       if(err)return console.log("connection closed  due to errors",err)
//     res.end();   
// });
// }
// else {
//   res.end("File not found");
// }
// });
// server.listen(8000,"127.0.0.1");

app.listen(8000,function(){
  console.log("listen at 8000");
})
