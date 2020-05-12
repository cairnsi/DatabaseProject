function displayToursTable(input){
	var query = "/toursTable?";
	if(input.date){
		query+="date="+input.date+"&";
	}
	if(input.type){
		query+="type="+input.type;
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
				  cell.textContent = item.date;
				  cell = row.insertCell();
				  cell.textContent = item.signedUp;
				  
				  if(item.signedUp==0){
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'remove');
				  btn.innerHTML = 'Remove';
				  row.appendChild(btn);
				  }
			  }
		  }else{
			  //var row = table.insertRow();
			  //row.innerHTML = "<th>Did not get data for Table</th>"
		  }
	  });
	  req.send();
	  
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
document.addEventListener('DOMContentLoaded', bindAddButton);

var input = {};
displayToursTable(input);