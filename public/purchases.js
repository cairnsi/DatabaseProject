function bindButtons(){
	var tourElements = document.getElementsByClassName('viewPurchase');
	for (var i = 0; i < tourElements.length; i++) {
	  tourElements[i].addEventListener('click', function(event){
		  var req = new XMLHttpRequest();
		  var path = '/viewPurchase';
		  req.open('GET', path, false);
			req.addEventListener('load',function(){
				if(req.status >= 200 && req.status < 400){
					location.href = path;
				} else {
					console.log("Error in network request: " + req.statusText);
					document.getElementById('addMessage').textContent="Could Not Edit";
					document.getElementById('addMessage').style.color='red';
				}
			});
			req.send();
	  });
	}
	
}
document.addEventListener('DOMContentLoaded', bindButtons);