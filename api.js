
const express        = require('express');
var bodyParser = require('body-parser');
var con        = require('./connection');
const app            = express();

const port = 8000;


app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.listen(port, () => {
  console.log('We are live on ' + port);
});

app.post('/echo', function(req, res){
    console.log('checking login ->'+req.body.name)
    // res.json({"Error": false,"Message":req.body.name});
    var sql = "SELECT * FROM user WHERE username = '" + req.body.name + "'";
       con.query(sql, function(err,rows){
           if(err){
           	res.json({"Error": true,"Message":err});
           } 
           else{
            res.json({"Error": false,"Message":rows});
         }
        });

})
