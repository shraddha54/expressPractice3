const express = require('express');
const app = express();
const fs = require('fs');

// Read and parse the JSON data at the start
let movies = JSON.parse(fs.readFileSync('./data/movie.json'));

app.use(express.json());

// Get all movies:-
app.get('/api/v1/movie', (req, res) => {
    res.json({
        status: 'success',
        value: {
            data: movies
        }
    });
});

// Post a new movie:-
app.post('/api/v1/movie', (req, res) => {
    const newid = movies[movies.length - 1].id + 1;
    const newMovie = Object.assign({ id: newid }, req.body);
    movies.push(newMovie);

    fs.writeFile('./data/movie.json', JSON.stringify(movies), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'fail',
                message: 'Error writing to file'
            });
        }
        res.status(201).json({
            status: 'success',
            data: {
                movie: newMovie
            }
        });
    });
});

app.get('/api/v1/movie/:id',(req,res)=>{
    let newId = req.params.id * 1;
    let getMovie = movies.find(ele=> ele.id === newId);
    if(!getMovie){
        return res.status(404).json({
            status:'fail',
            message:'the id is not a match'
        })
    }
    res.status(200).json({
        status:'success',
        data:{
            movie:getMovie
        }
    })
})

app.patch('/api/v1/movie/:id',(req,res)=>{
    let newId = +(req.params.id);
    let patchMovie = movies.find(ele=> ele.id === newId);
    let index = movies.indexOf(patchMovie);
    Object.assign(patchMovie , req.body)
    movies[index] = patchMovie;
    if(!patchMovie){
        return res.status(404).json({
            status:'fail',
            message:"something is wrong"
        })
    }
    fs.writeFile('./data/movie.json', JSON.stringify(movies), (err)=>{
        if(err){
           return res.status(404).json({
                status:'fail',
                message:"something is wrong"
            })
        }
        res.status(200).json({
            status:'success',
            data:{
                movie:patchMovie
            }
        })
    })
})
app.delete('/api/v1/movie/:id', (req,res)=>{
    let id = req.params.id * 1;
    let movieDel = movies.find(ele=> ele.id === id);
    let ind = movies.indexOf(movieDel);
    movies.splice(ind,1);
    if(!movieDel){
        return res.status(404).json({
            status:'fail',
            message:"something is wrong"
        })
    }
    fs.writeFile('./data/movie.json', JSON.stringify(movies), (err)=>{
        if(err){
           return res.status(404).json({
                status:'fail',
                message:"something is wrong"
            })
        }
        res.status(204).json({
            status:'success',
            data:{
                movie:null
            }
        })
    })

})

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});
