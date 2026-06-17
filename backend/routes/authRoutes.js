const express = require("express");
const router = express.Router();

router.post("/register",(req,res)=>{
    res.send("Register router");
});

router.post("/login",(req,res)=>{
    res.send("Login router");
});

module.exports= router;