
var express = require('express');
var tracksroutes = require('./routes/tracks.js');
var bodyParser = require('body-parser');
var cors = require('cors');
// var session = require('express-session');
var multer  = require('multer');

var app = express();

// var sess = {
//   secret: 'keyboard cat',
//   cookie: {
//       maxAge: 600000
//   }
// };

// config simple du C.O.R.S
app.use(cors({
  origin: [
    "http://adami3.com",
    "http://www.adami3.com",
    "http://212.47.243.197",
    "http://212.47.243.197:8080",
    "http://212.47.243.197:8081",
    "http://212.47.243.197:8082"
  ], // domaines validés
  methods: ["GET", "DELETE", "PATCH", "POST", "PUT"], // verbes http validés
  credentials: true // autorise set cookie
}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})

var upload = multer({ storage: storage })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session(sess));

app.get('/', tracksroutes.tracks);
app.get('/library', tracksroutes.allTracks);


// app.post('/publish', fileUpload(), tracksroutes.publish);
app.post('/user', tracksroutes.user);
app.post('/publish', upload.single("sound"), tracksroutes.publish);
app.post('/login', tracksroutes.login);
app.post('/register', tracksroutes.register);

app.delete('/delete', tracksroutes.delete);



app.listen(5000);
