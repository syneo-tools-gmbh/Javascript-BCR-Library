/*
 
 Cordova BCR Library 0.0.4
 Authors: Gaspare Ferraro, Renzo Sala
 Contributors: Simone Ponte, Paolo Macco
 Filename: bcr.cleaning.js
 Description: cleaning module
 
 */

// local variables
var stages = [];

// load base64 image, prepare it and analyze it
function loadAndProcess(b64, callback, progress) {
	
	pipeline(b64, progress, function (canvas) {
		analyze(canvas, function (data, blocks) {
			
			// return data and stages
			var returnData = {stages: stages, result: data, blocks: blocks};
			callback(returnData);
			
		}, progress);
	});
}

// preprocessing pipeline
function pipeline(img, progress, callback) {
	prepareImage(img, progress, function (data) {
		var canvas = data;
		stages = [];
		
		// **************************************
		// Cleaning pipeline
		// **************************************
		
		// Step 0 store original image in canvas
		stages.push(canvas.toDataURL());
		
		// Step 1 color to grey scale and store it
		canvas = greyScale(canvas);
		stages.push(canvas.toDataURL());
		
		// Step 2 remove background blocks and store it
		canvas = backgroundElimination(canvas);
		stages.push(canvas.toDataURL());
		
		// Step 3 identify connected components of blocks and store it
		var ccs = [];
		var result = imageToCC(canvas);
		canvas = result.canvas;
		ccs = result.ccs;
		stages.push(canvas.toDataURL());
		
		// Step 4 classify each blocks as background/data
		result = ccsClassification(ccs, canvas);
		canvas = result.canvas;
		ccs = result.ccs;
		stages.push(canvas.toDataURL());
		
		// Step 5 analyze pixels of each connected component
		canvas = imageBinarization(ccs, canvas);
		stages.push(canvas.toDataURL());
		
		// **************************************
		// END Cleaning pipeline
		// **************************************
		callback(canvas);
	});
}

// image preparation pipeline
function prepareImage(b64image, progress, callback) {
	
	// smart crop
	smartCrop(b64image, progress, function (canvas) {
		
		// other actions on the canvas
		normalizeSize(canvas);
		
		// return canvas
		callback(canvas);
	});
}

// normalize size
function normalizeSize(canvas) {
	
	// create context
	var ctx = canvas.getContext("2d");
	
	// **********************************************************************
	// RESIZE
	// **********************************************************************
	var maxwidth = bcr.MAXWIDTH();
	var maxheight = bcr.MAXHEIGHT();
	var tempCanvas = document.createElement("canvas");
	var tctx = tempCanvas.getContext("2d");
	
	// orientation and resize
	var width = canvas.width;
	var height = canvas.height;
	
	var newWidth = maxwidth;
	var newHeight = height*newWidth/width;
	
	// vertical case
	if(width<height){
		newWidth = maxheight;
		newHeight = height*newWidth/width;
	}
	
	// redraw image
	tempCanvas.width = width;
	tempCanvas.height = height;
	tctx.drawImage(canvas, 0, 0);
	
	// resize canvas
	canvas.width = newWidth;
	canvas.height = newHeight;
	ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, newWidth, newHeight);
	
	return canvas;
}

// isolate card and crop
function smartCrop(b64img, progress, callback) {
	var img = new Image();
	img.onload = function () {
		
		var scale = 1;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		
		var width = img.width/scale;
		var height = img.height/scale;
		canvas.width = width;
		canvas.height = height;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		
		// clean (pipeline)
		canvas = greyScale(canvas);
		canvas = backgroundElimination(canvas);
		var ccs = [];
		var result = imageToCC(canvas);
		ccs = result.ccs;
		canvas = result.canvas;
		var cropResult = boundingBox(ccs, canvas);
		var minX, maxX, minY, maxY;
		// readjust
		minX = cropResult.left*scale;
		minX -= 100; //minX * scaleMargin;
		
		maxX = cropResult.right*scale;
		maxX += 100; // maxX * scaleMargin;
		
		minY = cropResult.top*scale;
		minY -= 100; // minY * scaleMargin;
		
		maxY = cropResult.bottom*scale;
		maxY += 100; // maxY * scaleMargin;
		
		// parse result
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		width = maxX-minX;
		height = maxY-minY;
		tempCanvas.width = width;
		tempCanvas.height = height;
		tempCtx.drawImage(img, minX, minY, width, height, 0, 0, width, height);
		
		callback(tempCanvas);
		
	};
	img.src = b64img;
}

