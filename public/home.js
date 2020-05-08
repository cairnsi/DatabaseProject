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
				row.innerHTML = "<th>Table is empty</th>"
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
				  cell = row.insertCell();
				  cell.textContent = '$'+(item.cost/100);
				  
				  
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

function displayServiceTypeTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/serviceTypesTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('serviceTypesTable').innerHTML="";
			  var table = document.getElementById('serviceTypesTable');
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>Table is empty</th>"
				return;
			  }
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Service Types</th><th>Description</th><th>Cost</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.label;
				  cell = row.insertCell();
				  cell.textContent = item.description;
				  cell = row.insertCell();
				  cell.textContent = '$'+(item.cost/100);
				  cell.style.width = "15%";
				  
				  
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
displayTourTypeTable()
displayServiceTypeTable()
