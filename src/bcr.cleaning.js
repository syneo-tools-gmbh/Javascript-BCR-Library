/**
 * Cordova BCR Library 0.0.5
 * Authors: Gaspare Ferraro, Renzo Sala
 * Contributors: Simone Ponte, Paolo Macco
 * Filename: bcr.cleaning.js
 * Description: cleaning module
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
// load base64 image, prepare it and analyze it
// ****************************************************************************
function loadAndProcess(b64, callback, progress) {
    console.log("loadAndProcess start");
    pipeline(b64, progress, function (canvas, stages) {
        analyze(canvas, function (data, blocks) {

            // return data and stages
            let returnData = {stages: stages, result: data, blocks: blocks};
            console.log("Finish analysis");
            console.log("Result:", returnData);
            callback(returnData);

        }, progress);
    });
}

// ****************************************************************************
// Preprocessing pipeline
// ****************************************************************************
function pipeline(img, progress, callback) {
    prepareImage(img, progress, function (data) {
        let canvas = data;
        let stages = [];

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
        let result = imageToCC(canvas);
        canvas = result.canvas;
        let ccs = result.ccs;
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
        callback(canvas, stages);
    });
}

// ****************************************************************************
// Image preparation pipeline
// ****************************************************************************
function prepareImage(b64image, progress, callback) {

    // document scanner
    crop(b64image, function (b64, canvas) {

        // other actions on the canvas
        normalizeSize(canvas);

        // return canvas
        callback(canvas);

    });
}

// isolate card and crop
function crop(b64img, callback) {
    var img = new Image();
    img.onload = function () {

        // select crop strategy
        if (bcr.CROP_STRATEGY() === "smartcrop") {
            // smart crop strategy

            var scale = 1;
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            var width = img.width / scale;
            var height = img.height / scale;
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

            // readjust
            minX = cropResult.left * scale;
            minX -= 100; //minX * scaleMargin;

            maxX = cropResult.right * scale;
            maxX += 100; // maxX * scaleMargin;

            minY = cropResult.top * scale;
            minY -= 100; // minY * scaleMargin;

            maxY = cropResult.bottom * scale;
            maxY += 100; // maxY * scaleMargin;

            // parse result
            var tempCanvas = document.createElement("canvas");
            var tempCtx = tempCanvas.getContext("2d");
            width = maxX - minX;
            height = maxY - minY;
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCtx.drawImage(img, minX, minY, width, height, 0, 0, width, height);

            callback(b64img, tempCanvas);
        } else {
            // open cv strategy
            documentScanner(img, callback);
        }

    };
    img.src = b64img;
}

// ****************************************************************************
// normalize size
// ****************************************************************************
function normalizeSize(canvas) {

    // create context
    let ctx = canvas.getContext("2d");

    // **********************************************************************
    // RESIZE
    // **********************************************************************
    let maxwidth = bcr.MAXWIDTH();
    let maxheight = bcr.MAXHEIGHT();
    let tempCanvas = document.createElement("canvas");
    let tctx = tempCanvas.getContext("2d");

    // orientation and resize
    let width = canvas.width;
    let height = canvas.height;

    let newWidth = maxwidth;
    let newHeight = height * newWidth / width;

    // vertical case
    if (width < height) {
        newWidth = maxheight;
        newHeight = height * newWidth / width;
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

// TODO: Replace with OpenCV.js smart crop
// ****************************************************************************
// isolate card and crop
// ****************************************************************************
function smartCrop(b64img, progress, callback) {
    let img = new Image();
    img.onload = function () {

        let scale = 1;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let width = img.width / scale;
        let height = img.height / scale;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        /*

        // clean (pipeline)
        canvas = greyScale(canvas);
        canvas = backgroundElimination(canvas);

        let result = imageToCC(canvas);
        let ccs = result.ccs;
        canvas = result.canvas;
        let cropResult = boundingBox(ccs, canvas);

        // readjust
        let minX = cropResult.left * scale;
        minX -= 100; //minX * scaleMargin;

        let maxX = cropResult.right * scale;
        maxX += 100; // maxX * scaleMargin;

        let minY = cropResult.top * scale;
        minY -= 100; // minY * scaleMargin;

        let maxY = cropResult.bottom * scale;
        maxY += 100; // maxY * scaleMargin;

        // parse result
        let tempCanvas = document.createElement("canvas");
        let tempCtx = tempCanvas.getContext("2d");
        width = maxX - minX;
        height = maxY - minY;
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(img, minX, minY, width, height, 0, 0, width, height);
        */

        // callback(tempCanvas);
        callback(canvas);

    };
    img.src = b64img;
}

