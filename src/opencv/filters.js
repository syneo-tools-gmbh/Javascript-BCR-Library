/*
* Cordova BCR Library 0.0.5
* Authors: Gaspare Ferraro, Renzo Sala
* Contributors: Simone Ponte, Paolo Macco
* Filename: filters.js
* Description: OpenCV document filters
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

let GOLD_RATIO = (Math.sqrt(5) + 1) / 2;
let GOLD_RATIO_ERROR = 0.5;
let MIN_QUAD_AREA_RATIO = 0.15;

let MAX_QUAD_ANGLE_RANGE = 40;
let RESCALED_HEIGHT = 1024;
let MORPH = 9;
let CANNY = 84;
let HOUGH = 25;

/******************************************************************************/
// Document scanner for smart crop
/******************************************************************************/
function documentScanner(img, callback) {
    let src = cv.imread(img);
    let dst = new cv.Mat();

    // Phase 1
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY);
    cv.bitwise_not(gray, gray);

    let thresh = new cv.Mat();
    cv.threshold(gray, thresh, 0, 255, cv.THRESH_TOZERO | cv.THRESH_BINARY );

    let kernel1 = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(11, 11));
    let kernel2 = cv.Mat.ones(3, 3, cv.CV_8U);

    let erosion = new cv.Mat();
    cv.erode(thresh, erosion, kernel2, new cv.Point(-1, -1), 1);

    let dilation = new cv.Mat();
    cv.dilate(erosion, dilation, kernel1, new cv.Point(-1, -1), 7);

    let thres_otsu = new cv.Mat();
    cv.threshold(dilation, thres_otsu, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

    console.log(src);
    console.log(thres_otsu);
    cv.cvtColor(thres_otsu, thres_otsu, cv.COLOR_GRAY2RGBA);
    cv.bitwise_and(thres_otsu, src, src);

    // show results
    let canvas = document.createElement("canvas");
    cv.imshow(canvas, src);
    callback(canvas.toDataURL(), canvas);
    src.delete();
    dst.delete();

}

function documentScanner2(img, callback) {
    let src = cv.imread(img);
    let dst = new cv.Mat();

    cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);

    let ksize = new cv.Size(5, 5);
    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(dst, dst, 50, 100, 3, true);

    let rectangleColor = new cv.Scalar(0, 255, 255);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // Get contours
    let poly = [];
    for (let i = 0; i < contours.size(); ++i) {
        let tmp = new cv.Mat();
        let cnt = contours.get(i);
        let epsilon = 0.005 * cv.arcLength(cnt, true);
        cv.approxPolyDP(cnt, tmp, epsilon, true);
        poly.push(tmp);
    }

    // Filter rectangles
    poly = poly.filter(x => x.rows === 4);

    // Only golder-ratio rectangles
    /*poly = poly.filter(x => {
        let rect = cv.minAreaRect(x);
        let ratio = rect.size.width / rect.size.height;
        if (ratio < 1) ratio = rect.size.height / rect.size.width;
        return GOLD_RATIO * (1 - GOLD_RATIO_ERROR) <= ratio && ratio <= GOLD_RATIO * (1 + GOLD_RATIO_ERROR);
    });*/

    // Filter small rect
    poly = poly.filter(x => cv.contourArea(x) - (src.cols * src.rows) * MIN_QUAD_AREA_RATIO);

    // Sort by area
    poly.sort((a, b) => cv.contourArea(a) - cv.contourArea(b));

    // Biggest area first;
    poly.reverse();

    // If valid document found, crop original image
    if (poly.length > 0) {
        let rotatedRect = cv.minAreaRect(poly[0]);

        let vertices = cv.RotatedRect.points(rotatedRect);
        for (let i = 0; i < 4; i++)
            cv.line(src, vertices[i], vertices[(i + 1) % 4], rectangleColor, 1, cv.LINE_AA, 0);

        let corner1 = new cv.Point(vertices[0]["x"], vertices[0]["y"]);
        let corner2 = new cv.Point(vertices[1]["x"], vertices[1]["y"]);
        let corner3 = new cv.Point(vertices[2]["x"], vertices[2]["y"]);
        let corner4 = new cv.Point(vertices[3]["x"], vertices[3]["y"]);

        //Order the corners
        let cornerArray = [{corner: corner1}, {corner: corner2}, {corner: corner3}, {corner: corner4}];

        //Sort by Y position (to get top-down)
        cornerArray.sort((item1, item2) => {
            return (item1.corner.y < item2.corner.y) ? -1 : (item1.corner.y > item2.corner.y) ? 1 : 0;
        }).slice(0, 5);

        //Determine left/right based on x position of top and bottom 2
        let tl = cornerArray[0].corner.x < cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
        let tr = cornerArray[0].corner.x > cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
        let bl = cornerArray[2].corner.x < cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
        let br = cornerArray[2].corner.x > cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];

        //Calculate the max width/height
        let widthBottom = Math.hypot(br.corner.x - bl.corner.x, br.corner.y - bl.corner.y);
        let widthTop = Math.hypot(tr.corner.x - tl.corner.x, tr.corner.y - tl.corner.y);
        let theWidth = (widthBottom > widthTop) ? widthBottom : widthTop;
        let heightRight = Math.hypot(tr.corner.x - br.corner.x, tr.corner.y - br.corner.y);
        let heightLeft = Math.hypot(tl.corner.x - bl.corner.x, tr.corner.y - bl.corner.y);
        let theHeight = (heightRight > heightLeft) ? heightRight : heightLeft;

        //Transform!
        let finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, theWidth - 1, 0, theWidth - 1, theHeight - 1, 0, theHeight - 1]); //
        let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.corner.x, tl.corner.y, tr.corner.x, tr.corner.y, br.corner.x, br.corner.y, bl.corner.x, bl.corner.y]);
        let dsize = new cv.Size(theWidth, theHeight);
        let M = cv.getPerspectiveTransform(srcCoords, finalDestCoords);
        cv.warpPerspective(src, src, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
    }

    // show results
    let canvas = document.createElement("canvas");
    cv.imshow(canvas, src);
    callback(canvas.toDataURL(), canvas);
    src.delete();
    dst.delete();
}

/******************************************************************************/
// Denoise image filtering
/******************************************************************************/
function denoise(img, callback) {
    let src = cv.imread(img);
    let dst = new cv.Mat();

    // gray scale image
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);

    // Noise removal via bilateral filtering
    // cv.bilateralFilter(gray, dst, 5, 75, 75, cv.BORDER_DEFAULT);
    // Noise removal via gaussian blur 5x5

    let ksize = new cv.Size(1, 1);

    cv.adaptiveThreshold(gray, gray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

    cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);

    cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

    let canvas = document.createElement("canvas");
    cv.imshow(canvas, gray);
    callback(canvas.toDataURL());
    src.delete();
    dst.delete();
}
