var express = require('express');
var router = express.Router();
var authController= require('../controllers/auth')
var { check, body   } = require('express-validator/check')
var User = require('../models/user')

router.get('/login', authController.getLogin) 
router.get('/signup',authController.getSignup)

router.post('/login',
 [check('email')
  .isEmail()
    .withMessage('Invalid Email')
     .normalizeEmail(),
 body('password','Invalid Password')
    .isLength({ min: 5 })
     .trim()],
 authController.postLogin)


router.post('/signup',
  //EMAIL
 [ check('email')
    .isEmail() 
    .withMessage('Invalid Email')
    .custom((value, {req})=>{
       return User.findOne({email:value})
        .then( user =>{
          if(user){
            return Promise.reject('Email already exits')
          }
        })
    })
    .normalizeEmail(),

    //PASSWORD
    body('password',
     ' Please enter only numbers and text and at least 5 characters'
     )
     .isLength({min:5})
     .isAlphanumeric()
     .trim(),

     //CONFIRM PASSWORD
    body('confirmPassword').trim().custom((value, {req})=> {
      console.log(value +' = ' + req.body.password)
      if(value !== req.body.password){
        throw new Error ('Password must match')
      }
      return true
    })]
,authController.postSignup)

//Log Out
router.post('/logout',authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;
