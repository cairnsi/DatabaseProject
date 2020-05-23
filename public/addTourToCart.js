function displayToursTable(input){
	var query = "/addToursTable?";
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
			  document.getElementById('addToursTable').innerHTML="";
			  var table = document.getElementById('addToursTable');
			  var response = JSON.parse(req.responseText);
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>No Data Found</th>";
				return;
			  }
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Type</th><th>Date</th><th>Meet Time</th><th>Cost</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.label;
				  cell = row.insertCell();
				  cell.textContent = item.date;
				  cell = row.insertCell();
				  cell.textContent = item.meet_time;
				  cell = row.insertCell();
				  cell.textContent = "$"+(item.cost/100);
				  
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'add');
				  btn.innerHTML = 'Add to Cart';
				  //btn.onclick =  bindRemoveSpecificTour(item);
				  row.appendChild(btn);
			  }
		  }else{
		  }
	  });
	  req.send();
}

function bindFilter(){
	var serviceElements = document.getElementById('filter').addEventListener('click', function(event){
	  event.preventDefault();
	  var item = {};
	  var date = document.getElementById('tourDate').value;
	  var type = document.getElementById('type').value;
	  if(date!=""){
		  item.date = date;
	  }
	  if(type!=""){
		  item.type = type;
	  }
	  displayToursTable(item);
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

document.addEventListener('DOMContentLoaded', bindFilter);
var input = {};
displayToursTable(input);
createTourTypeOptions()