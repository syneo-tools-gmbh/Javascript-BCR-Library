/*
 
 Cordova BCR Library 0.0.4
 Authors: Gaspare Ferraro, Renzo Sala
 Contributors: Simone Ponte, Paolo Macco
 Filename: bcr.js
 Description: main library
 
 */

// bcr class
var bcr = (function () {
	
	// ************************************************************
	// private methods
	// ************************************************************
	var maxwidth = 2160;
	var maxheight = 1440;
	
	// get current script path
	var currentScriptPath = function () {
		
		var scripts = document.querySelectorAll('script[src]');
		var currentScript = scripts[scripts.length-1].src;
		var currentScriptChunks = currentScript.split('/');
		var currentScriptFile = currentScriptChunks[currentScriptChunks.length-1];
		
		return currentScript.replace(currentScriptFile, '');
	};
	
	// load files
	var loadJs = function (filename, callback) {
		var scriptTag = document.createElement('script');
		scriptTag.src = filename;
		
		scriptTag.onload = callback;
		scriptTag.onreadystatechange = callback;
		
		document.body.appendChild(scriptTag);
	};
	
	var executionPath = currentScriptPath();
	var WORKER_PATH = executionPath+'tesseract/worker.js';
	var TESSERACT_PATH = executionPath+'tesseract/tesseract-core.js';
	var LANG_PATH = executionPath+'data/';
	
	// ************************************************************
	// public methods and properties
	// ************************************************************
	return {
		
		// init function
		initialize: function () {
			
			// include js
			loadJs(executionPath+"bcr.cleaning.js", function () {
				loadJs(executionPath+"bcr.analyze.js", function () {
					loadJs(executionPath+"bcr.names.js", function () {
						loadJs(executionPath+"bcr.cities.js", function () {
							loadJs(executionPath+"bcr.streets.js", function () {
								loadJs(executionPath+"bcr.utility.js", function () {
									loadJs(executionPath+"tesseract/tesseract.js", function () {
										window.Tesseract = Tesseract.create({
											workerPath: WORKER_PATH,
											langPath: LANG_PATH,
											corePath: TESSERACT_PATH
										});
									});
								});
							});
						});
					});
				});
			});
		},
		
		// main method for recognizing
		recognizeBcr: function (b64image, callback, progress) {
			loadAndProcess(b64image, callback, progress);
		},
		
		MAXWIDTH: function () {
			return maxwidth;
		},
		
		MAXHEIGHT: function () {
			return maxheight;
		}
		
	};
})();
