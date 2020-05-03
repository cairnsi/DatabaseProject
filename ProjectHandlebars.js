var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var credentials = require('./credentials.js');
var request = require('request');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3130);


var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_cairnsi',
  password        : credentials.databasePWD,
  database        : 'cs340_cairnsi'
});


app.get('/',function(req,res){
  var context = {};
   res.render('home',context);
});

app.get('/addTour',function(req,res){
  var context = {};
   res.render('addTour',context);
});

app.get('/checkout',function(req,res){
  var context = {};
   res.render('checkout',context);
});

app.get('/addService',function(req,res){
  var context = {};
   res.render('addService',context);
});

app.get('/siteAdmin',function(req,res){
  var context = {};
   res.render('siteAdmin',context);
});

app.get('/yourTours',function(req,res){
  var context = {};
   res.render('yourTours',context);
});

app.get('/editTourType',function(req,res){
  var context = {};
   res.render('editTourType',context);
});

app.get('/editServiceType',function(req,res){
  var context = {};
   res.render('editServiceType',context);
});

app.get('/updateSpecificTours',function(req,res){
  var context = {};
   res.render('updateSpecificTours',context);
});

app.get('/addTourType',function(req,res){
  var context = {};
   res.render('addTourType',context);
});

app.get('/addServiceType',function(req,res){
  var context = {};
   res.render('addServiceType',context);
});

app.get('/addSpecificTour',function(req,res){
  var context = {};
   res.render('addSpecificTour',context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
