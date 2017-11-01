
//functions file

var pollingTimer=0;
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
  }else{
    document.getElementById('brushOptions').style.display = 'none';
  }
};
//globals
var canvas = document.getElementById('canvas1');
var context = canvas.getContext("2d");
var brushColour = "red"; //red
var brushSize = 0;

function paint(canvasX,canvasY){
  //x0,y0,r0,x1,y1,r1
  context.beginPath();
  context.arc(canvasX,canvasY,brushSize,0,2*Math.PI);
  context.fillStyle = brushColour;
  context.fill();
}

function repaint(corx, cory, size, colour){
  //x0,y0,r0,x1,y1,r1
  console.log(corx);
  console.log("repainting at: "+corx+ cory)
  context.beginPath();
  context.arc(corx,cory,size,0,2*Math.PI);
  context.fillStyle = colour;
  context.fill();
}

function handleBrushColour(colourNum){
  if(colourNum == 0){
    brushColour = "red";
  }else if(colourNum == 1){
    brushColour = "orange";
  }else if(colourNum == 2){
    brushColour = "yellow";
  }else if(colourNum == 3){
    brushColour = "green";
  }else if(colourNum == 4){
    brushColour = "blue";
  }else if(colourNum == 5){
    brushColour = "purple";
  }else if(colourNum == 6){
    brushColour = "brown";
  }else if(colourNum == 7){
    brushColour = "black";
  }else if(colourNum == 8){
    brushColour = "white";
  }
}
function handleBrushSize(size){
  brushSize = size;
}

function pollingTimerHandler() {
  //console.log("poll server");
  var dataObj = {corx: -1, cory: -1,size: 0, colour: brushColour}; //used by server to react as poll
  //create a JSON string representation of the data object
  var brushJson = JSON.stringify(dataObj);

  //Poll the server for the location of the moving box
  $.post("BrushData", brushJson, function(data, status) {
    console.log("Poll popped");
    var brushData = JSON.parse(data)
    console.log(brushData);
    for(var i=0;i<brushData.length;i++){
      repaint(brushData[i].corx, brushData[i].cory,
      brushData[i].size, brushData[i].colour);}
  });
}

var handleMouseDown = function(e){
  var canvas = document.getElementById('canvas1');
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.clientX - rect.left;
  var canvasY = e.clientY - rect.top;
  console.log("mouse down:" + canvasX + ", " + canvasY);
  document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("mouseup", handleMouseUp, true);
  e.stopPropagation();
  e.preventDefault();
  var dataObj = {corx: canvasX, cory: canvasY,size: brushSize, colour: brushColour};
  var brushJson = JSON.stringify(dataObj);
  $.post("BrushData",brushJson, function(data,status){
    console.log("Data for repainting: "+data);
  })
  paint(canvasX, canvasY);
}

var handleMouseMove = function(e){
  console.log("mouse move");
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.clientX - rect.left;
  var canvasY = e.clientY - rect.top;
  e.stopPropagation();
  var dataObj = {corx: canvasX, cory: canvasY,size: brushSize, colour: brushColour};
  var brushJson = JSON.stringify(dataObj);
  $.post("BrushData",brushJson, function(data,status){
    console.log("Data for repainting: "+data);
  });
  paint(canvasX, canvasY);
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
        document.getElementById('brushOptions').style.display ='';
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

$(document).ready(function() {
  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown);
  pollingTimer = setInterval(pollingTimerHandler, 100); //quarter of a second
  //timer.clearInterval(); //to stop
});
