var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'http://51.15.132.242',
    user     : 'root',
    password : 'root',
    database : 'next_tracks'
});


connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

exports.tracks = function(req,res) {
    connection.query('SELECT * FROM tracks ORDER BY id DESC LIMIT 20', function (error, results, fields) {
        if (error) {
            console.log('error');
            res.send({
                'code': 400,
                'error': 'error occured'
            })
        } else {
            res.send({
                'code': 200,
                'success': 'the tracklist has been found',
                results
            })
        }
    })
}

exports.allTracks = function(req,res) {
    connection.query('SELECT * FROM tracks ORDER BY id DESC LIMIT 100', function (error, results, fields) {
        if (error) {
            console.log('error');
            res.send({
                'code': 400,
                'error': 'error occured'
            })
        } else {
            res.send({
                'code': 200,
                'success': 'the tracklist has been found',
                results
            })
        }
    })
}

exports.publish = function (req, res, next) {
    console.log("req");
    // console.log(req.file);
    if (!req.file) {
        return res.send('no files were uploaded');
    } else {
        console.log("request");
        console.log(req.body);
        let path = {
            name: req.file.filename,
            userName: req.body.userName
        };
        connection.query('INSERT INTO tracks SET ?', path, function (error, results, fields) {
            if (error) {
                console.log('error');
                res.send({
                    'code': 400,
                    'error': 'error occured'
                })
            } else {
                console.log('success');
                res.send({
                    'code': 200,
                    'success': 'successful'
                });
            }
        })
    }
}

exports.register = function(req,res){
    console.log("req",req.body);
    var today = new Date();
    var users={
        "email":req.body.email,
        "name":req.body.name,
        "password":req.body.password,
        "creationDate":today
    }
    connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
        if (error) {
            res.send({
                "code":400,
                "failed":"error ocurred"
            })
        }else{
            res.send({
                "code":200,
                "success":"success"
            })
        }
    });
}

exports.login = function(req,res){
    var name = req.body.name;
    var password = req.body.password;
    connection.query('SELECT * FROM users WHERE name = ? AND password = ?', [name, password], function (error, results, fields) {
        console.log("req");
        console.log(req.session);
        if (error) {
            console.log("error ocurred",error);
            res.send({
                "code":400,
                "failed":"error ocurred"
            })
        }else{
            if(results.length >0){
                if(results[0].password == password){
                    results = {
                        userName: results[0].name,
                        id: results[0].id
                    };
                    res.send({
                        "code":200,
                        "success":"login successful",
                        results
                    })
                }
                else{
                    res.send({
                        "code":204,
                        "error":"Email and password does not match"
                    });
                }
            }
            else{
                res.send({
                    "code":204,
                    "error":"Email does not exist"
                });
            }
        }
    });
}

exports.user = ((req, res) => {
    console.log("req");
    console.log(req.body);
    var id = req.body.id;
    connection.query('SELECT name FROM users WHERE id = ?', [id], (error, results, fields) => {
        if (error) {
            res.send({
                "code": 400,
                "error": "bad request"
            });
        } else {
            res.send({
                results
            })
        }
    })
});

exports.delete = ((req, res) => {
    var id = req.body.id;
    connection.query('DELETE FROM tracks WHERE id = ?', [id], (error, results, fields) => {
        if (error) {
            res.send({
                "code": 400,
                "error": "Bad Request"
            });
        } else {
            res.send({
                "code": 200,
                "sucess": "the track has been deleted"
            })
        }
    })
});
