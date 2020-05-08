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
  if(req.query.id){
	if(!req.query.label)
		req.query.label = "";
	if(!req.query.meet_time)
		req.query.meet_time="";
	if(!req.query.cost)
		req.query.cost="";
	
	context.label = req.query.label;
	context.meet_time = req.query.meet_time;
	context.cost = req.query.cost/100;
	context.id = req.query.id;
	
	res.render('editTourType',context);
	return;
  }
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.get('/editServiceType',function(req,res){
  var context = {};
  if(req.query.id){
	if(!req.query.label)
		req.query.label = "";
	if(!req.query.description)
		req.query.description="";
	if(!req.query.cost)
		req.query.cost="";
	
	context.label = req.query.label;
	context.description = req.query.description;
	context.cost = req.query.cost/100;
	context.id = req.query.id;
	
	res.render('editServiceType',context);
	return;
  }
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.get('/editCustomer',function(req,res){
  var context = {};
  if(req.query.id){
	if(!req.query.first_name)
		req.query.first_name = "";
	if(!req.query.last_name)
		req.query.last_name="";
	if(!req.query.street)
		req.query.street="";
	if(!req.query.city)
		req.query.city="";
	if(!req.query.state)
		req.query.state="";
	if(!req.query.zip)
		req.query.zip="";
	if(!req.query.phone)
		req.query.phone="";
	if(!req.query.emergency_phone)
		req.query.emergency_phone="";
	
	context.first_name = req.query.first_name;
	context.last_name = req.query.last_name;
	context.street = req.query.street;
	context.city = req.query.city;
	context.state = req.query.state;
	context.zip = req.query.zip;
	context.phone = req.query.phone;
	context.emergency_phone = req.query.emergency_phone;
	context.id = req.query.id;
	
	res.render('editServiceType',context);
	return;
  }else{
	res.render('customers',context);
	return;
  }
  res.type('plain/text');
  res.status(500);
  res.render('500');
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

app.get('/purchases',function(req,res){
  var context = {};
   res.render('purchases',context);
});

app.get('/viewPurchase',function(req,res){
  var context = {};
   res.render('viewPurchase',context);
});

app.get('/customers',function(req,res){
  var context = {};
   res.render('customers',context);
});

app.get('/createAccount',function(req,res){
  var context = {};
   res.render('createAccount',context);
});

app.get('/tourTypeTable', function(req,res){
  pool.query("Select * FROM Guided_Tour_Types", function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});

app.get('/serviceTypesTable', function(req,res){
  pool.query("Select * FROM Service_Types", function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});

app.get('/purchasesTable', function(req,res){
  var values = [];
  var query = "SELECT Purchases.id, Purchases.purchase_date, Customers.first_name, Customers.last_name FROM Purchases JOIN Customers ON Purchases.customer_id = Customers.id";
  if(req.query.date || req.query.first_name || req.query.last_name){
	  query+= " WHERE ";
	  var addAnd = false;
	  if(req.query.date){
		  query+= " Purchases.purchase_date = ?"
		  values.push(req.query.date);
		  addAnd = true;
	  }
	  if(req.query.first_name){
		  if(addAnd){
			  query+= " AND";
		  }
		  query+= " Customers.first_name = ?"
		  values.push(req.query.first_name);
		  addAnd = true;
	  }
	  if(req.query.last_name){
		  if(addAnd){
			  query+= " AND";
		  }
		  query+= " Customers.last_name = ?"
		  values.push(req.query.last_name);
	  }
  }
	  
  pool.query(query, values,function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});

app.get('/customersTable', function(req,res){
  var values = [];
  var query = "SELECT first_name, last_name, street, city, state, zip, phone, emergency_phone FROM Customers";
  if(req.query.phone || req.query.first_name || req.query.last_name){
	  query+= " WHERE";
	  var addAnd = false;
	  if(req.query.phone){
		  query+= " phone = ?"
		  values.push(req.query.phone);
		  addAnd = true;
	  }
	  if(req.query.first_name){
		  if(addAnd){
			  query += " AND";
		  }
		  query+= " Customers.first_name = ?"
		  values.push(req.query.first_name);
		  addAnd = true;
	  }
	  if(req.query.last_name){
		  if(addAnd){
			  query += " AND";
		  }
		  query+= " Customers.last_name = ?"
		  values.push(req.query.last_name);
	  }
  }
	  
  pool.query(query, values,function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
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