// ****************************************************************************
// get pixel function
// ****************************************************************************
function getPixel(data, y, x, width) {
    let baseIdx = (y * width + x) * 4;
    return [data[baseIdx], data[baseIdx + 1], data[baseIdx + 2], data[baseIdx + 3]];
}

// ****************************************************************************
// set pixel function
// ****************************************************************************
function setPixel(data, y, x, width, r, g, b, a) {

    if (typeof a === "undefined") {
        a = 255;
    }

    r = Math.min(255, Math.max(r, 0));
    g = Math.min(255, Math.max(g, 0));
    b = Math.min(255, Math.max(b, 0));
    a = Math.min(255, Math.max(a, 0));

    let baseIdx = (y * width + x) * 4;
    data[baseIdx] = r;
    data[baseIdx + 1] = g;
    data[baseIdx + 2] = b;
    data[baseIdx + 3] = a;
}

// ****************************************************************************
// transform in grey scale
// ****************************************************************************
function greyScale(canvas) {
    let ctx = canvas.getContext("2d");
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = pixels.data;
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(pixels, 0, 0);
    return canvas;
}

// ****************************************************************************
// eliminate background
// ****************************************************************************
function backgroundElimination(canvas) {
    let ctx = canvas.getContext("2d");
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = pixels.data;

    let width = canvas.width;
    let height = canvas.height;

    let pixels2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data2 = pixels2.data;

    let BlockW = Math.floor(width / 64);
    let BlockH = 2;

    let Tfixed = 20.;
    let Tmin = 100.;

    for (let y = 0; y < height; y += BlockH) {
        for (let x = 0; x < width; x += BlockW) {
            let Gmin = 255;
            let Gmax = 0;

            let Gx2 = 0;
            let Gx = 0;
            for (let i = 0; i < BlockH; i++) {
                for (let j = 0; j < BlockW; j++) {
                    let G = getPixel(data, y + i, x + j, width)[0];
                    Gmin = Math.min(Gmin, G);
                    Gmax = Math.max(Gmax, G);
                    Gx2 += G * G;
                    Gx += G;
                }
            }

            let N = (BlockH * BlockW);
            let variance = (Gx2 / N) - Math.pow(Gx / N, 2);

            let Tvar = ((Gmin - Tmin) - Math.min(Tfixed, Gmin - Tmin)) * 2;

            if (variance < Tvar) {
                for (let i = 0; i < BlockH; i++) {
                    for (let j = 0; j < BlockW; j++) {
                        setPixel(data2, y + i, x + j, width, 255, 255, 255, 255);
                    }
                }
            } else {
                for (let i = 0; i < BlockH; i++) {
                    for (let j = 0; j < BlockW; j++) {
                        let oldC = getPixel(data, y + i, x + j, width);
                        setPixel(data2, y + i, x + j, width, oldC[0], oldC[1], oldC[2], oldC[3]);
                    }
                }
            }
        }
    }

    ctx.putImageData(pixels2, 0, 0);
    return canvas;
}

// ****************************************************************************
// put image in canvas
// ****************************************************************************
function imageToCC(canvas) {
    let ctx = canvas.getContext("2d");
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = pixels.data;

    let width = canvas.width;
    let height = canvas.height;

    let BlockW = Math.floor(width / 64);
    let BlockH = 2;

    let BlockNW = Math.floor(width / BlockW);
    let BlockNH = Math.floor(height / BlockH);

    let blockBackground = Array(BlockNH).fill(undefined).map(() => Array(BlockNW).fill(false));
    let visited = Array(BlockNH).fill(undefined).map(() => Array(BlockNW).fill(false));

    for (let i = 0; i < BlockNH; i++) {
        for (let j = 0; j < BlockNW; j++) {
            let empty = true;
            for (let a = 0; a < BlockH && empty; a++) {
                for (let b = 0; b < BlockW && empty; b++) {
                    let color = getPixel(data, i * BlockH + a, j * BlockW + b, width)[0];
                    if (color !== 255) {
                        empty = false;
                    }
                }
            }
            blockBackground[i][j] = !empty;
            visited[i][j] = empty;
        }
    }

    let ccs = [];

    for (let i = 0; i < BlockNH; i++) {
        for (let j = 0; j < BlockNW; j++) {
            if (!visited[i][j]) {
                ccs.push(bfsVisit(visited, i, j));
            }
        }
    }
    return {canvas: canvas, ccs: ccs};
}

