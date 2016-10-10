function imageOpsFlip(flipH, flipV, operatingCanvasContext) {
  var dataUrl,
  operatingCanvas = operatingCanvasContext.canvas;
  dataUrl =  operatingCanvas.toDataURL();
  var image, width =  operatingCanvas.width, height = operatingCanvas.height;
  image = new Image();
  image.src =  operatingCanvas.toDataURL();
  operatingCanvasContext.save();
  var scaleH = flipH ? -1 : 1, // Set horizontal scale to -1 if flip horizontal
      scaleV = flipV ? -1 : 1, // Set vertical scale to -1 if flip vertical
      posX = flipH ? width * -1 : 0, // Set x position to -100% if flip horizontal
      posY = flipV ? height * -1 : 0; // Set y position to -100% if flip vertical
  if (flipH)
      operatingCanvasContext.translate(width, 0);
  if (flipV)
      operatingCanvasContext.translate(0, height);

  operatingCanvasContext.scale(scaleH, scaleV); // Set scale to flip the image
  image.onload = function () {
      operatingCanvasContext.clearRect(0, 0, width, height);
      operatingCanvasContext.drawImage(image, 0, 0);
      operatingCanvasContext.restore();
  };
}

function imageOpsRotate(angle, operatingCanvasContext ) {
  var canvasPic = new Image();
  operatingCanvasContext.save(),
  operatingCanvas = operatingCanvasContext.canvas;
  canvasPic.src = operatingCanvas.toDataURL();

  operatingCanvasContext.clearRect (0,0, operatingCanvas.width, operatingCanvas.height);
  operatingCanvasContext.translate(operatingCanvasContext.canvas.width/2, operatingCanvasContext.canvas.height/2);
  operatingCanvasContext.rotate((Math.PI/180)*angle);
  canvasPic.onload = function () {
    operatingCanvasContext.drawImage(canvasPic, -operatingCanvasContext.canvas.width/2, -operatingCanvasContext.canvas.height/2);
      operatingCanvasContext.rotate(-(Math.PI/180)*angle);
      operatingCanvasContext.translate(-operatingCanvasContext.canvas.width/2, -operatingCanvasContext.canvas.height/2);
    operatingCanvasContext.restore();
  };
}
    // rotate : function (angle, operatingCanvasContext ) {
    //   var canvasPic = new Image();
    //   var rotator = function(copier) {
    //     var canvasPic1 = new Image();
    //     canvasPic1.src = offscreenCanvas.toDataURL();
    //     offscreenCanvasContext.save();
    //     offscreenCanvasContext.clearRect (0,0, offscreenCanvas.width, offscreenCanvas.height);
    //     // offscreenCanvasContext.translate(offscreenCanvasContext.canvas.width/2, offscreenCanvasContext.canvas.height/2);
    //     offscreenCanvasContext.rotate((Math.PI/180)*angle);
    //
    //     canvasPic1.onload = function () {
    //       offscreenCanvasContext.drawImage(canvasPic1, 0,0);
    //       offscreenCanvasContext.rotate(-(Math.PI/180)*angle);
    //       // offscreenCanvasContext.translate(-offscreenCanvasContext.canvas.width/2, -offscreenCanvasContext.canvas.height/2);
    //       offscreenCanvasContext.restore();
    //       if ((typeof copier !== 'undefined') && (typeof copier === 'function'))
    //         copier();
    //     }
    //   },
    //   copyToMaster = function() {
    //     var translatedPic = new Image();
    //     translatedPic.src  = offscreenCanvas.toDataURL();
    //     // operatingCanvasContext.save();
    //     operatingCanvasContext.clearRect (0,0, operatingCanvas.width, operatingCanvas.height);
    //     translatedPic.onload = function () {
    //         operatingCanvasContext.drawImage(translatedPic, (operatingCanvas.width - offscreenCanvas.width)/2 , (operatingCanvas.height - offscreenCanvas.height)/2);
    //         // operatingCanvasContext.restore();
    //     };
    //   };
    //   operatingCanvas = operatingCanvasContext.canvas;
    //   canvasPic.src = operatingCanvas.toDataURL();
    //   if (typeof offscreenCanvas ==='undefined' || offscreenCanvas ==  null) {
    //     window.offscreenCanvas = document.createElement('canvas');
    //     offscreenCanvas.id= "offscreenImg";
    //     $('body').append(offscreenCanvas);
    //     offscreenCanvas.width = Math.max(operatingCanvas.width, operatingCanvas.height);
    //     offscreenCanvas.height = offscreenCanvas.width;
    //     offscreenCanvas.style= "border:2px solid blue";
    //     window.offscreenCanvasContext = offscreenCanvas.getContext('2d');
    //     // offscreenCanvasContext.save();
    //     offscreenCanvasContext.clearRect (0,0, offscreenCanvas.width, offscreenCanvas.width);
    //     offscreenCanvasContext.translate(offscreenCanvasContext.canvas.width/2, offscreenCanvasContext.canvas.height/2);
    //     canvasPic.onload = function () {
    //         offscreenCanvasContext.drawImage(canvasPic, -operatingCanvasContext.canvas.width/2, -operatingCanvasContext.canvas.height/2);
    //         offscreenCanvasContext.translate(-offscreenCanvasContext.canvas.width/2, -offscreenCanvasContext.canvas.height/2);
    //         // offscreenCanvasContext.restore();
    //     }
    //
    //     rotator(function() {
    //       copyToMaster();
    //     });
    //     // var canvasPic1 = new Image();
    //     // canvasPic1.src = offscreenCanvas.toDataURL();
    //     // offscreenCanvasContext.clearRect (0,0, offscreenCanvas.width, offscreenCanvas.height);
    //     // offscreenCanvasContext.rotate((Math.PI/180)*angle);
    //     // canvasPic1.onload = function () {
    //     //   offscreenCanvasContext.drawImage(canvasPic1, 0, 0);
    //     //   offscreenCanvasContext.rotate(-(Math.PI/180)*angle);
    //     //   offscreenCanvasContext.restore();
    //     //
    //     //   var translatedPic = new Image();
    //     //   translatedPic.src  = offscreenCanvas.toDataURL();
    //     //   operatingCanvasContext.save();
    //       //   operatingCanvasContext.clearRect (0,0, operatingCanvas.width, operatingCanvas.height);
    //     //   translatedPic.onload = function () {
    //     //       operatingCanvasContext.drawImage(translatedPic, (operatingCanvas.width - offscreenCanvas.width)/2 , (operatingCanvas.height - offscreenCanvas.height)/2);
    //     //       operatingCanvasContext.restore();
    //     //   };
    //     // };
    //   } else {
    //     console.log("Working on the dirty offscreen canvas");
    //     offscreenCanvasContext.translate(-offscreenCanvas.width/2,-offscreenCanvas.height/2);
    //     //offscreenCanvasContext.save();
    //     offscreenCanvasContext.clearRect((offscreenCanvas.width - operatingCanvas.width)/2 , (offscreenCanvas.height - operatingCanvas.height)/2, operatingCanvas.width, operatingCanvas.height);
    //     // offscreenCanvasContext.translate(offscreenCanvasContext.canvas.width/2, offscreenCanvasContext.canvas.height/2);
    //     canvasPic.onload = function () {
    //         offscreenCanvasContext.drawImage(canvasPic, (offscreenCanvas.width - operatingCanvas.width)/2 , (offscreenCanvas.height - operatingCanvas.height)/2);
    //         // offscreenCanvasContext.translate(-offscreenCanvasContext.canvas.width/2, -offscreenCanvasContext.canvas.height/2);
    //         // offscreenCanvasContext.restore();
    //         // rotator(function() {
    //         //   // copyToMaster();
    //         // });
    //     };
    //     // var canvasPic2 = new Image();
    //     // canvasPic2.src = offscreenCanvas.toDataURL();
    //     // offscreenCanvasContext.clearRect (0,0, offscreenCanvas.width, offscreenCanvas.height);
    //     // offscreenCanvasContext.rotate((Math.PI/180)*angle);
    //     //
    //     // canvasPic2.onload = function () {
    //     //   offscreenCanvasContext.drawImage(canvasPic2, 0, 0);
    //     //   offscreenCanvasContext.rotate(-(Math.PI/180)*angle);
    //     //   offscreenCanvasContext.restore();
    //     // };
    //     //   var translatedPic = new Image();
    //     //   translatedPic.src  = offscreenCanvas.toDataURL();
    //     //   operatingCanvasContext.save();
    //     //   operatingCanvasContext.clearRect (0,0, operatingCanvas.width, operatingCanvas.height);
    //     //   translatedPic.onload = function () {
    //     //       operatingCanvasContext.drawImage(translatedPic, (operatingCanvas.width - offscreenCanvas.width)/2 , (operatingCanvas.height - offscreenCanvas.height)/2);
    //     //       operatingCanvasContext.restore();
    //     //   };
    //     // };
    //   }
    //
    //
    // },
