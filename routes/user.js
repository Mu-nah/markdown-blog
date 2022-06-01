const express = require('express')
const router = express()
const User = require('../models/user')
const  {signup, signin} = require('../controllers/auth.controllers.js') 
const  {verifyToken} = require('../middlewares/auth.js') 

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', signup, (req, res) => {
  
})

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', signin, (req, res) => {
  
})


module.exports = router