// ****************************************************************************
// bfs visit
// ****************************************************************************
function bfsVisit(visited, i, j) {
    let out = [];
    let Q = [];

    Q.push([i, j]);

    let width = visited[0].length;
    let height = visited.length;

    while (Q.length > 0) {
        let top = Q.pop();

        let x = top[1];
        let y = top[0];

        if (x < 0 || y < 0 || x >= width || y >= height || visited[y][x]) {
            continue;
        }

        visited[y][x] = true;
        out.push(top);

        Q.push([y - 1, x - 1]);
        Q.push([y - 1, x + 0]);
        Q.push([y - 1, x + 1]);

        Q.push([y + 0, x - 1]);
        Q.push([y + 0, x + 1]);

        Q.push([y + 1, x - 1]);
        Q.push([y + 1, x + 0]);
        Q.push([y + 1, x + 1]);

    }
    return out;

}

// ****************************************************************************
// css classification
// ****************************************************************************
function ccsClassification(ccs, canvas) {
    let ctx = canvas.getContext("2d");
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = pixels.data;

    let W = canvas.width;

    let BlockW = Math.floor(W / 64);
    let BlockH = 2;

    let ccsClean = [];
    for (let k = 0; k < ccs.length; k++) {
        let cc = ccs[k];
        let background = analyzeComponent(cc, canvas);
        if (background) {
            for (let l = 0; l < cc.length; l++) {
                let y = cc[l][0];
                let x = cc[l][1];
                for (let i = 0; i < BlockH; i++) {
                    for (let j = 0; j < BlockW; j++) {
                        setPixel(data, y * BlockH + i, x * BlockW + j, W, 255, 255, 255, 255);
                    }
                }
            }
        } else {
            ccsClean.push(cc);
        }
    }

    ctx.putImageData(pixels, 0, 0);

    return {canvas: canvas, ccs: ccsClean};
}

// ****************************************************************************
// bounding box
// ****************************************************************************
function boundingBox(ccs, canvas) {
    let W = canvas.width;

    let BlockW = Math.floor(W / 64);
    let BlockH = 2;

    let minX = 10e9, minY = 10e9, maxX = 0, maxY = 0;

    for (let k = 0; k < ccs.length; k++) {
        let cc = ccs[k];
        let background = analyzeComponent(cc, canvas);
        if (!background) {
            for (let l = 0; l < cc.length; l++) {
                let y = cc[l][0];
                let x = cc[l][1];
                for (let i = 0; i < BlockH; i++) {
                    for (let j = 0; j < BlockW; j++) {
                        // calculate minx, maxx, width, height
                        if (x * BlockW + j < minX) minX = x * BlockW + j;
                        if (y * BlockH + i < minY) minY = y * BlockH + i;
                        if (x * BlockW + j > maxX) maxX = x * BlockW + j;
                        if (y * BlockH + i > maxY) maxY = y * BlockH + i;
                    }
                }
            }
        }
    }

    return {top: minY, left: minX, bottom: maxY, right: maxX};
}

