/* app.js */
requirejs.config({
    "baseUrl": "scripts",
	shim: {
        'cornerstone': {
            deps: ['jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'cornerstone'
        }
	},
    "paths": {
      "app": ".",
      "jquery": "./thirdparty/jquery",
	  "JpegImage" : "./thirdparty/jpg",
	  "cornerstone" : "./thirdparty/cornerstone",
	  "pako" : "./thirdparty/pako"
    }
});
requirejs([ "jquery" , "JpegImage", "thirdparty/jquery-ui" , "cornerstone", "pako"], function($,JpegImage, jqui,cornerstone, pk) {	
	$(function() {
		console.log('cornerstone');
		console.log(cornerstone);
		console.log('JpegImage');
		console.log(JpegImage);
		console.log('pako lib');
		console.log(pako);
		$( "#undo" ).button({
			text: false,
			icons: {
				primary: "ui-icon-circlesmall-minus"
			}
		}).click(function() {
			console.log("Clicked on Undo");
		});
		$( "#redo" ).button({
			text: false,
			icons: {
				primary: "ui-icon-circlesmall-plus"
			}
		}).click(function() {
			console.log("Clicked on Redo");
		});
		$( "#rotate180" ).button({
			text: false,
			icons: {
				primary: "ui-icon-refresh"
			}
		}).click(function() {
			console.log("Clicked on Rotate 180");
		});
		$( "#crop" ).button({
			text: false,
			icons: {
				primary: "ui-icon-scissors"
			}
		}).click(function() {
			console.log("Clicked on Crop");
		});
		$( "#forward" ).button({
			text: false,
			icons: {
				primary: "ui-icon-seek-next"
			}
		});
		$( "#end" ).button({
			text: false,
			icons: {
				primary: "ui-icon-seek-end"
			}
		});
		$( "#shuffle" ).button();
		$( "#repeat" ).buttonset();
	});	
	$.get('/data/data.json',function(image){
		//console.log(image);
		//image.imageId = imageId;
        if (image.color)
          image.render = cornerstone.renderColorImage;
        else
          image.render = cornerstone.renderGrayscaleImage;

        image.getPixelData = function() {
          if (image.Orthanc.Compression == 'Deflate')
            return getPixelDataDeflate(this);

          if (image.Orthanc.Compression == 'Jpeg')
            return getPixelDataJpeg(this);

          // Unknown compression
          return null;
        }

        result = image;	
	})
	var iconCanvas = document.getElementById('iconCanvas'),
    drawingCanvas = document.getElementById('drawingCanvas'),
    drawingContext = drawingCanvas.getContext('2d'),
    backgroundContext = document.createElement('canvas').getContext('2d'),
    iconContext = iconCanvas.getContext('2d'),
    strokeStyleSelect = document.getElementById('strokeStyleSelect'),
    fillStyleSelect = document.getElementById('fillStyleSelect'),
    lineWidthSelect = document.getElementById('lineWidthSelect'),
    eraseAllButton = document.getElementById('eraseAllButton'),
    flipButton = document.getElementById('flipButton'),
    controls = document.getElementById('controls'),

    drawingSurfaceImageData,
    rubberbandW,
    rubberbandH,
    rubberbandUlhc = {},

    dragging = false,
    mousedown = {},
    lastRect = {},
    lastX, lastY,

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
    
    editingMirrorText = false,
    currentMirrorText,

    CONTROL_POINT_RADIUS = 20,
    CONTROL_POINT_FILL_STYLE = 'rgba(255,255,0,0.5)',
    CONTROL_POINT_STROKE_STYLE = 'rgba(0, 0, 255, 0.8)',

    
    RUBBERBAND_LINE_WIDTH = 1,
    RUBBERBAND_STROKE_STYLE = 'green',

    ERASER_ICON_GRID_COLOR = 'rgb(0, 0, 200)',
    ERASER_ICON_CIRCLE_COLOR = 'rgba(100, 140, 200, 0.5)',
    ERASER_ICON_RADIUS = 20,

    ERASER_LINE_WIDTH = 1,
    ERASER_SHADOW_STYLE = 'blue',
    ERASER_STROKE_STYLE = 'rgba(0,0,255,0.6)',
    ERASER_SHADOW_OFFSET = -5,
    ERASER_SHADOW_BLUR = 20,
    ERASER_RADIUS = 40,
    SHADOW_COLOR = 'rgba(0,0,0,0.7)',
    ICON_BACKGROUND_STYLE = '#eeeeee',
    ICON_BORDER_STROKE_STYLE = 'rgba(100, 140, 230, 0.5)',
    ICON_STROKE_STYLE = 'rgb(100, 140, 230)',
    ICON_FILL_STYLE = '#dddddd',
    TEXT_ICON_FILL_STYLE = 'rgba(100, 140, 230, 0.5)',
    TEXT_ICON_TEXT = 'T',
    MIRRORTEXT_ICON_FILL_STYLE = 'rgba(100,140,230,0.5)';
    MIRRORTEXT_ICON_TEXT ='M',
    CIRCLE_ICON_RADIUS = 20,

    ICON_RECTANGLES = [
       { x: 13.5, y: 18.5, w: 48, h: 48 },
       { x: 13.5, y: 78.5, w: 48, h: 48 },
       { x: 13.5, y: 138.5, w: 48, h: 48 },
       { x: 13.5, y: 198.5, w: 48, h: 48 },
        {x:13.5, y: 258.5 , w:48, h: 48 }
    ],

    LINE_ICON = 0,
    RECTANGLE_ICON = 1,
    CIRCLE_ICON = 2,
    TEXT_ICON = 3,
    MIRRORTEXT_ICON = 4;


	// Icons.........................................................
	function drawLineIcon(rect) {
		iconContext.beginPath();
		iconContext.moveTo(rect.x + 5, rect.y + 5);
		iconContext.lineTo(rect.x + rect.w - 5, rect.y + rect.h - 5);
		iconContext.stroke();
	}

	function drawRectIcon(rect) {
		fillIconLowerRight(rect);
		iconContext.strokeRect(rect.x + 5, rect.y + 5,
							  rect.w - 10, rect.h - 10); 
	}

	function drawCircleIcon(rect) {
		var startAngle = 3*Math.PI/4,
		   endAngle = 7*Math.PI/4,
		   center = {x: rect.x + rect.w/2, y: rect.y + rect.h/2 };
		fillIconLowerRight(rect);
		iconContext.beginPath();
		iconContext.arc(rect.x + rect.w/2, rect.y + rect.h/2,
					   CIRCLE_ICON_RADIUS, 0, Math.PI*2, false);
		iconContext.stroke();
	}

	function drawTextIcon(rect) {
		var text = TEXT_ICON_TEXT;
		fillIconLowerRight(rect);
		iconContext.fillStyle = TEXT_ICON_FILL_STYLE;
		iconContext.fillText(text, rect.x + rect.w/2,
								  rect.y + rect.h/2 + 5);
		iconContext.strokeText(text, rect.x + rect.w/2,
									rect.y + rect.h/2 + 5);
	}

	function drawMirrorTextIcon(rect) {
		var mirrorText = MIRRORTEXT_ICON_TEXT;
		fillIconLowerRight(rect);
		iconContext.fillStyle = MIRRORTEXT_ICON_FILL_STYLE;
		iconContext.fillText(mirrorText,rect.x + rect.w/2,
								   rect.y +rect.h/2 +5);
		iconContext.strokeText(mirrorText,rect.x +rect.w/2,
								   rect.y + rect.h/2 +5);    
	}
	function drawIcon(rect) {
		iconContext.save();
		iconContext.strokeStyle = ICON_BORDER_STROKE_STYLE;
		iconContext.strokeRect(rect.x, rect.y, rect.w, rect.h);
		iconContext.strokeStyle = ICON_STROKE_STYLE;
	   
		if (rect.y === ICON_RECTANGLES[LINE_ICON].y)             drawLineIcon(rect);
		else if (rect.y === ICON_RECTANGLES[RECTANGLE_ICON].y)   drawRectIcon(rect);
		else if (rect.y === ICON_RECTANGLES[CIRCLE_ICON].y)      drawCircleIcon(rect);
		else if (rect.y === ICON_RECTANGLES[TEXT_ICON].y)        drawTextIcon(rect);
		else if(rect.y === ICON_RECTANGLES[MIRRORTEXT_ICON].y)       drawMirrorTextIcon(rect);
		iconContext.restore();
	}

	function drawIcons() {
		iconContext.clearRect(0,0, iconCanvas.width,
								  iconCanvas.height);
	   
		ICON_RECTANGLES.forEach(function(rect) {
			iconContext.save();
			if (selectedRect === rect)
				setSelectedIconShadow();
			else                      
				setIconShadow();
			iconContext.fillStyle = ICON_BACKGROUND_STYLE;
			iconContext.fillRect(rect.x, rect.y, rect.w, rect.h);
			iconContext.restore();
			drawIcon(rect);
		});
	}

	function drawOpenPathIconLines(rect) {
		iconContext.lineTo(rect.x + 13, rect.y + 19);
		iconContext.lineTo(rect.x + 15, rect.y + 17);
		iconContext.lineTo(rect.x + 25, rect.y + 12);
		iconContext.lineTo(rect.x + 35, rect.y + 13);
		iconContext.lineTo(rect.x + 38, rect.y + 15);
		iconContext.lineTo(rect.x + 40, rect.y + 17);
		iconContext.lineTo(rect.x + 39, rect.y + 23);
		iconContext.lineTo(rect.x + 36, rect.y + 25);
		iconContext.lineTo(rect.x + 32, rect.y + 27);
		iconContext.lineTo(rect.x + 28, rect.y + 29);
		iconContext.lineTo(rect.x + 26, rect.y + 31);
		iconContext.lineTo(rect.x + 24, rect.y + 33);
		iconContext.lineTo(rect.x + 22, rect.y + 35);
		iconContext.lineTo(rect.x + 20, rect.y + 37);
		iconContext.lineTo(rect.x + 18, rect.y + 39);
		iconContext.lineTo(rect.x + 16, rect.y + 39);
		iconContext.lineTo(rect.x + 13, rect.y + 36);
		iconContext.lineTo(rect.x + 11, rect.y + 34);
	}

	function fillIconLowerRight(rect) {
		iconContext.beginPath();
		iconContext.moveTo(rect.x + rect.w, rect.y);
		iconContext.lineTo(rect.x + rect.w, rect.y + rect.h);
		iconContext.lineTo(rect.x, rect.y + rect.h);
		iconContext.closePath();
		iconContext.fill();
	}

	function isPointInIconLowerRight(rect, x, y) {
		iconContext.beginPath();   
		iconContext.moveTo(rect.x + rect.w, rect.y);
		iconContext.lineTo(rect.x + rect.w, rect.y + rect.h);
		iconContext.lineTo(rect.x, rect.y + rect.h);
				
		return iconContext.isPointInPath(x, y);
	}

	function getIconFunction(rect, loc) {
		var action;

		if (rect.y === ICON_RECTANGLES[LINE_ICON].y)             action = 'line';
		else if (rect.y === ICON_RECTANGLES[RECTANGLE_ICON].y)   action = 'rectangle';
		else if (rect.y === ICON_RECTANGLES[CIRCLE_ICON].y)      action = 'circle';
		else if (rect.y === ICON_RECTANGLES[TEXT_ICON].y)        action = 'text';
		else if(rect.y === ICON_RECTANGLES[MIRRORTEXT_ICON].y)       action = 'mirrorText';
		if (action === 'rectangle'  || action === 'circle' || action === 'text'
									 || action === 'mirrorText') {
			doFill = isPointInIconLowerRight(rect, loc.x, loc.y);
		}
		return action;
	}

	function setIconShadow() {
		iconContext.shadowColor = SHADOW_COLOR;
		iconContext.shadowOffsetX = 1;
		iconContext.shadowOffsetY = 1;
		iconContext.shadowBlur = 2;
	}

	function setSelectedIconShadow() {
		iconContext.shadowColor = SHADOW_COLOR;
		iconContext.shadowOffsetX = 4;
		iconContext.shadowOffsetY = 4;
		iconContext.shadowBlur = 5;
	}

	function selectIcon(rect) {
		selectedRect = rect;
		drawIcons();
	}

	// Saving/Restoring the drawing surface..........................

	function saveDrawingSurface() {
		drawingSurfaceImageData = drawingContext.getImageData(0, 0,
								 drawingCanvas.width,
								 drawingCanvas.height);
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
		drawingContext.strokeRect(rubberbandUlhc.x,
								 rubberbandUlhc.y,
								 rubberbandW, rubberbandH);
		drawingContext.stroke();
	}
	function drawRubberbandLine(loc) {
		drawingContext.beginPath();
		drawingContext.moveTo(mousedown.x, mousedown.y);
		drawingContext.lineTo(loc.x, loc.y);
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
		}

		drawingContext.restore();
	}

	// Finish drawing lines, circles, and rectangles.................

	function finishDrawingLine(loc) {   
		drawingContext.beginPath();
		drawingContext.moveTo(mousedown.x, mousedown.y);
		drawingContext.lineTo(loc.x, loc.y);
		drawingContext.stroke();
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
	}

	function finishDrawingRectangle() {
		if (rubberbandW > 0 && rubberbandH > 0) {
			if (doFill) {
				drawingContext.fillRect(rubberbandUlhc.x,
									rubberbandUlhc.y,
									rubberbandW, rubberbandH) ;
			}
			drawingContext.strokeRect(rubberbandUlhc.x,
				rubberbandUlhc.y,
				rubberbandW, rubberbandH); 
	   }
	}

	// Event handling functions......................................

	function windowToCanvas(canvas, x, y) {
		var bbox = canvas.getBoundingClientRect();
		return {
			 x: x - bbox.left * (canvas.width  / bbox.width),
			 y: y - bbox.top  * (canvas.height / bbox.height)
		};
	}

	function mouseDownInControlCanvas(loc) {
		if (editingText) {
			editingText = false;
			eraseTextCursor();
			//hideKeyboard();
		} 
		else if(editingMirrorText) {
			editingMirrorText = false;
			eraseMirrorTextCursor();
			hideKeyboard();
		}
		else if (editingCurve) {
			editingCurve = false;
			restoreDrawingSurface();
		}
		ICON_RECTANGLES.forEach(function(rect) {
			
		iconContext.beginPath();
		iconContext.rect(rect.x, rect.y, rect.w, rect.h);
			if (iconContext.isPointInPath(loc.x, loc.y)) {
				selectIcon(rect, loc);
				selectedFunction = getIconFunction(rect, loc);
				
				if(selectedFunction === 'mirrorText') {
					drawingCanvas.style.cursor = 'mirrorText';
				} else {
					drawingCanvas.style.cursor = 'crosshair';
				}
			
				if (selectedFunction === 'text') {
					drawingCanvas.style.cursor = 'text';
				} else {
					drawingCanvas.style.cursor = 'crosshair';
				}
			}    
	   });
	}

	function moveControlPoint(loc) {
		controlPoint.x = loc.x;
		controlPoint.y = loc.y;
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

	function mirrorTextBackspace() {
		restoreDrawingSurface();
		currentMirrorText = currentMirrorText.slice(0,-1);
		eraseMirrorTextCursor();
	}

	function mirrorTextEnter() {
		finishDrawingMirrorText();
		mousedown.y += drawingContext.measureMirrorText('W').width;
		saveDrawingSurface();
		satrtDrawingMirrorText();
	}

	function mirrorTextInsert(key) { 
		currentMirrorText += key;
		restoreDrawingSurface();
		drawCurrentMirrorText();
		drawMirrorTextCursor();
	}
	 
	//End Text processing functions

	//Start handling document keyboard events
	document.onkeydown = function (e) {
		if (e.ctrlKey || e.metaKey || e.altKey)
			return;
	   
		if (e.keyCode === 8) {  // backspace
			e.preventDefault();
			backspace();
			//mirrorTextBackspace();
		}else if (e.keyCode === 13) { // enter
			e.preventDefault();
			enter();
			//mirrorTextEnter();
		}
	}
	document.onkeypress = function (e) {
		var key = String.fromCharCode(e.which);
		if (e.ctrlKey || e.metaKey || e.altKey)
			return;

		if (editingText && e.keyCode !== 8) {
			e.preventDefault();
			insert(key);
		}
		else if(editingMirrorText && e.keyCode !== 8){
			e.preventDefault();
			mirrorTextInsert(key);
		} 
	}
	/*document.onkeydown = function(s) {
		if (s.ctlrKey || s.metaKey  || s.altKey)
			return;
		if(s.keyCode === 8) {
			s.preventDefault();
			mirrorTextBackspace();
		}else if(s.keyCode === 13) {
			s.preventDefault();
		mirrorTextEnter();
		}
	}*/
	/*document.onkeypress = function(e) {
		var keyboard = String.fromCharCode(e.which);
		if(e.ctrlKey || e.metaKey || e.altKey)
			return;
		if(editingMirrorText && e.keyCode !== 8)
		{
			e.preventDefault();
			mirrorTextInsert(key);
		}
	}*/
	//End handling document keyboard events


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
		showKeyboard();
	}

	function finishDrawingText() {
		restoreDrawingSurface();
		drawCurrentText();
	}
		
	//    for mirror Text
		
	function eraseMirrorTextCursor() {
		restoreDrawingSurface();
		drawCurrentMirrorText();
	}

	function drawCurrentMirrorText() {
		if (doFill)    
		drawingContext.fillText(currentMirrorText, mousedown.x, mousedown.y);
		drawingContext.setTransform(-1,0,0,1,0,0);
		drawingContext.fillText(currentMirrorText,-mousedown.x,mousedown.y)
		drawingContext.strokeText(currentMirrorText,-mousedown.x, mousedown.y);
	}

	function drawMirrorTextCursor() {
		var widthMetric = drawingContext.measureText(currentMirrorText),
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

	function startDrawingMirrorText() {
		editingMirrorText = true; 
		currentMirrorText = '';
		drawMirrorTextCursor();
		showKeyboard();
	}

	function finishDrawingMirrorText() {
		restoreDrawingSurface();
		drawCurrentMirrorText();
	}

	function mouseDownInDrawingCanvas(loc) {
		dragging = true;
		if (editingText) {
			finishDrawingText();
		}
	else if(editingMirrorText) {
		finishDrawingMirrorText();
	}     
		else if (editingCurve) {
			if (drawingContext.isPointInPath(loc.x, loc.y)) {
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
		  }                 
		  else if (selectedFunction === 'text') {
			 startDrawingText();
		  }
			
			else if(selectedFunction === 'mirrorText') {
			  startDrawingMirrorText();
		  }
		  else {
			 editingText = false;
		  }      
		  lastX = loc.x;
		  lastY = loc.y;
	   }
	}

	function mouseMoveInDrawingCanvas(loc) {
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
	   

	   if (dragging || draggingControlPoint) {
		   if (selectedFunction === 'line' ||
			   selectedFunction === 'rectangle' ||
			   selectedFunction === 'circle') {
			 //drawGuidewires(loc.x, loc.y);
		  }
	   };
	   
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
			}
		}
	   dragging = false;
	};

	// Start Drawing canvas event handlers.................................
	drawingCanvas.onmousedown = function (e) {
		var x = e.x || e.clientX,
		   y = e.y || e.clientY;
		   loc = windowToCanvas(drawingCanvas, x, y)

		e.preventDefault();
		mouseDownInDrawingCanvas(loc);
	};

	drawingCanvas.onmousemove = function (e) {

		var x = e.x || e.clientX,
			y = e.y || e.clientY,
			loc = windowToCanvas(drawingCanvas, x, y);
		 
		e.preventDefault();
		mouseMoveInDrawingCanvas(loc);
	};

	drawingCanvas.onmouseup = function (e) {
		var x = e.x || e.clientX,
		   y = e.y || e.clientY,
		 loc = windowToCanvas(drawingCanvas, x, y);

		e.preventDefault();
		mouseUpInDrawingCanvas(loc);
	};
	//End drawing canvas event handlers

	// Start Control canvas event handlers.................................
	iconCanvas.onmousedown = function (e) {
		var x = e.x || e.clientX,
			y = e.y || e.clientY,
			loc = windowToCanvas(iconCanvas, x, y);
		e.preventDefault();
		mouseDownInControlCanvas(loc);
	};
	//End Control canvas event handlers

	// Control event handlers........................................
	strokeStyleSelect.onchange = function (e) {
		drawingContext.strokeStyle = strokeStyleSelect.value;
	};

	fillStyleSelect.onchange = function (e) {
		drawingContext.fillStyle = fillStyleSelect.value;
	};

	lineWidthSelect.onchange = function (e) {
		drawingContext.lineWidth = lineWidthSelect.value;
	};

	eraseAllButton.onclick = function (e) {
		drawingContext.clearRect(0,0,
								drawingCanvas.width,
								drawingCanvas.height);
		saveDrawingSurface();
		rubberbandW = rubberbandH = 0;
	};
		/*var dataUrl;
		dataUrl = drawingCanvas.toDataURL();
		var img = new Image();
		width = 50;
		height = 50;
		
	/*function flipImage(image, drawingContext, flipH, flipV) {
		var scaleH = flipH ? -1 : 1, // Set horizontal scale to -1 if flip horizontal
		scaleV = flipV ? -1 : 1, // Set verical scale to -1 if flip vertical
		posX = flipH ? width * -1 : 0, // Set x position to -100% if flip horizontal 
		posY = flipV ? height * -1 : 0; // Set y position to -100% if flip vertical

		drawingContext.save(); // Save the current state
		drawingContext.scale(scaleH, scaleV); // Set scale to flip the image
		drawingContext.drawImage(img, posX, posY, width, height); // draw the image

		drawingContext.restore(); // Restore the last saved state
	};

	function flipNinjas() {
		var flipH = document.getElementById('horizontalCheckbox').checked,
		flipV = document.getElementById('verticalCheckbox').checked;
		flipImage(img, drawingContext, flipH, flipV);

		return false;
	}

	flipButton.onclick = flipNinjas;
	img.onload = flipNinjas;
	img.src = drawingCanvas.toDataURL();*/


	flipButton.onclick = function(e) {
		var dataUrl;
		var flipH= true;
		var flipV = true;
		var scaleH = 1;
		var scaleV = 1;
		var posY = flipV ? drawingCanvas.height * -1 : 0;
		//var posX = flipH ? drawingCanvas.width * -1 : 0;
		//var scaleH = filpH ? -1 : 1;
		scaleV = flipV ? -1 : 1;  
		 
		if (flipButton.value === 'flipVertical') {
			dataUrl = drawingCanvas.toDataURL();
			var flipImageElement = new Image();
			flipImageElement.src = dataUrl;
			drawingContext.clearRect(0,0, drawingCanvas.width, drawingCanvas.height);
			drawingContext.save();
			drawingContext.translate(0,drawingCanvas.height);
			drawingContext.scale(1, -1);
			drawingContext.drawImage(flipImageElement,0,0);
			drawingContext.restore();			   
		} else {
			flipButton.value = 'flipVertical';
			drawingCanvas.style.display = 'inline';
			iconCanvas.style.display = 'inline';
			controls.style.display = 'inline';
			flipImageElement.style.display = 'none';
			flipInstuctions.style.display = 'none';
			//drawingContwxt.save();
			//drawingContext.translate(drawingConvas.width,0);
			//drawingContext.scale(1,-1);
			//drawingContext.drawImage(drawingCanvas,0,0);
			//drawingContext.restore();
		}
	};

		
	/*flipButton.onclick = function(e) {
		var dataUrl;
		var flipH= true;
		var flipV = true;
		var scaleH = 1;
		var scaleV = 1;
		var scaleH = flipH ? -1 : 1;
		var posX = flipH ? drawingCanvas.width * -1 : 0;
		//var scaleV = flipV ? -1 : 1,  
		//posY = flipV ? drawingCanvas.height * -1 : 0;
		 
		 if (flipButton.value === 'flipVertical') {
			 dataUrl = drawingCanvas.toDataURL();
			 flipImageElement.src = dataUrl;
			 //flipImageElement.style.display = 'inline';
			 //flipInstructions.style.display = 'inline';
			 //drawingCanvas.style.dispaly = 'inline';
			 //iconCanvas.style.display = 'inline';
			 //controls.style.display = 'inline';
			flipButton.value = 'Back to paint';
			drawingContext.save();
			drawingContext.scale(scaleX,scaleY);
			posX = flipH ? (drawingCanvas.width) * -1 : 0;
			drawingContext.drawImage(drawingCanvas,posX,0);
			flipH = !flipH;
			drawingContext.scale(1,1);
			drawingContext.restore();            
		 }
		 else {
			 flipButton.value = 'flipVertical';
			 drawingCanvas.style.display = 'inline';
			 iconCanvas.style.display = 'inline';
			 controls.style.display = 'inline';
			 flipImageElement.style.display = 'none';
			 flipInstuctions.style.display = 'none';
			 //drawingContwxt.save();
			 //drawingContext.translate(drawingConvas.width,0);
			 //drawingContext.scale(1,-1);
			 //drawingContext.drawImage(drawingCanvas,0,0);
			 //drawingContext.restore();
		 }
	};*/

	function drawBackground() {
			backgroundContext.canvas.width = drawingContext.canvas.width;
			backgroundContext.canvas.height = drawingContext.canvas.height;
	}
		
		
	// Initialization................................................
	iconContext.strokeStyle = ICON_STROKE_STYLE;
	iconContext.fillStyle = ICON_FILL_STYLE;

	iconContext.font = '48px Palatino';
	iconContext.textAlign = 'center';
	iconContext.textBaseline = 'middle';

	drawingContext.font = '48px Palatino';
	drawingContext.textBaseline = 'bottom';

	drawingContext.strokeStyle = strokeStyleSelect.value;
	drawingContext.fillStyle = fillStyleSelect.value;
	drawingContext.lineWidth = lineWidthSelect.value;
	drawIcons();
	drawBackground();


});
