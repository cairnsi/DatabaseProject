function displayTourTypeTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/tourTypeTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('toursTypesTable').innerHTML="";
			  var table = document.getElementById('toursTypesTable');
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>Table is empty</th>";
				return;
			  }
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Tour</th><th>Meet Time</th><th>Cost</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.label;
				  cell = row.insertCell();
				  cell.textContent = item.meet_time;
				  cell.style.width = "15%";
				  cell = row.insertCell();
				  cell.textContent = '$'+(item.cost/100);
				  cell.style.width = "15%";
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'editTourType');
				  btn.innerHTML = 'Edit';
				  btn.onclick =  bindEditTourType(item);
				  row.appendChild(btn);
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'removeTourType');
				  btn.innerHTML = 'Remove';
				  //btn.onclick =  bindEdit(item);
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
function bindEditTourType(item){
	return function(){
		var req = new XMLHttpRequest();
		if(!item.label)
			item.label = "";
		if(!item.meet_time)
			item.meet_time="";
		if(!item.cost)
			item.cost="";
		var path = '/editTourType?id='+item.id+'&label='+item.label+'&meet_time='+item.meet_time+'&cost='+item.cost;
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
	}
}



function bindButtons(){
	var tourElements = document.getElementsByClassName('editTourType');
	for (var i = 0; i < tourElements.length; i++) {
	  tourElements[i].addEventListener('click', function(event){
		  var req = new XMLHttpRequest();
		  var path = '/editTourType';
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
	
	var serviceElements = document.getElementsByClassName('editServiceType');
	for (var i = 0; i < serviceElements.length; i++) {
	  serviceElements[i].addEventListener('click', function(event){
		  var req = new XMLHttpRequest();
		  var path = '/editServiceType';
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
	
	var serviceElements = document.getElementById('addTourType').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var path = '/addTourType';
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
	
	var serviceElements = document.getElementById('addServiceType').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var path = '/addServiceType';
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
document.addEventListener('DOMContentLoaded', bindButtons);
displayTourTypeTable();