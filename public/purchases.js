function displayPurchaseTable(input){
	var query = "/purchasesTable?";
	if(input.date){
		query+="date="+input.date+"+";
	}
	if(input.first_name){
		query+="first_name="+input.first_name+"+";
	}
	if(input.last_name){
		query+="last_name="+input.last_name+"+";
	}
	var req = new XMLHttpRequest();
	req.open('GET', query, true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('purchasesTable').innerHTML="";
			  var table = document.getElementById('purchasesTable');
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>No Data Found</th>";
				return;
			  }
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Purchase Date</th><th>First Name</th><th>Last Name</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.purchase_date;
				  cell = row.insertCell();
				  cell.textContent = item.first_name;
				  cell = row.insertCell();
				  cell.textContent = item.last_name;
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'view');
				  btn.innerHTML = 'View';
				  btn.onclick =  bindViewPurchase(item);
				  row.appendChild(btn);
				  
				  cell = row.insertCell();
				  cell.textContent = item.id;
				  cell.style.visibility = "hidden";
				  cell.id = "rowId";
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
displayPurchaseTable(input);
bindFilter();