const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const User = require('../models/user')

const API_SECRET = ""

exports.verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.cookies['x-access-token'] || req.headers["x-access-token"];

  if (!token) {
     //return res.status(403).send("A token is required for authentication");
  res.redirect('/user/login')
  }else{
  try {
    const decoded = await jwt.verify(token, API_SECRET); 
   req.user = decoded
  console.log(req.user)
  
  } catch (err) {
    res.redirect('/user/login')
  }
  return next();} 
};
