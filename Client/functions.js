var canvas = document.getElementById('canvas1');

var drawCanvas= function(){
  var context = canvas.getContext('2d');
  context.fillStyle= 'black';
  context.fillRect(0,0,canvas.width,canvas.height); //erase canvas
}
