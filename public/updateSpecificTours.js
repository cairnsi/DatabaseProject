function displayToursTable(input){
	var query = "/toursTable?";
	if(input.date){
		query+="date="+input.date+"&";
	}
	if(input.type){
		query+="type="+input.type+"&";
	}
	if(input.signedUp){
		query+="signedUp="+input.signedUp;
	}
	var req = new XMLHttpRequest();
	req.open('GET', query, true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('specificToursTable').innerHTML="";
			  var table = document.getElementById('specificToursTable');
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>No Data Found</th>";
				return;
			  }
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Type</th><th>Date</th><th>Signed up</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.label;
				  cell = row.insertCell();
				  cell.textContent = item.date.substring(0, 10);
				  cell = row.insertCell();
				  cell.textContent = item.signedUp;
				  
				  if(item.signedUp==0){
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'remove');
				  btn.innerHTML = 'Remove';
				  btn.onclick =  bindRemoveSpecificTour(item);
				  row.appendChild(btn);
				  }
			  }
		  }else{
		  }
	  });
	  req.send();
	  
}

function bindRemoveSpecificTour(item){
	return function(){
	    var req = new XMLHttpRequest();
		  var payload = {};
		  payload.id = item.id;
		  req.open('POST', '/removeSpecificTour', true);
		  req.setRequestHeader('Content-Type', 'application/json');
		  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			  var item = {};
			  var date = document.getElementById('tourDate').value;
			  var type = document.getElementById('type').value;
			  var signedUp = document.getElementById('signedUp').value;
			  if(date!=""){
				  item.date = date;
			  }
			  if(type!=""){
				  item.type = type;
			  }
			  if(signedUp!=""){
				  item.signedUp = signedUp;
			  }
			  displayToursTable(item);
		  } else {
			console.log("Error in network request: " + req.statusText);
		  }});
		  req.send(JSON.stringify(payload));
		  event.preventDefault();
	}
}

function bindFilter(){
	var serviceElements = document.getElementById('filter').addEventListener('click', function(event){
	  event.preventDefault();
	  var item = {};
	  var date = document.getElementById('tourDate').value;
	  var type = document.getElementById('type').value;
	  var signedUp = document.getElementById('signedUp').value;
	  if(date!=""){
		  item.date = date;
	  }
	  if(type!=""){
		  item.type = type;
	  }
	  if(signedUp!=""){
		  item.signedUp = signedUp;
	  }
	  displayToursTable(item);
	});
}

function bindReset(){
	var serviceElements = document.getElementById('reset').addEventListener('click', function(event){
	  document.getElementById('tourDate').value = "";
	  document.getElementById('Type').value = "";
	  document.getElementById('signedUp').value = "";
	  event.preventDefault();
	  var item = {};
	  var date = document.getElementById('tourDate').value;
	  var type = document.getElementById('Type').value;
	  if(date!=""){
		  item.date = date;
	  }
	  if(type!=""){
		  item.type = type;
	  }
	  displayToursTable(item);
	});
}

function bindAddButton(){
	var serviceElements = document.getElementById('addSpecificTour').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var path = '/addSpecificTour';
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

function createTourTypeOptions(){
	var req = new XMLHttpRequest();
	req.open('GET', '/tourTypeTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  var typeSelect = document.getElementById('type');
			  var response = JSON.parse(req.responseText);
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  var option = document.createElement("option");
				  option.text = item.label;
				  option.value = item.label;
				  typeSelect.add(option); 
			  }
		  }else{
			  
		  }
	  });
	  req.send();
}
document.addEventListener('DOMContentLoaded', bindAddButton);
document.addEventListener('DOMContentLoaded', bindFilter);
document.addEventListener('DOMContentLoaded', bindReset);

var input = {};
displayToursTable(input);
createTourTypeOptions();