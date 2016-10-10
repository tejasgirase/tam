// /* app.js */
// requirejs.config({
//     "baseUrl": "scripts",
// 	shim: {
// 		'jquery-ui': {
// 	    deps: ['jquery'],
//         exports: 'jquery-ui'
//       }
//     },
//     "paths": {
//       "app": ".",
//       "image-ops": "./image-ops",
//       "jquery-ui": "./thirdparty/jquery-ui",
//       "jquery": "./thirdparty/jquery"
//     }
// });

// requirejs([ "jquery","jquery-ui", "image-ops"], function ($, jqui, imageOps) {
//   "use strict";
  var drawingCanvas,
      drawingContext,
      // backgroundContext = document.createElement('canvas').getContext('2d'),
      // strokeStyleSelect = document.getElementById('strokeStyleSelect'),
      drawingSurfaceImageData,
      rubberbandW,
      rubberbandH,
      rubberbandUlhc = {},
      dragging = false,
      mousedown = {},
      lastRect = {},
      lastX,
      lastY,
      controlPoint = {},
      editingCurve = false,
      draggingControlPoint = false,
      curveStart = {},
      curveEnd = {},
      doFill = false,
      selectedRect = null,
      selectedFunction,
      editingText = false,
      currentText,
      RUBBERBAND_LINE_WIDTH = 1,
      RUBBERBAND_STROKE_STYLE = 'green',
      ERASER_LINE_WIDTH = 1,
      ERASER_SHADOW_STYLE = 'blue',
      ERASER_STROKE_STYLE = 'rgba(0,0,255,0.6)',
      ERASER_SHADOW_OFFSET = -5,
      ERASER_SHADOW_BLUR = 20,
      ERASER_RADIUS = 40,
      SHADOW_COLOR = 'rgba(0,0,0,0.7)',
      loc,
      markDentalImage = false,
      img = new Image(),
      KEYCODE_ESC = 27,
      KEYCODE_BACKSPACE = 8,
      KEYCODE_ENTER = 13,
      shape,
      images =[];
    //State variables for dental annotations
    var isDentalImageEdit = false, //Check if dental image is being annotated
      mouseDownForDentalImage = false; //Check if marker is ready to be applied, true if ready to be applied and false before or after application
                                       //This flag is false if the user started drawing the marker but moved out of drawing Canvas or when the mouse
                                       //button is up in the drawing canvas.
  function canvasEditorApp(){
    var dialog, name = $('#markerLabel');
    $("#save_charting_template_tab").on("click","#reset_drawing_canvas",function(){
      $(this).closest(".ctemplate-display-response-value").find(".canvas_images").trigger("change");
    });
 
    $("#undo").click(function (e) {
      e.preventDefault();
      perform({"command": "undo"});
    });

    $("#crop").button({
      text: true,
      icons: {
        primary: "ui-icon-scissors"
      }
    }).click(function (e) {
      e.preventDefault();
      $("#line, #rect, #circle, #text").removeClass("label-default");
      $("#line, #rect, #circle, #text").addClass("label-warning");
      toggleLabelClass($(this));
      perform({"command": "crop"});
    });

    $("#flipVertical").button({
      text: true
    }).click(function (e) {
      e.preventDefault();
      toggleLabelClass($(this));
      perform({"command": "flipVertical"});
    });

    $("#flipHorizontal").button({
      text: true
    }).click(function (e) {
      e.preventDefault();
      toggleLabelClass($(this));
      perform({"command": "flipHorizontal"});
    });

    // $("#rotate90CW").button({
    //   text: true
    // }).click(function (e) {
    //   e.preventDefault();
    //   // toggleLabelClass($(this));
    //   perform({"command": "rotate90CW"});
    // });
    
    // $("#rotate90CCW").button({
    //   text: true
    // }).click(function (e) {
    //   e.preventDefault();
    //   // toggleLabelClass($(this));
    //   perform({"command": "rotate90CCW"});
    // });

    $("#invert").button({
      text: true
    }).click(function (e) {
      e.preventDefault();
      toggleLabelClass($(this));
      perform({"command": "invert"});
    });

    // $("#zoomIn").click(function (e) {
    //   e.preventDefault();
    //   //toggleLabelClass($(this));
    //   perform({"command": "zoomIn"});
    // });

    // $("#zoomOut").button().click(function (e) {
    //   e.preventDefault();
    //   //toggleLabelClass($(this));
    //   perform({"command": "zoomOut"});
    // });

    $("#text").click(function (e) {
      e.preventDefault();
      $("#text").focus();
      editingText = true;
      $("#line, #rect, #circle, #crop").removeClass("label-default");
      $("#line, #rect, #circle, #crop").addClass("label-warning");
      if($(this).hasClass("label-warning")) toggleLabelClass($(this));
      perform({"command": "text"});
    });

    $("#line").button().click(function (e) {
      e.preventDefault();
      $("#text, #rect, #circle, #crop").removeClass("label-default");
      $("#text, #rect, #circle, #crop").addClass("label-warning");
      toggleLabelClass($(this));
      perform({"command": "line"});
      updateDentalSelector();
      selectedFunction = 'line';
    });

    $("#rect").button().click(function (e) {
      e.preventDefault();
      $("#line, #text, #circle, #crop").removeClass("label-default");
      $("#line, #text, #circle, #crop").addClass("label-warning");
      toggleLabelClass($(this));
      perform({"command": "rect"});
    });

    $("#circle").button().click(function (e) {
      e.preventDefault();
      $("#line, #rect, #text, #crop").removeClass("label-default");
      $("#line, #rect, #text, #crop").addClass("label-warning");
      toggleLabelClass($(this));
      perform({"command": "circle"});
    });

    $("body").on("click",".marker-click",function(e){
      e.preventDefault();
      //toggleLabelClass($(this));
      // console.log('button.marker-action clicked');
      // if (target.getAttribute('data-type') === 'dentalMarker') {
        var target = e.target;
        markDentalImage = true;
        selectedFunction = undefined;
        if (selectedFunction === 'dentalAnnotations' && !mouseDownForDentalImage) {
          restoreDrawingSurface();
        }
        shape = target.getAttribute("data-mouser");
      // }
    });

    // $('#image_controls').click(function(e){
    //   var target = e.target;
    //   e.preventDefault();
    //   //toggleLabelClass($(this));
    //   //console.log(target);
    //   console.log('button.marker-action clicked');
    //   if (target.getAttribute('data-type') === 'dentalMarker') {
    //     markDentalImage = true;
    //     selectedFunction = undefined;
    //     if (selectedFunction === 'dentalAnnotations' && !mouseDownForDentalImage) {
    //       restoreDrawingSurface();
    //     }
    //     shape = target.getAttribute("data-mouser");
    //   }
    // });

    $("#save_charting_template_tab").on("change","#canvas_color",function(){
      drawingContext.strokeStyle = $(this).val();
    })

    // $("#dental").button().click(function (e) {
    //   e.preventDefault();
    //   $('#dentalPanel').show().css('display', 'inline-block');
    //   $('#dentalPanel #images').off().on('change',function(evt) {
    //     var target = evt.target;
    //     evt.preventDefault();
    //     var url = $(this).val();
    //     drawDentalImage(drawingContext, drawingCanvas.width, drawingCanvas.height, url, $(this).find(':selected').attr("data-width"), $(this).find(':selected').attr("data-height") );
    //   });

    //   dialog = $( "#dialog-form" ).dialog({
    //     autoOpen: false,
    //     height: 370,
    //     width: 350,
    //     modal: true,
    //     buttons: {
    //       "Add marker": addMarker,
    //       Cancel: function() {
    //         dialog.dialog( "close" );
    //       }
    //     },
    //     close: function() {
    //     }
    //   });
    //   $('#dentalPanel #addNewMarker').on('click', function(evt) {
    //     evt.preventDefault();
    //     dialog.dialog( "open" );
    //   });
    //   $.ajax({
    //     type: 'GET',
    //     url: './data/legend.json',
    //     dataType: 'json',
    //     async: false,
    //     success: function(data) {
    //       isDentalImageEdit = true;
    //       var selectElem = $('#images'), legendElem = $('#legend'), mouserSelectElem = $('#mouser_select'), imageSelectElem = $('#image_select');
    //       $(data.images).each(function() {
    //         selectElem.append('<option value="' + this["url"] + '" data-width="'+ this["width"] +'" data-type="dental-image" data-height="'+ this["height"]+'">' + this["imageName"] + "</option>");
    //       });

    //       $(data.legend).each(function() {
    //         mouserSelectElem.append('<option value="' + this['mouser'] + '">' + this['mouser'] + '</option>');
    //         imageSelectElem.append('<option value="' + this['image'] + '">' + this['image'] + '</option>');
    //         legendElem.append('<div class="marker"><button class="form-control text-left marker-action"  data-type="dentalMarker" data-mouser="'+ this['mouser'] +'" data-marker="'+ this['image'] +'"><img src="' + this['image'] + '" class="marker-image"/>'+ this["label"] + "</button></div>");
    //       });

    //       if (Array.isArray(data.images) && data.images.length > 0) {
    //         var firstImage = data.images[0];
    //         drawDentalImage(drawingContext, drawingCanvas.width, drawingCanvas.height, firstImage.url, firstImage.width, firstImage.height);
    //       }
    //     },
    //     error: function(d) {
    //       console.log("Got error");
    //     }
    //   });
    //     selectedFunction = 'dentalAnnotations';
    // });
    //Start handling document keyboard events
    // var myelements = document.getElementsByClassName("canvas-parent");
    // console.log(myelements);
    // myelements.addEventListener("keydown",canvasKeyDown,true);
    document.onkeydown = function (e) {
      if (e.keyCode === KEYCODE_ESC) {
        e.preventDefault();
        markDentalImage = false;
        restoreDrawingSurface();
        return;
      }
      // if($("#text").data("status") == "active") {
        var target = e.target;
        if (target.getAttribute('data-type') !== 'dentalMarker' && target.id !== 'text' )
          return;
        if (e.ctrlKey || e.metaKey || e.altKey)
          return;
        if (e.keyCode === KEYCODE_ESC) {
          e.preventDefault();
          markDentalImage = false;
          restoreDrawingSurface();
          return;
        } else if (e.keyCode === KEYCODE_BACKSPACE) {  // backspace
          e.preventDefault();
          backspace();
        }else if (e.keyCode === KEYCODE_ENTER) { // enter
          e.preventDefault();
          enter();
        }
      // }
    };
    // myelements.addEventListener("keypress",canvasKeyPress,true);
    document.onkeypress = function (e) {
      // if($("#text").data("status") == "active") {
        var key = String.fromCharCode(e.which);
        if (e.ctrlKey || e.metaKey || e.altKey)
          return;
        if (editingText && e.keyCode !== KEYCODE_BACKSPACE) {
          e.preventDefault();
          insert(key);
        }
      //}
    };
    //End handling document keyboard events
    // Start Drawing canvas event handlers.................................
      drawingCanvas.onmousedown = function (e) {
        var x = e.x || e.clientX,
           y = e.y || e.clientY;
           loc = windowToCanvas(drawingCanvas, x, y);

        e.preventDefault();
        mouseDownInDrawingCanvas(loc);
      };

      drawingCanvas.onmousemove = function (e) {
        var x = e.x || e.clientX,
            y = e.y || e.clientY,
            loc = windowToCanvas(drawingCanvas, x, y);
        e.preventDefault();
        mouseMoveInDrawingCanvas(loc, { "x": x, "y":y });
      };

      drawingCanvas.onmouseup = function (e) {
        var isDown = false;
        drawingContext.closePath();
        logDrawing();
        var x = e.x || e.clientX,
        y = e.y || e.clientY,
        loc = windowToCanvas(drawingCanvas, x, y);
        e.preventDefault();
        mouseUpInDrawingCanvas(loc);
      };

      // Initialization................................................
      drawingContext.font = '48px Palatino';
      drawingContext.textBaseline = 'bottom';
      drawingContext.strokeStyle = "red";
      drawingContext.fillStyle = "green";//fillStyleSelect.value;
      drawingContext.lineWidth = "2.0";//lineWidthSelect.value;
      drawingContext.fillStyle = 'black';
  }

  function canvasKeyPress(e) {
    
  }

  function canvasKeyDown(e) {
   
  }
