
function clearMessages(){
	 var messages = document.getElementsByClassName('message');
	 for (i = 0; i < messages.length; i++) {
		 messages[i].textContent="";
	 }
}

function bindButtons(){
  document.getElementById('updateSubmit').addEventListener('click', function(event){
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
	  payload.id = document.getElementById('id').value;
	  req.open('POST', '/update', true);
	  req.setRequestHeader('Content-Type', 'application/json');
	  req.addEventListener('load',function(){
	  clearMessages();
	  if(req.status >= 200 && req.status < 400){
		location.href = "/";
	  } else {
		console.log("Error in network request: " + req.statusText);
		document.getElementById('addMessage').textContent="Could Not Insert";
		document.getElementById('addMessage').style.color='red';
	  }});
	  req.send(JSON.stringify(payload));
	  event.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', bindButtons);