// ****************************************************************************
// analyze component
// ****************************************************************************
function analyzeComponent(cc, canvas) {
    let W = canvas.width;
    let H = canvas.height;

    let BlockW = Math.floor(W / 64);
    let BlockH = 2;

    // Black magic costants... :D
    let HTH = H / 60;
    let WTH = W / 40;
    let ATH = W * H / 1500;
    let BTH = H / 100;
    let LTH = W / 40;

    let minX = 1 << 30;
    let minY = 1 << 30;
    let maxX = 0;
    let maxY = 0;

    let Acc = (BlockW * BlockH) * cc.length;
    for (let i = 0; i < cc.length; i++) {
        let x = cc[i][1];
        let y = cc[i][0];
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    let Hcc = (maxY - minY + 1) * BlockH;
    let Wcc = (maxX - minX + 1) * BlockW;

    if (Hcc < HTH) {
        return true;
    }
    if (Wcc < WTH) {
        return true;
    }
    if (Acc < ATH) {
        return true;
    }

    if (Hcc < BTH && Wcc > LTH) {
        return true;
    }
    if (Wcc < BTH && Hcc > LTH) {
        return true;
    }

    let Rw2h = Wcc / Hcc;
    let Rmin = 1.2;
    let Rmax = 32.;

    let RAmin = 1.;
    let RAmax = 2.5;

    let RA = (Wcc * Hcc) / Acc;

    if (!(Rmin < Rw2h && Rw2h < Rmax)) {
        return true;
    }

    return !(RAmin < RA && RA < RAmax);
}

// ****************************************************************************
// image binarization
// ****************************************************************************
function imageBinarization(ccs, canvas) {
    let ctx = canvas.getContext("2d");
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = pixels.data;

    for (let i = 0; i < ccs.length; i++) {
        canvas = imageCCBinarization(data, ccs[i], canvas);
    }

    ctx.putImageData(pixels, 0, 0);
    return canvas;
}

// ****************************************************************************
// image cc binarization
// ****************************************************************************
function imageCCBinarization(data, cc, canvas) {
    let ctx = canvas.getContext("2d");
    let W = canvas.width;
    let H = canvas.height;

    let BlockW = Math.floor(W / 64);
    let BlockH = 2;

    let Gmin = 256;
    let Gmax = -1;

    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let copy = pixels.data;

    for (let i = 0; i < cc.length; i++) {
        let y = cc[i][0];
        let x = cc[i][1];
        for (let a = 0; a < BlockH; a++) {
            for (let b = 0; b < BlockW; b++) {
                let intensity = getPixel(data, y * BlockH + a, x * BlockW + b, W)[0];
                Gmin = Math.min(Gmin, intensity);
                Gmax = Math.max(Gmax, intensity);
            }
        }
    }

    let Gmid = (Gmin + Gmax) / 2;

    for (let i = 0; i < cc.length; i++) {
        let y = cc[i][0];
        let x = cc[i][1];

        for (let a = 0; a < BlockH; a++) {
            for (let b = 0; b < BlockW; b++) {

                let intensity = getPixel(data, y * BlockH + a, x * BlockW + b, W)[0];

                if (intensity < Gmid) {
                    setPixel(data, y * BlockH + a, x * BlockW + b, W, 0, 0, 0, 255);
                } else {
                    let Gneigh = 0;

                    let by = y * BlockH + a;
                    let bx = x * BlockW + b;

                    if (by > 0 && bx > 0) {
                        Gneigh += getPixel(copy, by - 1, bx - 1, W)[0] < Gmid ? 1 : 0;
                    }

                    if (by > 0) {
                        Gneigh += getPixel(copy, by - 1, bx, W)[0] < Gmid ? 1 : 0;
                    }

                    if (by > 0 && bx < W - 1) {
                        Gneigh += getPixel(copy, by - 1, bx + 1, W)[0] < Gmid ? 1 : 0;
                    }

                    if (bx > 0) {
                        Gneigh += getPixel(copy, by, bx - 1, W)[0] < Gmid ? 1 : 0;
                    }

                    if (bx < W - 1) {
                        Gneigh += getPixel(copy, by, bx + 1, W)[0] < Gmid ? 1 : 0;
                    }

                    if (by < H - 1 && bx > 0) {
                        Gneigh += getPixel(copy, by + 1, bx - 1, W)[0] < Gmid ? 1 : 0;
                    }

                    if (by < H - 1) {
                        Gneigh += getPixel(copy, by + 1, bx, W)[0] < Gmid ? 1 : 0;
                    }

                    if (by < H - 1 && bx < W - 1) {
                        Gneigh += getPixel(copy, by + 1, bx + 1, W)[0] < Gmid ? 1 : 0;
                    }

                    if (Gneigh > 4) {
                        setPixel(data, y * BlockH + a, x * BlockW + b, W, 0, 0, 0, 255);
                    } else {
                        setPixel(data, y * BlockH + a, x * BlockW + b, W, 255, 255, 255, 255);
                    }
                }
            }
        }
    }

    return canvas;
}
