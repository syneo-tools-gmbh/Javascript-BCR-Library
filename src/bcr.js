/**
 * Cordova BCR Library 0.0.6
 * Authors: Gaspare Ferraro, Renzo Sala
 * Contributors: Simone Ponte, Paolo Macco
 * Filename: bcr.js
 * Description: main library
 *
 * @license
 * Copyright 2019 Syneo Tools GmbH. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// ****************************************************************************
// BCR main class
// ****************************************************************************
let bcr = (function () {

    // ************************************************************
    // private properties (defaults)
    // ************************************************************

    var defaultMaxWidth = 2160;
    var defaultMaxHeight = 1440;
    var defaultLanguage = "deu"; // available: "deu","eng" (todo: transform in enum)
    var defaultCropStrategy = "smartcrop"; // available: "smartcrop" | "opencv" (todo: transform in enum)
    var tesseractWorker;

    // ************************************************************
    // private methods
    // ************************************************************

    // get current script path
    let currentScriptPath = function () {

        let scripts = document.querySelectorAll('script[src]');
        let currentScript = scripts[scripts.length - 1].src;
        let currentScriptChunks = currentScript.split('/');
        let currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];

        return currentScript.replace(currentScriptFile, '');
    };

    // load files
    let loadJs = async function (filename, callback) {
        console.log("Loading", filename);
        let scriptTag = document.createElement('script');
        scriptTag.src = filename;

        scriptTag.onload = callback;
        scriptTag.onreadystatechange = callback;

        document.body.appendChild(scriptTag);
    };

    let executionPath = currentScriptPath();
    let WORKER_PATH = executionPath + 'tesseract/worker.min.js';
    let TESSERACT_PATH = executionPath + 'tesseract/tesseract-core.js';
    let LANG_PATH = executionPath + 'data/';

    // ************************************************************
    // public methods and properties
    // ************************************************************
    return {

        /**
         * return maxwidth default
         * @param {string} crop the crop strategy.
         * @param {string} language the language trained data.
         * @param {string} width max internal width.
         * @param {string} height max internal height.
         * @return {void} return promise
         */
        initialize: function (crop, language, width, height) {

            return new Promise(resolve => {

                // check crop_strategy
                if (typeof width === "undefined") width = defaultMaxWidth;

                // check crop_strategy
                if (typeof height === "undefined") height = defaultMaxHeight;

                // check crop_strategy
                if (typeof crop === "undefined") crop = defaultCropStrategy;

                // check crop_strategy
                if (typeof language === "undefined") language = defaultLanguage;

                // assign defaults from init
                defaultMaxWidth = width;
                defaultMaxHeight = height;
                defaultCropStrategy = crop;
                defaultLanguage = language;

                // scripts to include
                let scripts = [];

                // BCR library
                scripts.push("bcr.analyze.js");
                scripts.push("bcr.cleaning.js");
                scripts.push("bcr.utility.js");

                // Datasets
                scripts.push("bcr.cities.js");
                scripts.push("bcr.job.js");
                scripts.push("bcr.names.js");
                scripts.push("bcr.streets.js");

                // Tesseract.js
                scripts.push("tesseract/tesseract.min.js");

                // create tesseract engine
                let createTesseractEngine = function () {
                    tesseractWorker = Tesseract.create({
                        workerPath: WORKER_PATH,
                        langPath: LANG_PATH,
                        corePath: TESSERACT_PATH
                    });

                    // resolve after tesseract initialization
                    resolve();
                };

                // load next available script of callback if none
                let nextLoad = function () {

                    // no more scripts
                    if (scripts.length === 0) {
                        // create engine and return promise
                        createTesseractEngine();
                    } else {
                        // load next script
                        loadJs(executionPath + scripts.shift(), nextLoad);
                    }
                };

                nextLoad();

            });
        },

        // main method for recognizing
        recognizeBcr: function (b64image, callback, progress) {
            console.log("recognizeBCR", "start");
            loadAndProcess(b64image, callback, progress);
            console.log("recognizeBCR", "end");
        },

        /**
         * public property to expose the strategy set
         * @return {string}
         * the strategy label internally set
         */
        cropStrategy: function () {
            return defaultCropStrategy;
        },

        /**
         * public property to expose maxwidth default
         * @return {number}
          the value of the max width used internally to normalize the resolution
         */
        maxWidth: function () {
            return defaultMaxWidth;
        },

        /**
         * public property to expose maxheight default
         * @return {number}
         * the value of the max height used internally to normalize the resolution
         */
        maxHeight: function () {
            return defaultMaxHeight;
        },

        /**
         * public property to expose default language
         * @return {string}
         * the value of the language trained data
         */
        language: function () {
            return defaultLanguage;
        },

        /**
         * public property to expose the worker
         * @return {object}
         * the initialized tesseract worker
         */
        tesseract: function () {
            return tesseractWorker;
        }
    };
})();
