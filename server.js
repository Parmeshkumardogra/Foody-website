const express= require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");

mongoose.connect("mongodb://localhost:27017/foodDB");
const app=express();
const foodschemea=new mongoose.Schema({
    _id:Number,
    name:String,
    price:Number
});
const upischemea=new mongoose.Schema({
    _id:Number,
    upi_id:String,
    balance:Number
})
app.use(bodyparser.urlencoded({extended:true}));
// const Food=mongoose.model("Food",foodschemea,"pizza","burger");
const Pizza=mongoose.model("Pizza",foodschemea,"pizza");
const Burger=mongoose.model("Burger",foodschemea,"burger");
const Snacks=mongoose.model("Snack",foodschemea,"snacks");
const Breakfast=mongoose.model("Breakfast",foodschemea,"breakfast");
const Lunch=mongoose.model("Lunch",foodschemea,"lunch");
const Dinner=mongoose.model("Dinner",foodschemea,"dinner");
const Balance=mongoose.model("Balance",upischemea,"upiid");
app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("Login");
});
app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.get("/burgers",(req,res)=>{
    Burger.find({},(err,foundedburger)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("burgers",{burgerlist:foundedburger});
        }
    })
})
app.get("/pizza",(req,res)=>{
    
    Pizza.find({},(err,foundedfood)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("pizza",{list:foundedfood});
        }
        
    })
})

app.post("/orderplacing",(req,res)=>{
    res.render("placing-order",{order_name:req.body.order_name,order_price:req.body.order_price}); 

})

app.post("/confirm-order",(req,res)=>{
    const new_upi_id=req.body.upi;
    const price_for_subtraction=req.body.order_price_deduction;
    Balance.find({upi_id:new_upi_id},(err,f)=>{
        if(err){
            console.log(err)
        }
        else{
           const true_or_false=f.length;
           if(true_or_false===0){
            res.redirect("/");
           }
           else{
            Balance.find({upi_id:new_upi_id},(err,f1)=>{
                if(err){
                    console.log(err);
                }
                else{
                    const val_Price=f1[0].balance-price_for_subtraction;
                    Balance.updateOne({upi_id:new_upi_id},{$set:{balance:val_Price}},(err)=>{
                        if(err){
                            console.log("server updation error");   
                        }
                        else{
                            console.log("Updated price successfuly");
                            console.log(val_Price)
                        }
                    }) 
                }
            })
        }
    }  })
})
app.get("/addtocart",(req,res)=>{
    res.send("succesfuly");
})
app.listen(5000,()=>{
    console.log("Server started on port 5000");
})