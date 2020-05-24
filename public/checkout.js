function displayCartTable(){
	var req = new XMLHttpRequest();
	req.open('GET', '/cartToursTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('cartTable').innerHTML="";
			  var table = document.getElementById('cartTable');
			  var response = JSON.parse(req.responseText);
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Item</th><th>Type</th><th>Cost</th><th>Quantity</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  var itemname = item.label + " ("+ item.date + ") ";
				  cell.textContent = itemname;
				  cell = row.insertCell();
				  cell.textContent = "Tour";
				  cell = row.insertCell();
				  cell.textContent = '$'+(item.cost/100);
				  cell = row.insertCell();
				  cell.textContent = "0";
				  
				  
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'remove');
				  btn.innerHTML = 'remove';
				  //btn.onclick =  bindAddToCart(item);
				  row.appendChild(btn);
			  }
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
displayCartTable()
