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
				  cost +=(item.cost/100)
				  cell = row.insertCell();
				  cell.textContent = "1";
				  
				  
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'remove');
				  btn.innerHTML = 'remove';
				  //btn.onclick =  bindAddToCart(item);
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
						  cost +=((item.cost/100)*parseInt(item.qty));
						  cell = row.insertCell();
						  cell.textContent = item.qty;
						  
						  
						  
						  var btn = document.createElement('button');
						  btn.setAttribute('class', 'remove');
						  btn.innerHTML = 'remove';
						  //btn.onclick =  bindAddToCart(item);
						  row.appendChild(btn);
						  qty+= parseInt(item.qty);
					  }
					  document.getElementById('cost').innerHTML="$"+cost;
					  document.getElementById('qty').innerHTML=qty;
				  }
			  });
			  innerreq.send();
		  }else{
			  
		  }
	  });
	  req.send();
	  
}

function bindAddToCart(item){
	return function(){
		if(document.getElementById(item.selectId).value<1){
			document.getElementById('success').innerHTML="";
			document.getElementById('error').innerHTML="Please select a quantity";
			return;
		}
	    var req = new XMLHttpRequest();
		  var payload = {};
		  payload.id = item.id;
		  payload.qty = document.getElementById(item.selectId).value;
		  req.open('POST', '/addServiceToCart', true);
		  req.setRequestHeader('Content-Type', 'application/json');
		  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			document.getElementById('error').innerHTML="";
			document.getElementById('success').innerHTML=item.label + " added to cart";
			document.getElementById(item.selectId).value = 0;
		  } else {
			console.log("Error in network request: " + req.statusText);
			document.getElementById('success').innerHTML="";
			document.getElementById('error').innerHTML="Error adding item to cart";
		  }});
		  req.send(JSON.stringify(payload));
		  event.preventDefault();
	}
}

function bindCheckout(){
	var serviceElements = document.getElementById('checkout').addEventListener('click', function(event){
	  event.preventDefault();
	  var req = new XMLHttpRequest();
	  req.open('POST', '/yourTours', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('success').innerHTML="success";
		  }else if(req.status==400){
			  document.getElementById('error').innerHTML=req.responseText;
		  }
		});
	});
}
displayCartTable();
bindCheckout();
