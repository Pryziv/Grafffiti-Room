//Server Code
var http = require('http'); //need to http
var fs = require('fs'); //need to read static files
var url = require('url');  //to parse url strings

var counter = 1000; //to count invocations of function(req,res)
//will be over-written
var serverData=[];
serverData[0] = [{corx: -1, cory: -1,size: 0, colour: "red"}];
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
  var receivedData = '';

  request.on('data', function(chunk) {
      receivedData += chunk;
  });

  if(request.method == "GET"){
      //handle GET requests as static file requests
      var filePath = ROOT_DIR + urlObj.pathname;
      if(urlObj.pathname === '/') filePath = ROOT_DIR + '/page.html';

      fs.readFile(filePath, function(err,data){
          if(err){
              //report error to console
              console.log('ERROR: ' + JSON.stringify(err));
              //respond with not found 404 to client
              response.writeHead(404);
              response.end(JSON.stringify(err));
              return;
          }
          response.writeHead(200, {'Content-Type': get_mime(filePath)});
          response.end(data);
      });
  }
  request.on('end', function(){
      console.log('received data: ', receivedData);
      console.log('type: ', typeof receivedData);

  if(request.method == "POST"){
        var returnObj = 0;
        var dataObj = null;
        dataObj = JSON.parse(receivedData);
        console.log('received data object: ', dataObj);
        console.log('type: ', typeof dataObj);
        //handling the name input does it exist in the filename
      if(dataObj.text != null){
        var filepath = "Admin.txt";
        fs.readFile(filePath, function(err, data){
          if(err){
            returnObj= 0;
            console.log( "File not found");
          }else{
              if(data.includes('['+dataObj.text+']')){
                console.log('Admin Found');
                returnObj= 3;
              }
            }
          });
          if(returnObj == 0){
        var filePath = "Users.txt";
        fs.readFile(filePath, function(err, data){
          if(err){
            returnObj= 0;
            console.log( "File not found");
          }else{
              if(data.includes('['+dataObj.text+']')){
                console.log('User Found');
                returnObj= 1;
              }else{
                fs.appendFile(filePath, '['+dataObj.text+'] ', function(err){
                  if(err){
                    console.log("Could not append name");
                    }
                  });
                  returnObj = 2;
              }
            }
            console.log('returning: ', returnObj);
            response.end(JSON.stringify(returnObj));//send the JSON
          });//end of readFile
        }else if(dataObj.corx != null){//process polling data
          if(dataObj.corx > 0 && dataObj.cory > 0
            && dataObj.size > 0){
              serverData.push(JSON.parse(receivedData));
              while(serverData.length>200){
                serverData.shift();
              }
              console.log('none Blank received');
            }
            returnObj = JSON.stringify(serverData);
            console.log('returned: ', returnObj);
            response.end(returnObj);

        }else{
          console.log('Nothing done');
        }
      }
    });

}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
