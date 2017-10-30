
//functions file
window.onload = function() {//Wait for page to load then do the following
var canvas = document.getElementById('canvas1');
var context = canvas.getContext('2d');
var imageObj = new Image();

imageObj.onload = function() {//Wait for image to load then make the background
  context.drawImage(imageObj, 0, 0,800,400);
      };
imageObj.src ="images/Wall.jpg";
  if(sessionStorage.active == 1){
    document.getElementById('userTextField').style.display = "none";
    document.getElementById('SubmitButton').style.display = "none";
    document.getElementById('paragraph1').innerHTML =
    'Welcome back '+sessionStorage.user;
  }
};

var handleMouseDown = function(e){
  var canvas = document.getElementById('canvas1');
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.clientX - rect.left;
  var canvasY = e.clientY - rect.top;
  console.log("mouse down:" + canvasX + ", " + canvasY);
  e.stopPropagation();
  e.preventDefault();
  paint();
}
var handleMouseMove = function(e){
  console.log("mouse move");
  var canvasX = e.clientX - rect.left;
  var canvasY = e.clientY - rect.top;
  e.stopPropagation();
  paint();
}
var handleMouseUp = function(e){
  console.log("mouse up");

    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);

	e.stopPropagation();
}

function handleSubmitButton () {
  var userText = $('#userTextField').val(); //get text from user text input field
  if(userText && userText != ''){ //user text was not empty
    var userRequestObj = {text: userText}; //make object to send to server
    var userRequestJSON = JSON.stringify(userRequestObj); //make json string
    $('#userTextField').val(''); //clear the user text field

    $.post("userText", userRequestJSON, function(data, status){
      console.log("data: "+data);
      console.log("typeof: " + typeof data);
			var responseObj = JSON.parse(data);
      //how to respond to the responseObj
      if(responseObj < 1){
        document.getElementById('paragraph1').innerHTML =
        'An error has occured, Please try again';
      }else{
        if(responseObj == 1){
        document.getElementById('paragraph1').innerHTML =
        'Welcome back '+userText;
        }else{document.getElementById('paragraph1').innerHTML =
        'Welcome new User '+userText;}

        document.getElementById('userTextField').style.display = "none";
        document.getElementById('SubmitButton').style.display = "none";
        //store that its a user
        if(typeof(Storage) !== "undefined") {
          sessionStorage.user = userText;
          sessionStorage.active = 1;
        }else{
          console.log("Storage not available");
        }
      }
    });//end of $post
  }
};
