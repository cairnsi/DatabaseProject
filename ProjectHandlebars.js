var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var credentials = require('./credentials.js');
var request = require('request');
var mysql = require('mysql');
var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({secret: credentials.sessionpwd}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3130);


function checkSession(req, res){
	if(req.session.customerId){
		return true;
	}
	return false;
}

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

app.get('/signIn',function(req,res){
  var context = {};
   res.render('signIn',context);
});

app.post('/signIn', function(req,res,next){
  if(req.body.fname&& req.body.lname){
	var query = "SELECT id FROM Customers WHERE first_name=? AND last_name=?";
	pool.query(query, [req.body.fname,req.body.lname],function(err,result){ 
	  if(!err){
		if(result[0]){
			if(result[0].id){
				if(req.session.customerId){
					req.session.cartTours=[];
					req.session.cartService=[];
				}
				if(!req.session.cartTours){
					req.session.cartTours=[];
				}
				if(!req.session.cartService){
					req.session.cartService=[];
				}
				req.session.customerId = result[0].id;
				if(checkSession(req,res)){
					var context = {};
					context.success = "Successfully signed in as " + req.body.fname + " " + req.body.lname; 
					res.render('signIn',context);
					return;
				}else{
					var context = {};
					context.error = "Could not set session";
					res.render('signIn',context);
					return;
				}
			}else{
				var context = {};
				context.error = "Not a valid user";
				res.render('signIn',context);
				return;
			}
		}else{
			var context = {};
			context.error = "Not a valid user";
			res.render('signIn',context);
			return;
		}
		
		
	  }else{
		next(err);
	  }
    });
	  
	  
  }else{
  
	var context ={};
	context.error = "Must enter first and last name";
	res.render('signIn',context);
	return
  }
});

app.get('/addTour',function(req,res){
  var context = {};
   res.render('addTour',context);
});

app.get('/cartToursTable',function(req,res){
  if(!req.session.cartTours){
	  var item = [];
	  res.send(JSON.stringify(item));
	  return;
  }
  if(req.session.cartTours.length==0){
	  var item = [];
	  res.send(JSON.stringify(item));
	  return;
  }
  var query = "SELECT Specific_Tours.id, Specific_Tours.date, Guided_Tour_Types.label, Guided_Tour_Types.cost FROM Specific_Tours JOIN Guided_Tour_Types ON Guided_Tour_Types.id = Specific_Tours.type_number WHERE Specific_Tours.id IN ?";
	pool.query(query, [[req.session.cartTours]],function(err,result){ 
	  if(!err){
		res.send(JSON.stringify(result));
	  }else{
		next(err);
	  }
    });
});

app.get('/cartServiceTable',function(req,res){
  if(!req.session.cartService){
	  var item = [];
	  res.send(JSON.stringify(item));
	  return;
  }
  if(req.session.cartService.length==0){
	  var item = [];
	  res.send(JSON.stringify(item));
	  return;
  }
  var ids = [];
  for(var i = 0;i<req.session.cartService.length;i++){
	  ids.push(req.session.cartService[i][0]);
  }
  var query = "SELECT * FROM Service_Types WHERE id IN ?";
	pool.query(query, [[ids]],function(err,result){ 
	  if(!err){
		for(var j = 0; j< result.length;j++){
			result[j].qty = req.session.cartService[j][1];
		}
		res.send(JSON.stringify(result));
	  }else{
		next(err);
	  }
    });
});

app.post('/addTourToCart', function(req,res,next){
  if(!req.body.id){
	  res.status(404);
	  res.send("service id required");
	  return;
  }
  var query = "SELECT id FROM Specific_Tours WHERE id = ?";
	pool.query(query, [req.body.id],function(err,result){ 
	  if(!err){
		  if(result[0]){
				if(result[0].id){
				  if(req.session.cartTours){
					var found = false;
					for(var i = 0;i< req.session.cartTours.length;i++){
						if(req.session.cartTours[i]==req.body.id){
							res.status(409);
							res.send("Tour is already in cart");
							return;
						}
					}
					if(!found){
						req.session.cartTours.push(req.body.id);
					}
				  }else{
					  req.session.cartTours=[];
					  req.session.cartTours.push([req.body.id]);
				  }
				  res.status(200);
				  res.send("success");
				  return;
				}else{
				  res.status(400);
				  res.send("tour id does not exist");
				  return;
				}
		  }
		  else{
			  res.status(500);
			  res.send("server error");
			  return;
			}
	  }else{
		next(err);
	  }
    });
  
});