// get pixel function
function getPixel(data, y, x, width) {
	var baseIdx = (y*width+x)*4;
	return [data[baseIdx+0], data[baseIdx+1], data[baseIdx+2], data[baseIdx+3]];
}

// set pixel function
function setPixel(data, y, x, width, r, g, b, a) {
	if(typeof a === "undefined"){
		a = 255;
	}
	var baseIdx = (y*width+x)*4;
	data[baseIdx+0] = r;
	data[baseIdx+1] = g;
	data[baseIdx+2] = b;
	data[baseIdx+3] = a;
}

// transform in grey scale
function greyScale(canvas) {
	var ctx = canvas.getContext("2d");
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = pixels.data;
	for(var i = 0; i<data.length; i += 4){
		var avg = (data[i]+data[i+1]+data[i+2])/3;
		data[i] = avg; // red
		data[i+1] = avg; // green
		data[i+2] = avg; // blue
	}
	ctx.putImageData(pixels, 0, 0);
	return canvas;
}

// eliminate background
function backgroundElimination(canvas) {
	var ctx = canvas.getContext("2d");
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = pixels.data;
	
	var width = canvas.width;
	var height = canvas.height;
	
	var pixels2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data2 = pixels2.data;
	
	var BlockW = parseInt(width/64);
	var BlockH = 2;
	
	var Tfixed = 20.;
	var Tmin = 100.;
	
	for(var y = 0; y<height; y += BlockH){
		for(var x = 0; x<width; x += BlockW){
			var Gmin = 255;
			var Gmax = 0;
			
			var Gx2 = 0;
			var Gx = 0;
			var i, j;
			for(i = 0; i<BlockH; i++){
				for(j = 0; j<BlockW; j++){
					var G = getPixel(data, y+i, x+j, width)[0];
					Gmin = Math.min(Gmin, G);
					Gmax = Math.max(Gmax, G);
					Gx2 += G*G;
					Gx += G;
				}
			}
			
			var N = (BlockH*BlockW);
			var variance = (Gx2/N)-Math.pow(Gx/N, 2);
			
			var Tvar = ((Gmin-Tmin)-Math.min(Tfixed, Gmin-Tmin))*2;
			
			if(variance<Tvar){
				for(i = 0; i<BlockH; i++){
					for(j = 0; j<BlockW; j++){
						setPixel(data2, y+i, x+j, width, 255, 255, 255, 255);
					}
				}
			}
			else{
				for(i = 0; i<BlockH; i++){
					for(j = 0; j<BlockW; j++){
						var oldC = getPixel(data, y+i, x+j, width);
						setPixel(data2, y+i, x+j, width, oldC[0], oldC[1], oldC[2], oldC[3]);
					}
				}
			}
		}
	}
	
	ctx.putImageData(pixels2, 0, 0);
	return canvas;
}

// put image in canvas
function imageToCC(canvas) {
	var ctx = canvas.getContext("2d");
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = pixels.data;
	
	var width = canvas.width;
	var height = canvas.height;
	
	var BlockW = parseInt(width/64);
	var BlockH = 2;
	
	var BlockNW = parseInt(width/BlockW);
	var BlockNH = parseInt(height/BlockH);
	
	var blockBackground = Array(BlockNH).fill().map(() =>Array(BlockNW).fill(false));
	var visited = Array(BlockNH).fill().map(() =>Array(BlockNW).fill(false));
	
	var i, j;
	for(i = 0; i<BlockNH; i++){
		for(j = 0; j<BlockNW; j++){
			var empty = true;
			for(var a = 0; a<BlockH && empty; a++){
				for(var b = 0; b<BlockW && empty; b++){
					var color = getPixel(data, i*BlockH+a, j*BlockW+b, width)[0];
					if(color !== 255){
						empty = false;
					}
				}
			}
			blockBackground[i][j] = !empty;
			visited[i][j] = empty;
		}
	}
	
	var ccs = [];
	
	for(i = 0; i<BlockNH; i++){
		for(j = 0; j<BlockNW; j++){
			if(!visited[i][j]){
				ccs.push(bfsVisit(visited, i, j));
			}
		}
	}
	return {canvas: canvas, ccs: ccs};
}

