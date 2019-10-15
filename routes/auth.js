var express = require('express');
var router = express.Router();
var authController= require('../controllers/auth')

router.get('/login', authController.getLogin) 
router.get('/signup',authController.getSignup)

router.post('/login',authController.postLogin)
router.post('/signup',authController.postSignup)

//Log Out
router.post('/logout',authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;
