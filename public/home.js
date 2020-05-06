function displayTourTypeTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/tourTypeTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  document.getElementById('toursTypesTable').innerHTML="";
		  var table = document.getElementById('toursTypesTable');
		  if(req.status >= 200 && req.status < 400){
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>Table is empty</th>"
				document.getElementById('tableReset').style.visibility = "hidden";
				return;
			  }
			  document.getElementById('tableReset').style.visibility = "visible";
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Name</th><th>Reps</th><th>Weight</th><th>Unit</th><th>Date</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = cell = row.insertCell();
				  cell.textContent = item.name;
				  cell.style.width = "15%";
				  cell = row.insertCell();
				  cell.textContent = item.reps;
				  cell.style.width = "15%";
				  cell = row.insertCell();
				  cell.textContent = item.weight;
				  cell.style.width = "15%";
				  cell = row.insertCell();
				  cell.textContent = item.lbs;
				  cell.style.width = "15%";
				  cell = row.insertCell();
				  cell.textContent = item.date;
				  cell.style.width = "15%";
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'edit');
				  btn.innerHTML = 'Edit';
				  btn.onclick =  bindEdit(item);
				  row.appendChild(btn);
				  
				  btn = document.createElement('button');
				  btn.setAttribute('class', 'delete');
				  btn.innerHTML = 'Delete';
				  btn.style.marginLeft = "2px"
				  btn.onclick =  bindDelete(item.id);
				  row.appendChild(btn);
				  
				  
				  cell = row.insertCell();
				  cell.textContent = item.id;
				  cell.style.visibility = "hidden";
				  cell.id = "rowId";
			  }
		  }else{
			  var row = table.insertRow();
			  row.innerHTML = "<th>Did not get data for Table</th>"
		  }
	  });
	  req.send();
	  
}
displayTourTypeTable()
