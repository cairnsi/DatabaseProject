function displayPurchaseInfoTable(){
	var req = new XMLHttpRequest();
	var path = "/purchaseInfoTable?id="+document.getElementById('id').value;
	req.open('GET', path, true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('purchaseInfoTable').innerHTML="";
			  var table = document.getElementById('purchaseInfoTable');
			  var response = JSON.parse(req.responseText);
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Purchase Date</th><th>Customer First Name</th><th>Customer Last Name</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.purchase_date.substring(0, 10);
				  cell = row.insertCell();
				  cell.textContent = item.first_name;
				  cell = row.insertCell();
				  cell.textContent = item.last_name;
			  }
		  }else{
			  //var row = table.insertRow();
			  //row.innerHTML = "<th>Did not get data for Table</th>"
		  }
	  });
	  req.send();
	  
}

function displayItemsTable(){
	var req = new XMLHttpRequest();
	var path = "/purchaseToursTable?id="+document.getElementById('id').value;
	req.open('GET', path, true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('itemsTable').innerHTML="";
			  var table = document.getElementById('itemsTable');
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
				  qty++;
			  }
		  }else{
			  //var row = table.insertRow();
			  //row.innerHTML = "<th>Did not get data for Table</th>"
		  }
	  });
	  req.send();
	  
}
displayPurchaseInfoTable();