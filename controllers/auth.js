const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
var nodemailer = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport')
var { validationResult } = require('express-validator/check')


const transport = nodemailer.createTransport(sendGridTransport({
    auth:{  
        api_key:'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'
    }
}))

exports.getLogin = (req,res,next)=>{
    
        res.render('auth/login',{
            path:'/login',
            pageTitle:'Login Auth',
            isAuthenticated:req.session.isLoggedIn,
            credentials: {email:'', password:''},
            validationErrors:[]
        })
}

exports.postLogin = (req,res,next) =>{
    var email = req.body.email;
    var password = req.body.password;
    var errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('auth/login',{
            path:'/login',
            pageTitle:'Login',
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:errors.array()[0].msg,
            credentials: {email:req.body.email, password:req.body.password},
            validationErrors:[{param:'email'},{param:'password'}]
        })
    }

    User.findOne({email:email})
    .then(user => {
        if(!user){
            return res.render('auth/login',{
                path:'/login',
                pageTitle:'Login',
                errorMessage: 'Invalid email or password',
                credentials:{ email:req.body.email, password:req.body.password },
                validationErrors: [],
                isAuthenticated: req.session.isLoggedIn
            })
        }
        bcrypt.compare(password, user.password )
        .then(doMatch => {
            if(doMatch){
              req.session.isLoggedIn= true;
              req.session.user = user;
              return req.session.save(err=>{
               console.log(err)
               res.redirect('/');
              })
            }
           //
           return res.render('auth/login',{
            path:'/login',
            pageTitle:'Login',
            errorMessage: 'Invalid email or password',
            credentials:{ email:req.body.email, password:req.body.password },
            validationErrors: [],
            isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err)
            res.redirect('/login')
        })
    })
}

exports.postLogout = (req,res,next) =>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/')
    })
 }

 exports.postSignup = (req,res,next) =>{
     var errors = validationResult(req)
     if(!errors.isEmpty()){
         console.log(errors.array())
         return res.status(422).render('auth/signup',{
            path:'/signup',
            pageTitle:'Signup',
            isAuthenticated:req.session.isLoggedIn,
            errorMessage:errors.array()[0].msg,
            email:req.body.email, password:req.body.password,confirmPassword:req.body.confirmPassword,
            validationErrors:errors.array()
        } )
     }
         
         bcrypt.hash(req.body.password, 12)
         .then(hashedPassword => {
            var user = new User({
                email:req.body.email,
                password:hashedPassword,
                cart: {items:[]}
            })
            return user.save()
         })
         .then(user=>{
            res.redirect('/login')
             return transport.sendMail({
                 to:'req.body.email',
                 from:'shop@node.com',
                 subject:'Sign Up',
                 html:'you successfully signed up',
             })
            .then(err => {console.log(err);res.redirect('/login')})
         })
        .catch( err => console.log(err))
 } 

 exports.getSignup = (req,res,next) =>{
     res.render('auth/signup',{
         path:'/signup',
         pageTitle:'Signup',
         isAuthenticated:req.session.isLoggedIn,
         email:'', password:'',confirmPassword:'',
         validationErrors :[]
     })
 }

 exports.getReset = (req,res,next) => {
    //  let message = req.flash('error');
    //  if(message.length > 0){
    //      message = message[0]
    //  }else{
    //      message = null ;
    //  }
     res.render('auth/reset',{
         path:'/reset',
         pageTitle:'Reset Password',
         isAuthenticated:req.session.isLoggedIn
        //  errorMessage:message
     })
 }

 exports.postReset = (req,res,next) => {
    crypto.randomBytes(32,(err, buffer) => {
        if(err){
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({email:req.body.email})
        .then(user => {
           
            if(!user){
                req.flash('error', 'No account with that email found.')
                return res.redirect('/reset');
            }

            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
        })
        .then(result => {
            res.redirect('/login')
            transport.sendMail({
                to:'req.body.email',
                from:'shop@node.com',
                subject:'Password Reset',
                html:`
                <p>You requested a password<p>
                <p>Click this <a href="http://localhost:3000/reset/${token}"><a/> to reset password</p>
                `
            })
        })
        .catch(err => console.log(err))
    })
 }

 exports.getNewPassword = (req,res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: { $gt: Date.now() }})
    .then( user => {
     if(!user)
     return res.redirect('/Token-Expired-or-Wrong-Token')

     //  let message = req.flash('error');
     //  if(message.length > 0){
     //      message = message[0]
     //  }else{
     //      message = null ;
     //  }
 
     return  res.render('auth/new-password',{
            path:'/new-password',
            pageTitle:'New Password',
            isAuthenticated:req.session.isLoggedIn,
            userId: user._id.toString(),
            passwordToken:token
        //  errorMessage:message
          })
    
      
    })
    .catch(err => {
        console.log(err)
    })
 }

 exports.postNewPassword = (req,res,next) => {

    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser;
    
    User.findOne({resetToken:passwordToken, resetTokenExpiration: { $gt:Date.now()}, _id: userId})
    .then(user => {
        resetUser = user
        return bcrypt.hash(newPassword,12)
    })
    .then( hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save()
    })
    .then(result => {
        res.redirect('/login')
    })
    .catch(err => {
        console.log(err)
    })
 }