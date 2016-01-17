var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    http = require('http');
    
mongoose.connect("mongodb://localhost/spotifye");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
// app.set('view engine', 'ejs');

//Schema setup
var songSchema = new mongoose.Schema({ 
    name: String,
    songID: String,
    artist: String,
    rating: Number
});

var Song = mongoose.model("Song", songSchema);

//Routes
app.get('/', function(req, res){
    res.render('index.html');
});

//List all songs
app.get('/songs', function(req, res){
    Song.find({}, function(err, allSongs){
        if(err){
            console.log("Error");
        } else{
            res.json(allSongs);
        }
    });
});

//Add new song
app.post('/songs', function(req, res){
    console.log(req.body);
    var songName = req.body.name;
    var songId = req.body.id;
    var songArtist = req.body.artist;
    var params = {name: songName, songID: songId, artist: songArtist, rating: 1}
    Song.create(params, function(err, newSong){
        if(err)
            console.log("Error");
        res.send(newSong);
    });
});

//Upvote
app.put('/songs/up', function(req, res){
    var songURI = req.body.songID;
    console.log(req.body);
    Song.update({"songID": songURI}, {$inc: {'rating': 1}}, {multi: true}, function(err,song){
        if(err){
            console.log("Error");
        } else {
            res.send(song);
        }
    }
    );
});


app.listen(3000, function(){
     console.log("Server started!");
 });


