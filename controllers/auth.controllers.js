 const jwt = require('jsonwebtoken')
 const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
 const User = require('../models/user')


const API_SECRET = ""

exports.signup = async (req, res)=>{
  try{
    const{first_name,last_name,email,password,location,contact, role} = req.body
  if(!email&&password&&first_name&&last_name&&location&&contact){
    res.send('All input is required')
  }
  const oldUser = await User.findOne({email})
  if(oldUser){
    res.send("User already exist. Please login")
    res.redirect('/login')
  }
  const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt) 
 const user = new User({
   first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    location: req.body.ward,
    card_number: req.body.card_no,
     role:  req.body.role,
    password:hashedPassword })
const token = await jwt.sign({user_id: user._id, email, role,}, API_SECRET, {expiresIn:"2h"})
 user.token = token
    user.save();
    res.redirect('/')
  }
  catch(err){console.log(err)}
}

exports.signin = async (req, res, next)=>{
  
  try{
    const{email, password} = req.body;
    if(!email && password){
      res.send('All input is required')
    }
    const user = await User.findOne({email})
    if(user&&(await bcrypt.compare(password, user.password))){
    
     const token = await jwt.sign({user_id: user._id, email, role: user.role}, API_SECRET, {expiresIn:"2h"})
     
     user.token = token
    
  res.cookie('x-access-token', token, {secure: false, httpOnly: true})
  
 res.redirect('/')
 //  console.log (user)
    // return token
}
  /*   if(user.role=="admin"){
        res.send('fine')
      }else{
        res.redirect('/product')
      }*/
    else{
    // res.send('Invalid Credentials')
    res.redirect('/user/register')
       
    }  }
  catch(err){
    console.log(err)
  }
 
  } 
