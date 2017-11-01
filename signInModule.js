exports.signInHandler= function(dataObj,returnObj){
  var filePath = "Users.txt"
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
}
