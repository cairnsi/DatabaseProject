function displayCartTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/cartToursTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('cartTable').innerHTML="";
			  var table = document.getElementById('cartTable');
			  var response = JSON.parse(req.responseText);
			  var cost = 0;
			  var qty = 0;
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Item</th><th>Type</th><th>Cost</th><th>Quantity</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  var itemname = item.label + " ("+ item.date.substring(0, 10) + ") ";
				  cell.textContent = itemname;
				  cell = row.insertCell();
				  cell.textContent = "Tour";
				  cell = row.insertCell();
				  cell.textContent = '$'+(item.cost/100);
				  cost +=parseInt(item.cost)
				  cell = row.insertCell();
				  cell.textContent = "1";
				  
				  
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'remove');
				  btn.innerHTML = 'remove';
				  btn.onclick =  bindRemoveTour(item);
				  row.appendChild(btn);
				  qty++;
			  }
			  var innerreq = new XMLHttpRequest();
			  innerreq.open('GET', '/cartServiceTable', true);
			  innerreq.setRequestHeader('Content-Type', 'application/json');
			  innerreq.addEventListener('load',function(){
				  if(innerreq.status >= 200 && innerreq.status < 400){
					  var table = document.getElementById('cartTable');
					  var response = JSON.parse(innerreq.responseText);
					  for(var i = 0;i<response.length;i++){
						  var item = response[i];
						  row = table.insertRow();
						  var cell = row.insertCell();
						  cell.textContent = item.label;
						  cell = row.insertCell();
						  cell.textContent = "Service";
						  cell = row.insertCell();
						  cell.textContent = '$'+(item.cost/100);
						  cost +=(parseInt(item.cost)*parseInt(item.qty));
						  cell = row.insertCell();
						  cell.textContent = item.qty;
						  
						  
						  
						  var btn = document.createElement('button');
						  btn.setAttribute('class', 'remove');
						  btn.innerHTML = 'remove';
						  btn.onclick =  bindRemoveService(item);
						  row.appendChild(btn);
						  qty+= parseInt(item.qty);
					  }
					  document.getElementById('cost').innerHTML="$"+(cost/100);
					  document.getElementById('qty').innerHTML=qty;
				  }
			  });
			  innerreq.send();
		  }else{
			  
		  }
	  });
	  req.send();
	  
}

function bindRemoveTour(item){
	return function(){
		  var req = new XMLHttpRequest();
		  var payload = {};
		  payload.id = item.id;
		  req.open('POST', '/removeTourCart', true);
		  req.setRequestHeader('Content-Type', 'application/json');
		  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			displayCartTable()
		  } else {
			console.log("Error in network request: " + req.statusText);
		  }});
		  req.send(JSON.stringify(payload));
		  event.preventDefault();
	}
}

function bindRemoveService(item){
	return function(){
		  var req = new XMLHttpRequest();
		  var payload = {};
		  payload.id = item.id;
		  req.open('POST', '/removeServiceCart', true);
		  req.setRequestHeader('Content-Type', 'application/json');
		  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			displayCartTable()
		  } else {
			console.log("Error in network request: " + req.statusText);
		  }});
		  req.send(JSON.stringify(payload));
		  event.preventDefault();
	}
}

function bindCheckout(){
	var serviceElements = document.getElementById('checkout').addEventListener('click', function(event){
	  event.preventDefault();
	  var req = new XMLHttpRequest();
	  req.open('POST', '/checkout', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('error').innerHTML="";
			  document.getElementById('success').innerHTML="success";
		  }else if(req.status==400){
			  document.getElementById('success').innerHTML="";
			  document.getElementById('error').innerHTML=req.responseText;
		  }else if(req.status==409){
			  var response = JSON.parse(req.responseText);
			  var message = "You are already signed up for: ";
			  for(var i=0;i<response.length;i++){
				  var item = response[i];
				  message += item.label + " ("+ item.date.substring(0, 10) + "),  ";
			  }
			  message += " Please remove them before checkout";
			  document.getElementById('success').innerHTML="";
			  document.getElementById('error').innerHTML= message;
		    }
		});
		req.send();
	});
}
displayCartTable();
bindCheckout();