////////////////////EditorAppFunction Ends Here////////////////////////
  var logDrawing = function () {
    var imagedata = drawingContext.getImageData(0, 0,
                             drawingCanvas.width,
                             drawingCanvas.height);
    images.push(imagedata);
    console.log('Total entries in log:%d after push', images.length);
    saveDrawingSurface();
    // images.push(drawingCanvas.toDataURL());
  };

  var commandMap = {
    crop : function() {
      logDrawing();
      selectedFunction = 'crop';
    },
    undo : function() {
      popDrawing();
    },
    flipVertical: function() {
      logDrawing();
      imageOpsFlip(false, true, drawingContext);
    },
    flipHorizontal :function(){
      //updateDentalSelector();
      logDrawing();
      imageOpsFlip(true, false, drawingContext);
    },
    rotate90CW:function(){
      logDrawing();
      imageOpsRotate(90, drawingContext);
    },
    rotate90CCW:function(){
      logDrawing();
      imageOpsRotate(-90, drawingContext);
    },
    invert:function() {
      logDrawing();
      imageOpsInvert(drawingContext);
    },
    zoomIn: function() {
      logDrawing();
      imageOpsScalePicture(1.10, drawingContext);
    },
    zoomOut: function() {
      logDrawing();
      imageOpsScalePicture(0.90, drawingContext);
    },
    line: function() {
      logDrawing();
      selectedFunction = 'line';
    },
    text: function() {
      logDrawing();
      selectedFunction = 'text';
    },
    rect: function() {
      logDrawing();
      selectedFunction = 'rectangle';
    },
    circle: function() {
      logDrawing();
      selectedFunction = 'circle';
    }
  };

  var perform = function (action) {
    markDentalImage = false;
    commandMap[action.command]();
  };
  var updateDentalSelector = function() {
    markDentalImage = false;
    restoreDrawingSurface();
  };
  var popDrawing = function () {
    console.log('Total entries in log:%d after pop', images.length);
    if (images.length === 0)
      return;
    var image = images.pop();
    drawingContext.clearRect(0,0,drawingContext.canvas.width, drawingContext.canvas.height);
    drawingContext.putImageData(image, 0, 0);
    saveDrawingSurface();
  };

  // Saving/Restoring the drawing surface..........................
  function saveDrawingSurface() {
    drawingSurfaceImageData = drawingContext.getImageData(0, 0,drawingCanvas.width,drawingCanvas.height);
  }

  function restoreDrawingSurface() {
    drawingContext.putImageData(drawingSurfaceImageData, 0, 0);
  }
  // Rubberbands...................................................
  function updateRubberbandRectangle(loc) {
    rubberbandW = Math.abs(loc.x - mousedown.x);
    rubberbandH = Math.abs(loc.y - mousedown.y);
    if (loc.x > mousedown.x)
      rubberbandUlhc.x = mousedown.x;
    else
      rubberbandUlhc.x = loc.x;
    if (loc.y > mousedown.y)
      rubberbandUlhc.y = mousedown.y;
    else
      rubberbandUlhc.y = loc.y;
  }

  function drawRubberbandRectangle() {
    drawingContext.strokeRect(rubberbandUlhc.x,rubberbandUlhc.y,rubberbandW, rubberbandH);
    drawingContext.stroke();
  }

  function drawRubberbandLine(loc) {
    drawALine(mousedown, loc);
  }

  function drawALine(startPos, endPos) {
    drawingContext.beginPath();
    drawingContext.moveTo(startPos.x, startPos.y);
    drawingContext.lineTo(endPos.x, endPos.y);
    drawingContext.stroke();
  }

  function drawRubberbandCircle(loc) {
    var angle = Math.atan(rubberbandH/rubberbandW);
    var radius = rubberbandH / Math.sin(angle);
    if (mousedown.y === loc.y) {
        radius = Math.abs(loc.x - mousedown.x);
    }
    drawingContext.beginPath();
    drawingContext.arc(mousedown.x, mousedown.y, radius, 0, Math.PI*2, false);
    drawingContext.stroke();
  }

  function drawRubberband(loc) {
    drawingContext.save();
    drawingContext.strokeStyle = RUBBERBAND_STROKE_STYLE;
    drawingContext.lineWidth   = RUBBERBAND_LINE_WIDTH;
    if (selectedFunction === 'rectangle') {
        drawRubberbandRectangle();
    } else if (selectedFunction === 'line' ) {
        drawRubberbandLine(loc);
    } else if (selectedFunction === 'circle') {
        drawRubberbandCircle(loc);
    } else if (selectedFunction === 'crop') {
      drawRubberbandCroppedRegion(loc);
    }
    drawingContext.restore();
  }

  // Finish drawing lines, circles, and rectangles.................

  function finishDrawingLine(loc) {
    drawingContext.beginPath();
    drawingContext.moveTo(mousedown.x, mousedown.y);
    drawingContext.lineTo(loc.x, loc.y);
    drawingContext.stroke();
    logDrawing();
  }

  function finishDrawingCircle(loc) {
    var angle = Math.atan(rubberbandH/rubberbandW),
       radius = rubberbandH / Math.sin(angle);

    if (mousedown.y === loc.y) {
        radius = Math.abs(loc.x - mousedown.x);
    }
    drawingContext.beginPath();
    drawingContext.arc(mousedown.x, mousedown.y,
                      radius, 0, Math.PI*2, false);
    if (doFill) {
        drawingContext.fill();
    }
    drawingContext.stroke();
    logDrawing();
  }

  function drawRubberbandCroppedRegion(loc) {
    drawingContext.strokeRect( rubberbandUlhc.x + drawingContext.lineWidth,
                 rubberbandUlhc.y + drawingContext.lineWidth,
                 rubberbandW - 2*drawingContext.lineWidth,
                 rubberbandH - 2*drawingContext.lineWidth);
    drawingContext.stroke();
  }

  function drawDentalImage(canvasContext, canvasWidth, canvasHeight, url, imageWidth, imageHeight) {
    var canvasPic = new Image();
    canvasContext.clearRect(0,0,canvasWidth,canvasHeight);
    canvasPic.onload = function () {
      canvasContext.drawImage(canvasPic, (canvasWidth - imageWidth)/2, (canvasHeight - imageHeight)/2);
      saveDrawingSurface();
    }
    canvasPic.src = url;
  }

  function addMarker(e) {
    e.preventDefault();
    var valid = true, value = name.val();
    valid = value.length >= 3 && value.length <= 16;
    if ( valid ) {
      $('#legend').append('<div class="marker"><button class="form-control text-left marker-action"  data-type="dentalMarker" data-mouser="'+ $('#mouser_select').val() +'" data-marker="'+ $('#image_select').val() +'"><img src="' + $('#image_select').val() + '" class="marker-image"/>'+ name.val() + '</button></div>');
      dialog.dialog( "close" );
    }
    return valid;
  }

  function finishDrawingRectangle() {
    if (rubberbandW > 0 && rubberbandH > 0) {
      if (doFill) {
        drawingContext.fillRect(rubberbandUlhc.x,rubberbandUlhc.y,rubberbandW, rubberbandH);
      }
      drawingContext.strokeRect(rubberbandUlhc.x,rubberbandUlhc.y,rubberbandW, rubberbandH);
      logDrawing();
    }
  }
  
  function finishCroppingRegion() {
    if (tempCanvas !== undefined)
      tempCanvas = null;
    //delete(tempCanvas);
    // Create offscreen canvas.
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = drawingCanvas.width;
    tempCanvas.height = drawingCanvas.height;
    var tempContext = tempCanvas.getContext('2d');
    //Copy to offscreen canvas
    tempContext.drawImage(drawingCanvas, 0,0, drawingCanvas.width, drawingCanvas.height);
    drawingContext.clearRect(0,0,drawingContext.canvas.width, drawingContext.canvas.height);
    drawingContext.drawImage(tempCanvas,rubberbandUlhc.x + drawingContext.lineWidth * 2,rubberbandUlhc.y + drawingContext.lineWidth * 2,rubberbandW - 4 * drawingContext.lineWidth,rubberbandH - 4 * drawingContext.lineWidth,0, 0, drawingCanvas.width, drawingCanvas.height);
    dragging = false;
  }

  // Event handling functions......................................
  function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left * (canvas.width  / bbox.width),
      y: y - bbox.top  * (canvas.height / bbox.height)
    };
  }
  // Key event handlers..Start Text processing functions
  function backspace() {
    restoreDrawingSurface();
    currentText = currentText.slice(0, -1);
    eraseTextCursor();
  }

  function enter() {
    finishDrawingText();
    mousedown.y += drawingContext.measureText('W').width;
    saveDrawingSurface();
    startDrawingText();
  }

  function insert(key) {
    currentText += key;
    restoreDrawingSurface();
    drawCurrentText();
    drawTextCursor();
  }

  function eraseTextCursor() {
    restoreDrawingSurface();
    drawCurrentText();
  }

  function drawCurrentText() {
    if (doFill)
      drawingContext.fillText(currentText, mousedown.x, mousedown.y);
      drawingContext.strokeText(currentText, mousedown.x, mousedown.y);
  }

  function drawTextCursor() {
    var widthMetric = drawingContext.measureText(currentText),
      heightMetric = drawingContext.measureText('W'),
      cursorLoc = {
        x: mousedown.x + widthMetric.width,
        y: mousedown.y - heightMetric.width + 5
      };
    drawingContext.beginPath();
    drawingContext.moveTo(cursorLoc.x, cursorLoc.y);
    drawingContext.lineTo(cursorLoc.x, cursorLoc.y + heightMetric.width - 12);
    drawingContext.stroke();
  }

  function startDrawingText() {
    editingText = true;
    currentText = '';
    drawTextCursor();
  }

  function finishDrawingText() {
    restoreDrawingSurface();
    drawCurrentText();
    logDrawing();
  }

  function mouseDownInDrawingCanvas(loc) {
    dragging = true;
    if (isDentalImageEdit)
      mouseDownForDentalImage = true;
    if (editingText) {
      finishDrawingText();
    }
    else if (editingCurve) {
      if (drawingContext. InPath(loc.x, loc.y)) {
        draggingControlPoint = true;
      } else {
        restoreDrawingSurface();
      }
      editingCurve = false;
    }

    if (!draggingControlPoint) {
      saveDrawingSurface();
      mousedown.x = loc.x;
      mousedown.y = loc.y;
      if (selectedFunction === 'path' || selectedFunction === 'pathClosed') {
        drawingContext.beginPath();
        drawingContext.moveTo(loc.x, loc.y);
      } else if (selectedFunction === 'text') {
         startDrawingText();
      } else {
         editingText = false;
      }
      lastX = loc.x;
      lastY = loc.y;
    }
  }

  function drawShape(shape, loc) {
    if (shape === 'purpleTriangle' ) {
      drawingContext.save();
      drawingContext.beginPath();
      var xOffset = 8, yOffset = 8;
      drawingContext.fillStyle = "#A66FBC";
      drawingContext.strokeStyle = "#A66FBC";
      drawingContext.moveTo(loc.x - xOffset, loc.y + yOffset);
      drawingContext.lineTo(loc.x + xOffset, loc.y + yOffset);
      drawingContext.lineTo(loc.x, loc.y - yOffset);
      drawingContext.lineTo(loc.x - xOffset, loc.y + yOffset);
      drawingContext.closePath();
      drawingContext.fill();
      drawingContext.stroke();
      drawingContext.restore();
    } else if (shape === 'perioCircle' ) {
      drawingContext.save();
      drawingContext.beginPath();
      var radius = 8;
      drawingContext.arc(loc.x, loc.y, radius, 0, Math.PI*2, false);
      drawingContext.fillStyle = "#2980B9";
      drawingContext.strokeStyle = "#2980B9";
      drawingContext.closePath();
      drawingContext.fill();
      drawingContext.stroke();
      drawingContext.restore();
    } else if (shape === 'grayCircle' ) {
      drawingContext.save();
      drawingContext.beginPath();
      var radius = 8;
      drawingContext.arc(loc.x, loc.y, radius, 0, Math.PI*2, false);
      drawingContext.fillStyle = "#677C91";
      drawingContext.strokeStyle = "#677C91";
      drawingContext.closePath();
      drawingContext.fill();
      drawingContext.stroke();
      drawingContext.restore();
    } else if (shape === 'hashChar') {
      drawingContext.save();
      drawingContext.font = '24px Palatino';
      drawingContext.textBaseline = 'middle';
      drawingContext.fillStyle = "#0088bb";
      drawingContext.strokeStyle = "#0088bb";
      drawingContext.fillText("#", loc.x, loc.y);
      drawingContext.strokeText("#", loc.x, loc.y);
      drawingContext.restore();
    } else if (shape === 'xChar') {
      drawingContext.save();
      drawingContext.font = '24px Palatino';
      drawingContext.textBaseline = 'middle';
      drawingContext.fillStyle = "#FF0000";
      drawingContext.strokeStyle = "#FF0000";
      drawingContext.fillText("X", loc.x, loc.y);
      drawingContext.strokeText("X", loc.x, loc.y);
      drawingContext.restore();
    } else if (shape === 'pinkTriangle' ) {
      drawingContext.save();
      drawingContext.beginPath();
      var xOffset = 8, yOffset = 8;
      drawingContext.fillStyle = "#FFCEFF";
      drawingContext.strokeStyle = "#FFCEFF";
      drawingContext.moveTo(loc.x - xOffset, loc.y + yOffset);
      drawingContext.lineTo(loc.x + xOffset, loc.y + yOffset);
      drawingContext.lineTo(loc.x, loc.y - yOffset);
      drawingContext.lineTo(loc.x - xOffset, loc.y + yOffset);
      drawingContext.closePath();
      drawingContext.fill();
      drawingContext.stroke();
      drawingContext.restore();
    }
  }

  function mouseMoveInDrawingCanvas(loc, actualCoords) {
    if (markDentalImage) {
      restoreDrawingSurface();
      drawShape(shape, loc);
    }
    if (draggingControlPoint) {
      restoreDrawingSurface();
      moveControlPoint(loc);
      drawingContext.save();
      drawingContext.strokeStyle = RUBBERBAND_STROKE_STYLE;
      drawingContext.lineWidth = RUBBERBAND_LINE_WIDTH;
      drawCurve();
      drawControlPoint();
      drawingContext.restore();
    } else if(dragging == true){   //For lines, circles, rectangles, draw rubberbands
      restoreDrawingSurface();
      updateRubberbandRectangle(loc);
      drawRubberband(loc);
    }
    lastX = loc.x;
    lastY = loc.y;

    lastRect.w = rubberbandW;
    lastRect.h = rubberbandH;
  }

  function endPath(loc) {
    drawingContext.lineTo(loc.x, loc.y);
    drawingContext.stroke();

    if (selectedFunction === 'pathClosed') {
      drawingContext.closePath();
      if (doFill) {
        drawingContext.fill();
      }
      drawingContext.stroke();
    }
  }

  function mouseUpInDrawingCanvas(loc) {
    if (draggingControlPoint) {
      moveControlPoint(loc);
      finishDrawingCurve();
      draggingControlPoint = false;
    } else if (dragging) {
        if (selectedFunction === 'erase') {
          eraseLast();
        } else {
          if (selectedFunction === 'line')           finishDrawingLine(loc);
          else if (selectedFunction === 'rectangle') finishDrawingRectangle();
          else if (selectedFunction === 'circle')    finishDrawingCircle(loc);
          else if (selectedFunction === 'crop')      finishCroppingRegion();
        }
    }
    if (selectedFunction === 'dentalAnnotations' && mouseDownForDentalImage) {
      saveDrawingSurface();
      mouseDownForDentalImage = false;
      logDrawing();
    }
   dragging = false;
  }
  //End Text processing functions  
  function drawBackground() {
    backgroundContext.canvas.width = drawingContext.canvas.width;
    backgroundContext.canvas.height = drawingContext.canvas.height;
  }
// });
