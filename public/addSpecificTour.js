function createTourTypeOptions(){
	var req = new XMLHttpRequest();
	req.open('GET', '/tourTypeTable', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
		  if(req.status >= 200 && req.status < 400){
			  var typeSelect = document.getElementById('type_number');
			  var response = JSON.parse(req.responseText);
			  for(var i = 0;i<response.length;i++){
				  var item = response[i];
				  if(!item.active){
					  continue;
				  }
				  var option = document.createElement("option");
				  option.text = item.label;
				  option.value = item.id;
				  typeSelect.add(option); 
			  }
		  }else{
			  
		  }
	  });
	  req.send();
}
createTourTypeOptions();