// bfs visit
function bfsVisit(visited, i, j) {
	var out = [];
	var Q = [];
	
	Q.push([i, j]);
	
	var width = visited[0].length;
	var height = visited.length;
	
	while(Q.length>0){
		var top = Q.pop();
		
		var x = top[1];
		var y = top[0];
		
		if(x<0 || y<0 || x>=width || y>=height || visited[y][x]){
			continue;
		}
		
		visited[y][x] = true;
		out.push(top);
		
		Q.push([y-1, x-1]);
		Q.push([y-1, x+0]);
		Q.push([y-1, x+1]);
		
		Q.push([y+0, x-1]);
		Q.push([y+0, x+1]);
		
		Q.push([y+1, x-1]);
		Q.push([y+1, x+0]);
		Q.push([y+1, x+1]);
	}
	return out;
	
}

// css classification
function ccsClassification(ccs, canvas) {
	var ctx = canvas.getContext("2d");
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = pixels.data;
	
	var W = canvas.width;
	
	var BlockW = parseInt(W/64);
	var BlockH = 2;
	
	var ccsClean = [];
	for(var k = 0; k<ccs.length; k++){
		var cc = ccs[k];
		var background = analyzeComponent(cc, canvas);
		if(background){
			for(var l = 0; l<cc.length; l++){
				var y = cc[l][0];
				var x = cc[l][1];
				for(var i = 0; i<BlockH; i++){
					for(var j = 0; j<BlockW; j++){
						setPixel(data, y*BlockH+i, x*BlockW+j, W, 255, 255, 255, 255);
					}
				}
			}
		}
		else{
			ccsClean.push(cc);
		}
	}
	
	ctx.putImageData(pixels, 0, 0);
	
	return {canvas: canvas, ccs: ccsClean};
}

// bounding box
function boundingBox(ccs, canvas) {
	var W = canvas.width;
	
	var BlockW = parseInt(W/64);
	var BlockH = 2;
	
	var minX = 999999, minY = 999999, maxX = 0, maxY = 0;
	
	for(var k = 0; k<ccs.length; k++){
		var cc = ccs[k];
		var background = analyzeComponent(cc, canvas);
		if(!background){
			for(var l = 0; l<cc.length; l++){
				var y = cc[l][0];
				var x = cc[l][1];
				for(var i = 0; i<BlockH; i++){
					for(var j = 0; j<BlockW; j++){
						// calculate minx, maxx, width, height
						if(x*BlockW+j<minX){
							minX = x*BlockW+j;
						}
						if(y*BlockH+i<minY){
							minY = y*BlockH+i;
						}
						if(x*BlockW+j>maxX){
							maxX = x*BlockW+j;
						}
						if(y*BlockH+i>maxY){
							maxY = y*BlockH+i;
						}
					}
				}
			}
		}
	}
	
	return {top: minY, left: minX, bottom: maxY, right: maxX};
}

// analyze component
function analyzeComponent(cc, canvas) {
	var W = canvas.width;
	var H = canvas.height;
	
	var BlockW = parseInt(W/64);
	var BlockH = 2;
	
	// Black magic costants... :D
	var HTH = H/60;
	var WTH = W/40;
	var ATH = W*H/1500;
	var BTH = H/100;
	var LTH = W/40;
	
	var Hcc = 0;
	var Wcc = 0;
	var Acc = 0;
	
	var minX = 1<<30;
	var minY = 1<<30;
	var maxX = 0;
	var maxY = 0;
	
	Acc = (BlockW*BlockH)*cc.length;
	for(var i = 0; i<cc.length; i++){
		var x = cc[i][1];
		var y = cc[i][0];
		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
	}
	
	Hcc = (maxY-minY+1)*BlockH;
	Wcc = (maxX-minX+1)*BlockW;
	
	if(Hcc<HTH){
		return true;
	}
	if(Wcc<WTH){
		return true;
	}
	if(Acc<ATH){
		return true;
	}
	
	if(Hcc<BTH && Wcc>LTH){
		return true;
	}
	if(Wcc<BTH && Hcc>LTH){
		return true;
	}
	
	var Rw2h = Wcc/Hcc;
	var Rmin = 1.2;
	var Rmax = 32.;
	
	var RAmin = 1.;
	var RAmax = 2.5;
	
	var RA = (Wcc*Hcc)/Acc;
	
	if(!(Rmin<Rw2h && Rw2h<Rmax)){
		return true;
	}
	
	return !(RAmin<RA && RA<RAmax);
	
}

