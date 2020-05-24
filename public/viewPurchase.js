function displayPurchaseInfoTable(){
	var req = new XMLHttpRequest();
	var path = "/purchaseInfoTable?id="+document.getElementById('id');
	req.open('GET', path, true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('purchaseInfoTable').innerHTML="";
			  var table = document.getElementById('purchaseInfoTable');
			  var response = JSON.parse(req.responseText);
			  response = JSON.parse(response);
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Purchase Date</th><th>Customer First Name</th><th>Customer Last Name</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.date.substring(0, 10);
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
displayYourToursTable();