const express = require("express");
const bodyParser = require("body-parser");
const request =require("request");
const { json } = require("express/lib/response");
const https =require("https");
const ejs = require('ejs');

const app = express();


app.use(express.static("views"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(require('connect').bodyParser());
app.use(express.json());


app.get("/",function(req,res)
{
    res.render("index",{weather:null,error:null})
})

app.post("/",function(req,res){
    let city = req.body.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&unit=celcius&appid=c6c9457db9296d57a33d3ca19a22f67c`;
    console.log(req.body.city);
    request(url,function(err,response,body)
    {
        if(err)
        {
            res.render("index",{weather:null,error: "error, please try again"});

        }else{
            let weather =JSON.parse(body);
            if(weather.main == undefined)
            {
                res.render("index",{weather:null,error:"error please try again",});
            }else
            {
                let weatherText = `it's ${weather.main.temp-273.15} degree celsius with ${weather.weather[0].main} in ${weather.name} and wind speed is ${weather.wind.speed} km per hour`;
                res.render("index",{weather:weatherText,error:null});
                console.log("body",body);
            }
        }
    });
});

app.listen(3000,function(){
    console.log("weather app running on port 3000");
})