app.post('/removeTourCart', function(req,res,next){
  if(!req.body.id){
	  res.status(404);
	  res.send("tour id required");
	  return;
  }
  var newTours = [];
  for(var i = 0;i< req.session.cartTours.length;i++){
	  if(req.session.cartTours[i] != req.body.id){
		  newTours.push(req.session.cartTours[i]);
	  }
	  
  }
  req.session.cartTours = newTours;
	res.status(200);
	res.send("success");
	return;			
  
});

app.post('/removeServiceCart', function(req,res,next){
  if(!req.body.id){
	  res.status(404);
	  res.send("Service id required");
	  return;
  }
  var newTours = [];
  for(var i = 0;i< req.session.cartService.length;i++){
	  if(req.session.cartService[i][0] != req.body.id){
		  newTours.push(req.session.cartService[i]);
	  }
	  
  }
    req.session.cartService = newTours;
	res.status(200);
	res.send("success");
	return;			
  
});

app.get('/checkout',function(req,res){
  var context = {};
   res.render('checkout',context);
});

function purchaseService(purchaseId, req, res){
	if(req.session.cartService.length==0){
		req.session.cartService=[];
		res.status(200);
		res.send("success");
		return;
	}
	query = "INSERT INTO Purchases_Service_Types(purchase_id, service_id, quantity) VALUES ?";
	var serviceValues = [];
	for(var i = 0;i<req.session.cartService.length;i++){
		serviceValues.push([purchaseId, req.session.cartService[i][0],req.session.cartService[i][1]]);
	}
	pool.query(query, [serviceValues],function(err,result){ 
	  if(!err){
		    req.session.cartService=[];
			res.status(200);
			res.send("success");
			return;
	  }
	  else{
		  res.status(500);
		  res.send("server1 error");
		  return;
			
	  }
	}); 
}

function purchase(req, res){
	query = "INSERT INTO Purchases(purchase_date, customer_id) VALUES (?)";
	pool.query(query, [[new Date(),req.session.customerId]],function(err,result){ 
	  if(!err){
		  var purchaseId = result.insertId;
		  if(req.session.cartTours.length>0){
			    query = "INSERT INTO Purchases_Tours(purchase_id, tour_id) VALUES ?";
			    var tourValues = [];
			    for(var i = 0;i<req.session.cartTours.length;i++){
					tourValues.push([purchaseId, req.session.cartTours[i]]);
				}
				pool.query(query, [tourValues],function(err,result){ 
				  if(!err){
						req.session.cartTours = [];
					    purchaseService(purchaseId, req, res);
						return;
				  }
				  else{
					  res.status(500);
					  res.send("server error");
					  return;
						
				  }
				});
		  }else {
			  req.session.cartTours = [];
			  purchaseService(purchaseId, req, res);
			  return;
		  }
	  }else{
		  res.status(500);
		  res.send("server error");
		  return;
			
	  }
	});
}

app.post('/checkout', function(req,res,next){
  if(!checkSession(req,res)){
		res.status(400);
		res.send("Please sign in to complete purchase");
		return;
  }
  if(req.session.cartTours.length==0 && req.session.cartService.length==0){
		res.status(400);
		res.send("Nothing in cart");
		return;
  }
  if(req.session.cartTours.length>0){
	var query = "SELECT Specific_Tours.id, Guided_Tour_Types.label, Specific_Tours.date FROM Purchases JOIN Purchases_Tours ON Purchases_Tours.purchase_id = Purchases.id JOIN Specific_Tours ON Specific_Tours.id = Purchases_Tours.tour_id JOIN Guided_Tour_Types ON Guided_Tour_Types.id =Specific_Tours.type_number WHERE Purchases.customer_id = ? AND Specific_Tours.id IN ?";
	pool.query(query, [req.session.customerId, [req.session.cartTours]],function(err,result){ 
	  if(!err){
		  if(result.length>0){
				res.status(409);
				res.send(JSON.stringify(result));
				return;
		  }
		  purchase(req, res);
		  return;
	  }else{
		next(err);
	  }
    });
  }else{
	  purchase(req, res);
	  return;
  }
});

app.get('/addService',function(req,res){
  var context = {};
   res.render('addService',context);
});

