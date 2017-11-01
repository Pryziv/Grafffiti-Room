var fs = require('fs'); //need to read static files
exports.signInHandler= function(dataObj,callback){
  var filePath = "Users.txt"
  var returnObj = 0;
  fs.readFile(filePath, function(err, data){
    if(err){
      returnObj= 0;
      console.log( "File not found");
    }else{
        if(data.includes('['+dataObj.text+']')){
          console.log('User Found');
          returnObj= 1;
          console.log('returnObj post handle: '+returnObj);
          // console.log('returning: ', returnObj);
          // response.end(JSON.stringify(returnObj));
          return returnObj;
        }else{
          fs.appendFile(filePath, '['+dataObj.text+'] ', function(err){
            if(err){
              console.log("Could not append name");
              return returnObj;
              }
              returnObj = 2;
              callback();
            });

        }
      }

      callback();
    });//end of readFile
    // console.log('returnObj post handle: '+returnObj);
    callback();
    return returnObj;

}
