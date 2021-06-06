(() => {
	const isValidUrl = (string) => {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(string);
	}

	$(window).ready(function() {
		$("#shorten").click(function(event) {
			let theurl = $("#url").val();

			if (!isValidUrl(theurl)) return alert("Invalid URL.");
			if (!theurl.includes("http")) return alert("URL is missing protocol.");


      fetch('/api/shorturl/new', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }, 
        body: JSON.stringify({
          url: theurl
        })
      }).then(function(response)  { //promise to facilitate with the async nature of the post request
        response.json().then(function(parsedJson) {

          console.log('this is the parsed result json: ', parsedJson);
          var oriUrl = parsedJson['original_url'];
          window.location.href = oriUrl;

        })
        
      }).catch(err => {
        console.log(err)
      });

			event.preventDefault(); // Prevent refresh
		});
	});
})();