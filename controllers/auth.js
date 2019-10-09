exports.getLogin = (req,res,next)=>{
     //const isLoggedIn = req.get('Cookie').trim().split('=')[1];
     console.log(isLoggedIn)
    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login Auth',
        isAuthenticated:false
    })
}

exports.postLogin = (req,res,next) =>{
    res.setHeader('Set-Cookie','loggedIn=true, HttpOnly')
    res.redirect('/')
}