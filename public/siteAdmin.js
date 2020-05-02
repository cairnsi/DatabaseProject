function bindButtons(){
  document.getElementsByClassName('editTourType')[0].addEventListener('click', function(event){
	  var path = '/editTourType';
	  req.open('GET', path, false);
		req.addEventListener('load',function(){
			clearMessages();
			if(req.status >= 200 && req.status < 400){
				location.href = path;
			} else {
				console.log("Error in network request: " + req.statusText);
				document.getElementById('addMessage').textContent="Could Not Edit";
				document.getElementById('addMessage').style.color='red';
			}
		});
		req.send();
  }
}
document.addEventListener('DOMContentLoaded', bindButtons);