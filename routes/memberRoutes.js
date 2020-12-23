const { Router } = require("express");
const express = require("express")
var router = express.Router();
const memberSchema = require("../models/memberSchema").constructor
const slotSchema = require("../models/slotSchema").constructor
const authoController =require("../controllers/authController")

router.post('/register',authoController.register)
 
module.exports=router