// image binarization
function imageBinarization(ccs, canvas) {
	var ctx = canvas.getContext("2d");
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = pixels.data;
	
	for(var i = 0; i<ccs.length; i++){
		canvas = imageCCBinarization(data, ccs[i], canvas);
	}
	
	ctx.putImageData(pixels, 0, 0);
	return canvas;
}

// image cc binarization
function imageCCBinarization(data, cc, canvas) {
	var ctx = canvas.getContext("2d");
	var W = canvas.width;
	var H = canvas.height;
	
	var BlockW = parseInt(W/64);
	var BlockH = 2;
	
	var Gmin = 256;
	var Gmax = -1;
	
	var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var copy = pixels.data;
	
	var i, y, x, a, b, intensity;
	for(i = 0; i<cc.length; i++){
		y = cc[i][0];
		x = cc[i][1];
		for(a = 0; a<BlockH; a++){
			for(b = 0; b<BlockW; b++){
				intensity = getPixel(data, y*BlockH+a, x*BlockW+b, W)[0];
				Gmin = Math.min(Gmin, intensity);
				Gmax = Math.max(Gmax, intensity);
			}
		}
	}
	
	var Gmid = (Gmin+Gmax)/2;
	
	for(i = 0; i<cc.length; i++){
		y = cc[i][0];
		x = cc[i][1];
		
		for(a = 0; a<BlockH; a++){
			for(b = 0; b<BlockW; b++){
				
				intensity = getPixel(data, y*BlockH+a, x*BlockW+b, W)[0];
				
				if(intensity<Gmid){
					setPixel(data, y*BlockH+a, x*BlockW+b, W, 0, 0, 0, 255);
				}
				else{
					var Gneigh = 0;
					
					var by = y*BlockH+a;
					var bx = x*BlockW+b;
					
					if(by>0 && bx>0){
						Gneigh += getPixel(copy, by-1, bx-1, W)[0]<Gmid ? 1 : 0;
					}
					
					if(by>0){
						Gneigh += getPixel(copy, by-1, bx+0, W)[0]<Gmid ? 1 : 0;
					}
					
					if(by>0 && bx<W-1){
						Gneigh += getPixel(copy, by-1, bx+1, W)[0]<Gmid ? 1 : 0;
					}
					
					if(bx>0){
						Gneigh += getPixel(copy, by+0, bx-1, W)[0]<Gmid ? 1 : 0;
					}
					
					if(bx<W-1){
						Gneigh += getPixel(copy, by+0, bx+1, W)[0]<Gmid ? 1 : 0;
					}
					
					if(by<H-1 && bx>0){
						Gneigh += getPixel(copy, by+1, bx-1, W)[0]<Gmid ? 1 : 0;
					}
					
					if(by<H-1){
						Gneigh += getPixel(copy, by+1, bx+0, W)[0]<Gmid ? 1 : 0;
					}
					
					if(by<H-1 && bx<W-1){
						Gneigh += getPixel(copy, by+1, bx+1, W)[0]<Gmid ? 1 : 0;
					}
					
					if(Gneigh>4){
						setPixel(data, y*BlockH+a, x*BlockW+b, W, 0, 0, 0, 255);
					}
					else{
						setPixel(data, y*BlockH+a, x*BlockW+b, W, 255, 255, 255, 255);
					}
				}
			}
		}
	}
	
	return canvas;
}
