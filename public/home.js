
function clearMessages(){
	 var messages = document.getElementsByClassName('message');
	 for (i = 0; i < messages.length; i++) {
		 messages[i].textContent="";
	 }
}

function displayTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/table', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  document.getElementById('workoutList').innerHTML="";
		  var table = document.getElementById('workoutList');
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

function bindDelete(elementID){
	return function(){
		var req = new XMLHttpRequest();
		var payload = {id:null};
		payload.id = elementID;
		req.open('POST', '/tableDelete', true);
	    req.setRequestHeader('Content-Type', 'application/json');
	    req.addEventListener('load',function(){
			clearMessages();
			if(req.status >= 200 && req.status < 400){
				displayTable();
			} else {
				console.log("Error in network request: " + req.statusText);
				document.getElementById('addMessage').textContent="Could Not Insert";
				document.getElementById('addMessage').style.color='red';
			}
		});
	  req.send(JSON.stringify(payload));
	}
}

function bindEdit(item){
	return function(){
		var req = new XMLHttpRequest();
		if(!item.reps && item.reps!="0")
			item.reps = "";
		if(!item.weight && item.weight!="0")
			item.weight="";
		if(!item.lbs)
			item.lbs="";
		if(!item.date)
			item.date="";
		var path = '/editItem?id='+item.id+'&name='+item.name+'&reps='+item.reps+'&weight='+item.weight+'&units='+item.lbs+'&date='+item.date;
		req.open('GET', path, false);
	    req.addEventListener('load',function(){
			clearMessages();
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
  document.getElementById('insertSubmit').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  var payload = {name:null};
	  if(document.getElementById('name').value==""){
		  clearMessages();
		 document.getElementById('addMessage').textContent="Name cannot be empty";
		 document.getElementById('addMessage').style.color='red';
		 event.preventDefault();
		 return;
	  }
	  payload.name = document.getElementById('name').value;
	  payload.reps = document.getElementById('reps').value;
	  payload.weight = document.getElementById('weight').value;
	  payload.units = document.getElementById('unit').value;
	  payload.date = document.getElementById('date').value;
	  req.open('POST', '/tableInsert', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
	  clearMessages();
	  if(req.status >= 200 && req.status < 400){
		var response = JSON.parse(req.responseText);
		 document.getElementById('name').value="";
		 document.getElementById('reps').reps="";
		 document.getElementById('addMessage').textContent="Successful Insert";
		 document.getElementById('addMessage').style.color='green';
		 displayTable();
	  } else {
		console.log("Error in network request: " + req.statusText);
		document.getElementById('addMessage').textContent="Could Not Insert";
		document.getElementById('addMessage').style.color='red';
	  }});
	  req.send(JSON.stringify(payload));
	  event.preventDefault();
  });
  
  document.getElementById('tableReset').addEventListener('click', function(event){
	  var req = new XMLHttpRequest();
	  req.open('POST', '/tableReset', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		    clearMessages();
			if(req.status < 200 && req.status >= 400){
				document.getElementById('addMessage').textContent="Could Not Clear Table";
				document.getElementById('addMessage').style.color='red';
			}
			displayTable();
		});
		req.send();
		event.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', bindButtons);
displayTable()