function imageOpsScalePicture (scalePercent, operatingCanvasContext, scrollToOffset) {
  var w = operatingCanvasContext.canvas.width,
      h = operatingCanvasContext.canvas.height,
      sw = w * scalePercent,
      sh = h * scalePercent,
      operatingCanvas = operatingCanvasContext.canvas;
  var canvasPic = new Image();
  operatingCanvasContext.save();
  canvasPic.src = operatingCanvas.toDataURL();
  operatingCanvasContext.clearRect (0,0, operatingCanvas.width, operatingCanvas.height);
  operatingCanvasContext.translate(operatingCanvas.width/2, operatingCanvas.height/2);
  canvasPic.onload = function () {
    operatingCanvasContext.drawImage(canvasPic, -sw/2 , -sh/2 , sw, sh);
    operatingCanvasContext.translate(-operatingCanvas.width/2, -operatingCanvas.height/2);
    operatingCanvasContext.restore();
    //console.log(scrollToOffset);
    // if (scrollToOffset !== 0)
    // window.scrollTo(0,(operatingCanvas.height-600)/2);
  };
}
    
function imageOpsInvert(operatingCanvasContext) {
  var imagedata = operatingCanvasContext.getImageData(0, 0, operatingCanvasContext.canvas.width, operatingCanvasContext.canvas.height),
  data = imagedata.data;
  for(var i = 0; i <= data.length - 4; i += 4) {
    data[i]   = 255 - data[i]
    data[i+1] = 255 - data[i+1];
    data[i+2] = 255 - data[i+2];
  }
  operatingCanvasContext.putImageData(imagedata, 0, 0);
}