/* --Begin Variable declarations-- */

var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

var cache = {}

/* --End Variable declarations-- */

/* --Begin Responses-- */

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write("Error 404: Resource not found.");
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"Content-Type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

/* --End Responses-- */

/* --Serve Static Files-- */

function serveStatic(response, cache, absPath) {
	console.log("Looking up for : " + absPath)
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists){
			if (exists) {
				fs.readFile(absPath, function(error, data){
					if (error) {
						send404(response);
					}
					else{
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}

/* --End static files-- */

/* --HTTP Server logic-- */

var server = http.createServer(function(request, response){
	var filePath = false;
	if (request.url == '/') {
		filePath = 'public/index.html';
	}
	else{
		filePath = 'public' + request.url;
	}
	var absPath = "./" + filePath;
	serveStatic(response, cache, absPath);
});
server.listen(3000, function(){
	console.log("Server Listening on port 3000.")
})

/* --End Server-- */