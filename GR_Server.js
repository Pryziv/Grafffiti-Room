//Server Code
/Server Code
var http = require('http'); //need to http
var fs = require('fs'); //need to read static files
var url = require('url');  //to parse url strings

var counter = 1000; //to count invocations of function(req,res)

//var canvas=document.getElementById("canvas1");
var ROOT_DIR = 'client'; //dir to serve static files from

var MIME_TYPES = {
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/x-icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript', //should really be application/javascript
    'json': 'application/json',
    'png': 'image/png',
    'txt': 'text/plain'
};

var get_mime = function(filename) {
    var ext, type;
    for (ext in MIME_TYPES) {
        type = MIME_TYPES[ext];
        if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
            return type;
        }
    }
    return MIME_TYPES['png'];
};

var my_server = http.createServer(function(request, response) {
  var urlObj = url.parse(request.url, true, false);
  console.log('\n============================');
  console.log("PATHNAME: " + urlObj.pathname);
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
  console.log("METHOD: " + request.method);

  if(request.method == "GET"){
      //handle GET requests as static file requests
      var filePath = ROOT_DIR + urlObj.pathname;
      if(urlObj.pathname === '/') filePath = ROOT_DIR + '/page.html';
          //response.writeHead(200, {'Content-Type': get_mime(filePath)});
          //response.end(data);
      });
  }

}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
