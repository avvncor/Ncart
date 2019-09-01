
var app = require('express')();

app.get('/headers',(req,res,next)=>{
    console.log(req.headers)
    
    res.json({'working':'true'})
})

app.listen(2000)
console.log('listening')