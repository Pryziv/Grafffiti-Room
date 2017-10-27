
//functions file
window.onload = function() {//Wait for page to load then do the following
var canvas = document.getElementById('canvas1');
var context = canvas.getContext('2d');
var imageObj = new Image();

imageObj.onload = function() {//Wait for image to load then make the background
  context.drawImage(imageObj, 0, 0,800,400);
      };
imageObj.src ="images/Wall.jpg";
};

