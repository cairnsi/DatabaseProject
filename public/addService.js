function displayServiceTypeTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/serviceTypesTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('addServiceTable').innerHTML="";
			  var table = document.getElementById('addServiceTable');
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
				  if(!item.active){
					  continue;
				  }
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.label;
				  cell = row.insertCell();
				  cell.textContent = item.description;
				  cell = row.insertCell();
				  cell.textContent = '$'+(item.cost/100);
				  
				  var selectId = "select" + i;
				  item.selectId = selectId;
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'add');
				  btn.innerHTML = 'Add to Cart';
				  btn.onclick =  bindAddToCart(item);
				  row.appendChild(btn);
				  
				  var qty = document.createElement("SELECT");
				  qty.setAttribute('id', selectId);
				  for(var j = 0;j<6;j++){
					  var item = j;
					  var option = document.createElement("option");
					  option.text = j;
					  option.value = j;
					  qty.add(option); 
					  
				  }
				  row.appendChild(qty);
			  }
		  }else{
			  
		  }
	  });
	  req.send();
	  
}

function bindAddToCart(item){
	return function(){
	    var req = new XMLHttpRequest();
		  var payload = {};
		  payload.id = item.id;
		  payload.qty = document.getElementById(item.selectId).value
		  req.open('POST', '/addServiceToCart', true);
		  req.setRequestHeader('Content-Type', 'application/json');
		  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			document.getElementById('error').innerHTML="";
			document.getElementById('success').innerHTML=item.label + " added to cart";
		  } else {
			console.log("Error in network request: " + req.statusText);
			document.getElementById('success').innerHTML="";
			document.getElementById('error').innerHTML="Error adding item to cart";
		  }});
		  req.send(JSON.stringify(payload));
		  event.preventDefault();
	}
}
displayServiceTypeTable()
