var express = require('express')
var app = express()
var fs = require('fs')
//var users = require('./users.json')
app.set('port', process.env.PORT || 3000)
app.use(express.json());

let dataMain = JSON.parse(fs.readFileSync('./users.json'));

//get:-
app.get('/',(req,res)=>{
    res.send('server is up...')
})
app.get('/getUser',(req,res)=>{
    console.log(dataMain)
    res.status(201).json({
        status:"success",
        data:dataMain
    })
})

//delete:-
app.delete('/user/:id',(req,res)=>{
    let id = +req.params.id;
    const userId = `user-${id}`;
   if(userId in dataMain){
    delete dataMain[userId]
   }
    
    fs.writeFile('./users.json', JSON.stringify(dataMain),(err)=>{
        res.status(204).json({
            status:"success",
            data:null
        })
    })
})


//post:-
// POST: Add a new user
// POST: Add a new user
app.post('/user', (req,res)=>{
    let maxId = 0;
    for( key of Object.keys(dataMain)){
        const userId = key.split('-')[1];
        maxId = Math.max(maxId , userId);
        
    }
    maxId++;
     userId = `user-${maxId}`
    const obj1 = {
        "name":"Fname",
        "age":12,
        "dob":135
    };
   
    dataMain[userId] = obj1;
    fs.writeFile('./users.json' , JSON.stringify(dataMain), (err)=>{
        res.send('successfully posted again..')
    })
})


app.listen(app.get('port'))