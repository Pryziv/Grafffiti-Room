/*
Here we are prepared to receive a POST message from the client,
and acknowledge that, with a very limited response back to the client
*/

/*
Use browser to view pages at http://localhost:3000/canvasWithTimer.html

When the blue cube is moved with the arrow keys, a POST message will be
sent to the server when the arrow key is released. The POST message will
contain a data string which is the location of the blue cube when the
arrow key was released. The server sends back a JSON string which the client should use
to put down a "waypoint" for where the arrow key was released

Also if the client types in the app text field and presses the "Submit Request" button
a JSON object containing the text field text will be send to this
server in a POST message.

Notice in this code we attach an event listener to the request object
to receive data that might come in in chunks. When the request end event
is posted we look and see if it is a POST message and if so extract the
data and process it.


*/

//Cntl+C to stop server (in Windows CMD console)

//DATA to be used in a future tutorial exercise.
/*Exercise: if the user types the title of a song that the server has,
  the server should send a JSON object back to the client to replace
  the words array in the client app.
*/

//Server Code
var http = require('http'); //need to http
var fs = require('fs'); //need to read static files
var url = require('url');  //to parse url strings

var counter = 1000; //to count invocations of function(req,res)
var chords_final=[];
var lyrics_final=[];
//var canvas=document.getElementById("canvas1");
var ROOT_DIR = 'html'; //dir to serve static files from

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
    return MIME_TYPES['txt'];
};

http.createServer(function (request,response){
    var urlObj = url.parse(request.url, true, false);
    console.log('\n============================');
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var receivedData = '';

    //attached event handlers to collect the message data
    request.on('data', function(chunk) {
        receivedData += chunk;
    });

    //event handler for the end of the message
    request.on('end', function(){
        console.log('received data: ', receivedData);
        console.log('type: ', typeof receivedData);

        //if it is a POST request then echo back the data.
    if(request.method == "POST"){
          var dataObj = null;
          console.log(receivedData);
          dataObj = JSON.parse(receivedData);
          console.log("dataObj"+dataObj);
          console.log('received data object: ', dataObj);
          console.log('type: ', typeof dataObj);
            //Here we can decide how to process the data object and what
            //object to send back to client.
            //FOR NOW EITHER JUST PASS BACK AN OBJECT
            //WITH "text" PROPERTY
           if(dataObj.length>30){
             console.log("writing the file")
              fs.writeFile('test.txt', dataObj, function(err){
                if(err){
                  console,log("could not write");
                }
              });

            }

          else{
            var returnObj = {};
            returnObj.text = "";
            returnObj.wordArray = [];



            //TO DO: return the words array that the client requested
            var filePath = "songs/"+dataObj.text+".txt";
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    returnObj.text = "File not found";
                } else {
                    if (filePath.includes(".txt")) {
                        console.log('found file');
                         //data = data.toString().replace(/\n/g, " ");
                        var array = data.toString().split(" ");
                        console.log("txt before: "+array);
                        //By lines

                        for (i in array) {
                            var lyrics = " ";
                            var chords = " ";
                              if(array[i].includes("\n")){
                                var arrayTemp = array[i].split("\n");
                                returnObj.wordArray.push({word:arrayTemp[0], x:0, y:0});
                                for(var k=1;k<arrayTemp.length;k++){
                                  lyrics = "\n"+ arrayTemp[k];
                                  returnObj.wordArray.push({word:lyrics, x:0, y:0});
                                  }
                                }else{returnObj.wordArray.push({word: array[i], x:0, y:0});                            }

                            }


                    }
                }
                console.log('returning: ', returnObj.wordArray);
                //object to return to client
                response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
                response.end(JSON.stringify(returnObj)); //send just the JSON object
            });

            //if it exists
   }


        }
    });

    if(request.method == "GET"){
        //handle GET requests as static file requests
        var filePath = ROOT_DIR + urlObj.pathname;
        if(urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

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


}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');
