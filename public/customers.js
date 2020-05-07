function displayCustomersTable(input){
	var query = "/customersTable?";
	if(input.first_name){
		query+="first_name="+input.first_name+"+";
	}
	if(input.last_name){
		query+="last_name="+input.last_name+"+";
	}
	if(input.phone){
		query+="phone="+input.phone+"+";
	}
	var req = new XMLHttpRequest();
	req.open('GET', query, true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('customersTable').innerHTML="";
			  var table = document.getElementById('customersTable');
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>No Data Found</th>";
				return;
			  }
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>First Name</th><th>Last Name</th><th>Street</th><th>City</th><th>State</th><th>Zip</th><th>Phone</th><th>Emergency Phone</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.first_name;
				  
				  cell = row.insertCell();
				  cell.textContent = item.last_name;
				  cell = row.insertCell();
				  cell.textContent = item.street;
				  cell = row.insertCell();
				  cell.textContent = item.city;
				  cell = row.insertCell();
				  cell.textContent = item.state;
				  cell = row.insertCell();
				  cell.textContent = item.zip;
				  cell = row.insertCell();
				  cell.textContent = item.phone;
				  cell = row.insertCell();
				  cell.textContent = item.emergency_phone;
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'edit');
				  btn.innerHTML = 'Edit';
				  //btn.onclick =  bindViewPurchase(item);
				  row.appendChild(btn);
			  }
		  }else{
			  //var row = table.insertRow();
			  //row.innerHTML = "<th>Did not get data for Table</th>"
		  }
	  });
	  req.send();
	  
}

function bindViewPurchase(item){
	return function(){
		var req = new XMLHttpRequest();
		var path = '/viewPurchase?id='+item.id;
		req.open('GET', path, false);
	    req.addEventListener('load',function(){
			if(req.status >= 200 && req.status < 400){
				location.href = path;
			} else {
				console.log("Error in network request: " + req.statusText);
			}
		});
	    req.send();
	}
}

function bindFilter(){
	var serviceElements = document.getElementById('filter').addEventListener('click', function(event){
	  event.preventDefault();
	  var item = {};
	  var date = document.getElementById('purchaseDate').value;
	  var fname = document.getElementById('fname').value;
	  var lname = document.getElementById('lname').value;
	  if(date!=""){
		  item.date = date;
	  }
	  if(fname!=""){
		  item.first_name = fname;
	  }
	  if(lname!=""){
		  item.last_name = lname;
	  }
	  displayPurchaseTable(item);
	});
}


function bindButtons(){
	var tourElements = document.getElementsByClassName('viewPurchase');
	for (var i = 0; i < tourElements.length; i++) {
	  tourElements[i].addEventListener('click', function(event){
		  var req = new XMLHttpRequest();
		  var path = '/viewPurchase';
		  req.open('GET', path, false);
			req.addEventListener('load',function(){
				if(req.status >= 200 && req.status < 400){
					location.href = path;
				} else {
					console.log("Error in network request: " + req.statusText);
					document.getElementById('addMessage').textContent="Could Not Edit";
					document.getElementById('addMessage').style.color='red';
				}
			});
			req.send();
	  });
	}
	
}
//document.addEventListener('DOMContentLoaded', bindButtons);
var input={};
displayCustomersTable(input);
bindFilter();