app.post('/addServiceToCart', function(req,res,next){
  if(!req.body.id || !req.body.qty){
	  res.status(404);
	  res.send("service id and quantity required");
	  return;
  }
  var query = "SELECT id FROM Service_Types WHERE id = ?";
	pool.query(query, [req.body.id],function(err,result){ 
	  if(!err){
		  if(result[0]){
				if(result[0].id){
				  if(req.session.cartService){
					var found = false;
					for(var i = 0;i< req.session.cartService.length;i++){
						if(req.session.cartService[i][0]==req.body.id){
							req.session.cartService[i][1]= (parseInt(req.session.cartService[i][1])+ parseInt(req.body.qty));
							found = true;
						}
					}
					if(!found){
						req.session.cartService.push([req.body.id, req.body.qty]);
					}
				  }else{
					  req.session.cartService=[];
					  req.session.cartService.push([req.body.id, req.body.qty]);
				  }
				  res.status(200);
				  res.send("success");
				  return;
				}
				else{
				  res.status(400);
				  res.send("Service id does not exist");
				  return;
				}
		  }
		  else{
			  res.status(500);
			  res.send("server error");
			  return;
			}
	  }else{
		next(err);
	  }
    });
  
});

app.get('/siteAdmin',function(req,res){
  var context = {};
   res.render('siteAdmin',context);
});

app.get('/yourTours',function(req,res){
  var context = {};
   res.render('yourTours',context);
});

app.post('/yourTours', function(req,res,next){
  if(req.session.customerId){
	var query = "SELECT Purchases_Tours.id AS purchase_id , Specific_Tours.id, Guided_Tour_Types.label, Specific_Tours.date, Guided_Tour_Types.meet_time FROM Purchases JOIN Purchases_Tours ON Purchases_Tours.purchase_id = Purchases.id JOIN Specific_Tours ON Specific_Tours.id = Purchases_Tours.tour_id JOIN Guided_Tour_Types ON Guided_Tour_Types.id =Specific_Tours.type_number WHERE Purchases.customer_id = ?";
	pool.query(query, [req.session.customerId],function(err,result){ 
	  if(!err){
		res.json(JSON.stringify(result));
		
	  }else{
		next(err);
	  }
    });
	  
	  
  }else{
	var data={};
	data.result = "NO USER";
	res.json(JSON.stringify(data));
	return
  }
});

