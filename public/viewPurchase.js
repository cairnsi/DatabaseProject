function displayPurchaseInfoTable(){
	var req = new XMLHttpRequest();
	req.open('POST', '/purchaseInfoTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  document.getElementById('purchaseInfoTable').innerHTML="";
			  var table = document.getElementById('purchaseInfoTable');
			  var response = JSON.parse(req.responseText);
			  response = JSON.parse(response);
			  if(response.result){
				  document.getElementById('error').innerHTML="Please sign in to view your tours";
				  return;
			  }
			  if(response.length<1){
				var row = table.insertRow();
				row.innerHTML = "<th>You are not signed up for any tours</th>";
				return;
			  }
			  
			  table.innerHTML="";
			  var row = table.insertRow();
			  row.innerHTML = "<th>Tour</th><th>Date</th><th>Meet Time</th>";
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  row = table.insertRow();
				  var cell = row.insertCell();
				  cell.textContent = item.label;
				  cell = row.insertCell();
				  cell.textContent = item.date;
				  cell = row.insertCell();
				  cell.textContent = item.meet_time;
				  
				  var btn = document.createElement('button');
				  btn.setAttribute('class', 'cancel');
				  btn.innerHTML = 'Cancel';
				  //btn.onclick =  bindEditServiceType(item);
				  row.appendChild(btn);
				  
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
displayYourToursTable();