app.post('/cancelTour', function(req,res,next){
  if(req.body.id){
	var query = "DELETE FROM Purchases_Tours WHERE id = ?";
	pool.query(query, [req.body.id],function(err,result){ 
	  if(!err){
		res.status(200);
		res.send("success");
		return;
	  }else{
		res.status(500);
		res.send("Could not delete");
		return;
	  }
	});
  }else{
	res.status(400);
    res.send("No purchase id provided");
	return;
  }
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

app.post('/editTourType', function(req,res,next){
  if(req.body.id&& req.body.label&& req.body.meet_time&& req.body.cost){
	var cost = req.body.cost;
	if(!isNaN(cost)){
		cost = cost*100;
		cost = Math.round(cost);
		var query = "SELECT id FROM Guided_Tour_Types WHERE label = ?";
		pool.query(query, [req.body.label],function(err1,result1){ 
		  if(!err1){
			if(result1[0]){
				if(result1[0].id){
					if(result1[0].id==req.body.id){
						var query = "UPDATE Guided_Tour_Types SET label = ?, meet_time = ?, cost = ? WHERE id = ?";
						pool.query(query, [req.body.label, req.body.meet_time, (cost), req.body.id],function(err,result){ 
						  if(!err){
							var context = {};
							res.render('siteAdmin',context);
							return;
						  }else{
							next(err);
						  }
						});
					}else{
						var context ={};
						context.label = req.body.label;
						context.meet_time = req.body.meet_time;
						context.cost = req.body.cost;
						context.id = req.body.id;
						context.error = "This tour already exists";
						res.render('editTourType',context);
						return;
					}
				}else{
					var context ={};
					context.label = req.body.label;
					context.meet_time = req.body.meet_time;
					context.cost = req.body.cost;
					context.id = req.body.id;
					context.error = "Unknown Error";
					res.render('editTourType',context);
					return;
				}
			}else{
				var query = "UPDATE Guided_Tour_Types SET label = ?, meet_time = ?, cost = ? WHERE id = ?";
				pool.query(query, [req.body.label, req.body.meet_time, (cost), req.body.id],function(err,result){ 
				  if(!err){
					var context = {};
					res.render('siteAdmin',context);
					return;
				  }else{
					next(err);
				  }
				});
			}
		  }else{
			next(err1);
		  }
		});
	}
	else{
		var context ={};
		context.label = req.body.label;
		context.meet_time = req.body.meet_time;
		context.cost = req.body.cost;
		context.id = req.body.id;
		context.error = "Cost must be valid";
		res.render('editTourType',context);
		return
	}
	  
  }else{
  
	var context ={};
	context.label = req.body.label;
	context.meet_time = req.body.meet_time;
	context.cost = req.body.cost;
	context.id = req.body.id;
	context.error = "Must enter all fields";
	res.render('editTourType',context);
	return
  }
});

app.post('/activeTourType', function(req,res,next){
  if(req.body.id&& (req.body.active=="0" ||req.body.active=="1")){
	var query = "UPDATE Guided_Tour_Types SET active = ? WHERE id = ?";
	pool.query(query, [req.body.active, req.body.id],function(err,result){ 
	  if(!err){
		var data={};
		data.result = "success";
		res.json(JSON.stringify(data));
		return;
	  }else{
		next(err);
	  }
	});
  }else{
	var data={};
	data.result = "Components not provided";
	res.json(JSON.stringify(data));
	return
  }
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

app.post('/editServiceType', function(req,res,next){
  if(req.body.id&& req.body.label&& req.body.description&& req.body.cost){
	var cost = req.body.cost;
	if(!isNaN(cost)){
		cost = cost*100;
		cost = Math.round(cost);
		var query = "SELECT id FROM Service_Types WHERE label = ?";
		pool.query(query, [req.body.label],function(err1,result1){ 
		  if(!err1){
			if(result1[0]){
				if(result1[0].id){
					if(result1[0].id==req.body.id){
						var query = "UPDATE Service_Types SET label = ?, description = ?, cost = ? WHERE id = ?";
						pool.query(query, [req.body.label, req.body.description, (cost), req.body.id],function(err,result){ 
						  if(!err){
							var context = {};
							res.render('siteAdmin',context);
							return;
						  }else{
							next(err);
						  }
						});
					}else{
						var context ={};
						context.label = req.body.label;
						context.description = req.body.description;
						context.cost = req.body.cost;
						context.id = req.body.id;
						context.error = "This service already exists";
						res.render('editServiceType',context);
						return;
					}
				}else{
					var context ={};
					context.label = req.body.label;
					context.description = req.body.description;
					context.cost = req.body.cost;
					context.id = req.body.id;
					context.error = "Unknown Error";
					res.render('editServiceType',context);
					return;
				}
			}else{
				var query = "UPDATE Service_Types SET label = ?, description = ?, cost = ? WHERE id = ?";
				pool.query(query, [req.body.label, req.body.description, (cost), req.body.id],function(err,result){ 
				  if(!err){
					var context = {};
					res.render('siteAdmin',context);
					return;
				  }else{
					next(err);
				  }
				});
			}
		  }else{
			next(err1);
		  }
		});
	}
	else{
		var context ={};
		context.label = req.body.label;
		context.description = req.body.description;
		context.cost = req.body.cost;
		context.id = req.body.id;
		context.error = "Cost must be valid";
		res.render('editServiceType',context);
		return
	}
	  
  }else{
  
	var context ={};
	context.label = req.body.label;
	context.description = req.body.description;
	context.cost = req.body.cost;
	context.id = req.body.id;
	context.error = "Must enter all fields";
	res.render('editServiceType',context);
	return
  }
});

app.post('/activeServiceType', function(req,res,next){
  if(req.body.id&& (req.body.active=="0" ||req.body.active=="1")){
	var query = "UPDATE Service_Types SET active = ? WHERE id = ?";
	pool.query(query, [req.body.active, req.body.id],function(err,result){ 
	  if(!err){
		var data={};
		data.result = "success";
		res.json(JSON.stringify(data));
		return;
	  }else{
		next(err);
	  }
	});
  }else{
	var data={};
	data.result = "Components not provided";
	res.json(JSON.stringify(data));
	return
  }
});

app.get('/editCustomer',function(req,res){
  var context = {};
  if(req.query.id){
	if(!req.query.first_name || req.query.first_name =="null")
		req.query.first_name = "";
	if(!req.query.last_name ||req.query.last_name=="null")
		req.query.last_name="";
	if(!req.query.street || req.query.street=="null")
		req.query.street="";
	if(!req.query.city || req.query.city=="null")
		req.query.city="";
	if(!req.query.state || req.query.state=="null"){
		req.query.state="NA";
		context.stateValue = "";
	}else{
		context.stateValue = req.query.state;
	}
	if(!req.query.zip ||req.query.zip=="null")
		req.query.zip="";
	if(!req.query.phone || req.query.phone=="null")
		req.query.phone="";
	if(!req.query.emergency_phone || req.query.emergency_phone=="null")
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
	
	res.render('editCustomer',context);
	return;
  }else{
	res.render('customers',context);
	return;
  }
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

function updateCustomer(context,req, res){
	var values = [];
	var query = "UPDATE Customers SET first_name=? , last_name = ?, street = ?, city = ?, state = ?, zip = ?, phone = ?, emergency_phone = ? WHERE id = ?"; 
	values.push(req.body.first_name);
	values.push(req.body.last_name);
	if(req.body.street!=""){
		values.push(req.body.street);
	}else{
		values.push(null);
	}
	if(req.body.city!=""){
		values.push(req.body.city);
	}else{
		values.push(null);
	}
	if(req.body.state!="" && req.body.state!="NA"){
		values.push(req.body.state);
	}else{
		values.push(null);
	}
	if(req.body.zip!=""){
		if(req.body.zip.length==5 && /^\d+$/.test(req.body.zip)){
			values.push(req.body.zip);
		}else{
			context.error = "Zip must have a length of 5 and contain numbers only";
			res.render('editCustomer',context);
			return
		}
	}else{
		values.push(null);
	}
	if(req.body.phone!=""){
		if(req.body.phone.length==10 && /^\d+$/.test(req.body.phone)){
			values.push(req.body.phone);
		}else{
			context.error = "Phone must have a length of 10 and contain numbers only";
			res.render('editCustomer',context);
			return
		}
	}else{
		values.push(null);
	}
	if(req.body.emergency_phone!=""){
		if(req.body.emergency_phone.length==10 && /^\d+$/.test(req.body.emergency_phone)){
			values.push(req.body.emergency_phone);
		}else{
			context.error = "Emergency Phone must have a length of 10 and contain numbers only";
			res.render('editCustomer',context);
			return
		}
	}else{
		values.push(null);
	}
	values.push(req.body.id);
	pool.query(query, values,function(err,result){ 
	  if(!err){
		context.success = "Success";
		res.render('editCustomer',context);
		return;
	  }else{
		res.status(500);
		res.send("Could not update");
		return;
	  }
	});
}

app.post('/editCustomer', function(req,res,next){
	context = {};
    if(!req.body.first_name || req.body.first_name =="null")
		context.first_name = "";
	if(!req.body.last_name ||req.body.last_name=="null")
		context.last_name="";
	if(!req.body.street || req.body.street=="null")
		req.body.street="";
	if(!req.body.city || req.body.city=="null")
		req.body.city="";
	if(!req.body.state || req.body.state=="null"){
		req.body.state="NA";
		context.stateValue = "";
	}else{
		context.stateValue = req.body.state;
	}
	if(!req.body.zip ||req.body.zip=="null")
		req.body.zip="";
	if(!req.body.phone || req.body.phone=="null")
		req.body.phone="";
	if(!req.body.emergency_phone || req.body.emergency_phone=="null")
		req.body.emergency_phone="";
	context.first_name = req.body.first_name;
	context.last_name = req.body.last_name;
	context.street = req.body.street;
	context.city = req.body.city;
	context.state = req.body.state;
	context.zip = req.body.zip;
	context.phone = req.body.phone;
	context.emergency_phone = req.body.emergency_phone;
	context.id = req.body.id;
  if(req.body.first_name&& req.body.last_name){
	var query = "SELECT id FROM Customers WHERE first_name = ? AND last_name = ?";
	pool.query(query, [req.body.first_name, req.body.last_name],function(err1,result1){ 
	  if(!err1){
		if(result1[0]){
			if(result1[0].id!=req.body.id){
				context.error = "This customer already exists";
				res.render('editCustomer',context);
				return;
			}else{
				updateCustomer(context,req,res);
				return;
			}
		}else{
			updateCustomer(context,req,res);
			return;
		}
	  }else{
		res.status(500);
		res.send("Failed Query for Customer Name");
		return;
	  }
	});
	
	  
  }else{
	context.error = "Must enter First Name and Last Name";
	res.render('editCustomer',context);
	return;
  }
});

app.get('/updateSpecificTours',function(req,res){
  var context = {};
   res.render('updateSpecificTours',context);
});

app.post('/removeSpecificTour', function(req,res,next){
  if(req.body.id){
		var query = "SELECT Specific_Tours.id, Guided_Tour_Types.label ,Specific_Tours.date, COUNT(Purchases.id) AS signedUp FROM Specific_Tours LEFT JOIN Purchases_Tours ON Purchases_Tours.tour_id = Specific_Tours.id LEFT JOIN Purchases ON Purchases_Tours.purchase_id = Purchases.id LEFT JOIN Guided_Tour_Types ON Guided_Tour_Types.id = Specific_Tours.type_number WHERE Specific_Tours.id = ?  GROUP BY Specific_Tours.id";
		pool.query(query, [req.body.id],function(err1,result1){ 
		  if(!err1){
			if(result1[0]){
				if(result1[0].signedUp==0){
					var query = "DELETE FROM Specific_Tours WHERE id = ?";
					pool.query(query, [req.body.id],function(err,result){ 
					  if(!err){
						var context = {};
						context.success = "Success";
						res.send(JSON.stringify(context));
						return;
					  }else{
						next(err);
					  }
					});
				}else{
					var context ={};
					context.error = "Resource is Active";
					res.send(JSON.stringify(context));
					return
				}
			}else{
				var context ={};
				context.error = "No Data";
				res.send(JSON.stringify(context));
				return
			}
		  }else{
			next(err1);
		  }
		});
  }else{
	var context ={};
	context.error = "Must have tour id";
	res.send(JSON.stringify(context));
	return
  }
});

app.get('/addTourType',function(req,res){
  var context = {};
   res.render('addTourType',context);
});

app.post('/addTourType', function(req,res,next){
  if(req.body.label&& req.body.meet_time&& req.body.cost){
	var cost = req.body.cost;
	if(!isNaN(cost)){
		cost = cost*100;
		cost = Math.round(cost);
		var query = "SELECT id FROM Guided_Tour_Types WHERE label = ?";
		pool.query(query, [req.body.label],function(err1,result1){ 
		  if(!err1){
			if(result1[0]){
				if(result1[0].id){
					var context ={};
					context.error = "This tour already exists";
					res.render('addTourType',context);
					return
				}else{
					var context ={};
					context.error = "Unknown Error";
					res.render('addTourType',context);
					return
				}
			}else{
				var query = "INSERT INTO Guided_Tour_Types(label, meet_time, cost) VALUES (?)";
				pool.query(query, [[req.body.label, req.body.meet_time, cost]],function(err,result){ 
				  if(!err){
					var context = {};
					context.success = "Success";
					res.render('addTourType',context);
					return;
				  }else{
					next(err);
				  }
				});
			}
		  }else{
			next(err1);
		  }
		});
	}
	else{
		var context ={};
		context.error = "Cost must be valid";
		res.render('addTourType',context);
		return
	}
	  
  }else{
  
	var context ={};
	context.error = "Must enter all fields";
	res.render('addTourType',context);
	return
  }
});

app.get('/addServiceType',function(req,res){
  var context = {};
   res.render('addServiceType',context);
});

app.post('/addServiceType', function(req,res,next){
  if(req.body.label&& req.body.description&& req.body.cost){
	var cost = req.body.cost;
	if(!isNaN(cost)){
		cost = cost*100;
		cost = Math.round(cost);
		var query = "SELECT id FROM Service_Types WHERE label = ?";
		pool.query(query, [req.body.label],function(err1,result1){ 
		  if(!err1){
			if(result1[0]){
				if(result1[0].id){
					var context ={};
					context.error = "This service already exists";
					res.render('addServiceType',context);
					return
				}else{
					var context ={};
					context.error = "Unknown Error";
					res.render('addServiceType',context);
					return
				}
			}else{
				var query = "INSERT INTO Service_Types(label, description, cost) VALUES (?)";
				pool.query(query, [[req.body.label, req.body.description, cost]],function(err,result){ 
				  if(!err){
					var context = {};
					context.success = "Success";
					res.render('addServiceType',context);
					return;
				  }else{
					next(err);
				  }
				});
			}
		  }else{
			next(err1);
		  }
		});
	}
	else{
		var context ={};
		context.error = "Cost must be valid";
		res.render('addServiceType',context);
		return
	}
	  
  }else{
  
	var context ={};
	context.error = "Must enter all fields";
	res.render('addServiceType',context);
	return
  }
});

app.get('/addSpecificTour',function(req,res){
  var context = {};
   res.render('addSpecificTour',context);
});

app.post('/addSpecificTour', function(req,res,next){
  if(req.body.date){
	if(req.body.type_number=="null"){
		var query = "INSERT INTO Specific_Tours(date) VALUES (?)";
		pool.query(query, [[req.body.date]],function(err,result){ 
		  if(!err){
			var context = {};
			context.success = "Success";
			res.render('addSpecificTour',context);
			return;
		  }else{
			next(err);
		  }
		});
	}else{
		var query = "INSERT INTO Specific_Tours(date, type_number) VALUES (?)";
		pool.query(query, [[req.body.date, req.body.type_number]],function(err,result){ 
		  if(!err){
			var context = {};
			context.success = "Success";
			res.render('addSpecificTour',context);
			return;
		  }else{
			next(err);
		  }
		});
	}
  }else{
  
	var context ={};
	context.error = "Date must be selected";
	res.render('addSpecificTour',context);
	return
  }
});

app.get('/purchases',function(req,res){
  var context = {};
   res.render('purchases',context);
});

app.post('/deletePurchase', function(req,res,next){
  if(req.body.id){
		var query = "DELETE FROM Purchases_Tours WHERE purchase_id =  ?";
		pool.query(query, [req.body.id],function(err1,result1){ 
		  if(!err1){
			var query = "DELETE FROM Purchases_Service_Types WHERE purchase_id = ?";
			pool.query(query, [req.body.id],function(err,result){ 
			  if(!err){
				var query = "DELETE FROM Purchases WHERE id = ?";
				pool.query(query, [req.body.id],function(err,result){ 
				  if(!err){
					res.status(200);
					res.send("success");
					return;
				  }else{
					res.status(500);
					res.send("Could not delete from Purchases");
					return;
				  }
				});
			  }else{
				res.status(500);
				res.send("Could not delete from Purchases_Service_Types");
				return;
			  }
			});
		  }else{
			res.status(500);
			res.send("Could not delete from Purchases_Tours");
			return;
		  }
		});
  }else{
	res.status(400);
	res.send("puchase id required");
	return;
  }
});

app.get('/viewPurchase',function(req,res){
  var context = {};
  context.id = req.query.id;
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

app.post('/createAccount', function(req,res,next){
  if(req.body.fname&& req.body.lname){
	var query = "SELECT id FROM Customers WHERE first_name = ? AND last_name = ?";
	pool.query(query, [req.body.fname, req.body.lname],function(err1,result1){ 
	  if(!err1){
		if(result1[0]){
			if(result1[0].id){
				var context ={};
				context.error = "This customer already exists";
				res.render('createAccount',context);
				return
			}else{
				var context ={};
				context.error = "Unknown Error";
				res.render('createAccount',context);
				return
			}
		}else{
			var values = [];
			var query = "INSERT INTO Customers(first_name, last_name"; 
			values.push(req.body.fname);
			values.push(req.body.lname);
			if(req.body.street!=""){
				query += ", street";
				values.push(req.body.street);
			}
			if(req.body.city!=""){
				query += ", city";
				values.push(req.body.city);
			}
			if(req.body.state!=""){
				query += ", state";
				values.push(req.body.state);
			}
			if(req.body.zip!=""){
				if(req.body.zip.length==5 && /^\d+$/.test(req.body.zip)){
					query += ", zip";
					values.push(req.body.zip);
				}else{
					var context ={};
					context.error = "Zip must have a length of 5 and contain numbers only";
					res.render('createAccount',context);
					return
				}
			}
			if(req.body.phone!=""){
				if(req.body.phone.length==10 && /^\d+$/.test(req.body.phone)){
					query += ", phone";
					values.push(req.body.phone);
				}else{
					var context ={};
					context.error = "Phone must have a length of 10 and contain numbers only";
					res.render('createAccount',context);
					return
				}
			}
			if(req.body.ephone!=""){
				if(req.body.ephone.length==10 && /^\d+$/.test(req.body.ephone)){
					query += ", emergency_phone";
					values.push(req.body.ephone);
				}else{
					var context ={};
					context.error = "Emergency Phone must have a length of 10 and contain numbers only";
					res.render('createAccount',context);
					return
				}
			}
			query += " ) VALUES (?)";
			pool.query(query, [values],function(err,result){ 
			  if(!err){
				var context = {};
				context.success = "Success: You are now signed in as " + req.body.fname + " " + req.body.lname;
				req.session.customerId = result.insertId;
				res.render('createAccount',context);
				return;
			  }else{
				next(err);
			  }
			});
		}
	  }else{
		next(err1);
	  }
	});
	
	  
  }else{
  
	var context ={};
	context.error = "Must enter First Name and Last Name";
	res.render('createAccount',context);
	return
  }
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
  
  query+= " ORDER BY Purchases.id";
	  
  pool.query(query, values,function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});

app.get('/purchaseInfoTable', function(req,res){
	if(!req.query.id){
		res.status(404);
	  res.send("puchase id required");
	  return;
	}
  var query = "SELECT Customers.first_name, Customers.last_name, Purchases.purchase_date FROM Purchases JOIN Customers ON Purchases.customer_id = Customers.id WHERE Purchases.id = ?";
  pool.query(query, req.query.id,function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});

app.get('/purchaseToursTable', function(req,res){
	if(!req.query.id){
		res.status(404);
	  res.send("puchase id required");
	  return;
	}
  var query = "SELECT Specific_Tours.date, Guided_Tour_Types.label, Guided_Tour_Types.cost FROM Purchases_Tours JOIN Specific_Tours ON Purchases_Tours.tour_id = Specific_Tours.id JOIN Guided_Tour_Types ON Specific_Tours.type_number = Guided_Tour_Types.id WHERE Purchases_Tours.purchase_id = ?";
  pool.query(query, req.query.id,function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});

app.get('/purchaseServicesTable', function(req,res){
	if(!req.query.id){
		res.status(404);
	  res.send("puchase id required");
	  return;
	}
  var query = "SELECT Service_Types.label, Service_Types.cost, Purchases_Service_Types.quantity FROM Purchases_Service_Types JOIN Service_Types ON Purchases_Service_Types.service_id = Service_Types.id WHERE Purchases_Service_Types.purchase_id = ?";
  pool.query(query, req.query.id,function(err,result){ 
    if(!err){
		res.send(JSON.stringify(result));
		
	}else{
		next(err);
	}
  });
});

app.get('/customersTable', function(req,res){
  var values = [];
  var query = "SELECT id, first_name, last_name, street, city, state, zip, phone, emergency_phone FROM Customers";
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

app.get('/toursTable', function(req,res){
  var values = [];
  var query = "SELECT Specific_Tours.id, Guided_Tour_Types.label ,Specific_Tours.date, COUNT(Purchases.id) AS signedUp FROM Specific_Tours LEFT JOIN Purchases_Tours ON Purchases_Tours.tour_id = Specific_Tours.id LEFT JOIN Purchases ON Purchases_Tours.purchase_id = Purchases.id LEFT JOIN Guided_Tour_Types ON Guided_Tour_Types.id = Specific_Tours.type_number";
  if(req.query.date || req.query.type){
	  query+= " WHERE";
	  var addAnd = false;
	  if(req.query.date){
		  query+= " Specific_Tours.date = ?"
		  values.push(req.query.date);
		  addAnd = true;
	  }
	  if(req.query.type){
		  if(addAnd){
			  query += " AND";
		  }
		  query+= " Guided_Tour_Types.label = ?"
		  values.push(req.query.type);
	  }
  }
  
  query += " GROUP BY Specific_Tours.id";
  
  if(req.query.signedUp){
	  query+= " HAVING";
	  if(req.query.signedUp){
		  if(req.query.signedUp == "true"){
			  query+= " signedUp > 0";
		  }
		  else{
			  query+= " signedUp = 0"
		  }
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

app.get('/addToursTable', function(req,res){
  var values = [];
  var query = "SELECT Specific_Tours.id, Specific_Tours.date, Guided_Tour_Types.label, Guided_Tour_Types.meet_time, Guided_Tour_Types.cost FROM Specific_Tours JOIN Guided_Tour_Types ON Specific_Tours.type_number = Guided_Tour_Types.id";
  if(req.query.date || req.query.type){
	  query+= " WHERE";
	  var addAnd = false;
	  if(req.query.date){
		  query+= " Specific_Tours.date = ?"
		  values.push(req.query.date);
		  addAnd = true;
	  }
	  if(req.query.type){
		  if(addAnd){
			  query += " AND";
		  }
		  query+= " Guided_Tour_Types.label = ?"
		  values.push(req.query.type);
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
