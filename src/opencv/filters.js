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

var GOLD_RATIO = (Math.sqrt(5) + 1) / 2;
var GOLD_RATIO_ERROR = 0.5;
var MIN_QUAD_AREA_RATIO = 0.15;

var MAX_QUAD_ANGLE_RANGE = 40;
var RESCALED_HEIGHT = 1024;
var MORPH = 9;
var CANNY = 84;
var HOUGH = 25;

function documentScanner(img, callback) {
    console.clear();
    let src = cv.imread(img);
    let dst = new cv.Mat();

    cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);

    let ksize = new cv.Size(5, 5);
    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(dst, dst, 50, 100, 3, true);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(dst, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_NONE);

    // Get contours
    let poly = [];
    for (let i = 0; i < contours.size(); ++i) {
        let tmp = new cv.Mat();
        let cnt = contours.get(i);
        epsilon = 0.05 * cv.arcLength(cnt, true);
        cv.approxPolyDP(cnt, tmp, epsilon, true);
        poly.push(tmp);
    }

    // Filter rectangles
    poly = poly.filter(x => x.rows == 4);

    // Only golder-ratio rectangles
    poly = poly.filter(x => {
        let rect = cv.minAreaRect(x);
        let ratio = rect.size.width / rect.size.height;
        if (ratio < 1) ratio = rect.size.height / rect.size.width;
        return GOLD_RATIO * (1 - GOLD_RATIO_ERROR) <= ratio && ratio <= GOLD_RATIO * (1 + GOLD_RATIO_ERROR);
    });

    // Filter small rect
    console.log(src, (src.cols * src.rows) * MIN_QUAD_AREA_RATIO);
    poly = poly.filter(x => cv.contourArea(x) > (src.cols * src.rows) * MIN_QUAD_AREA_RATIO);

    // Sort by area
    poly.sort((a, b) => cv.contourArea(a) - cv.contourArea(b));

    // Biggest area first;
    poly.reverse();

    let rectangleColor = new cv.Scalar(0, 255, 255);

    if (poly.length > 0) {
        let rotatedRect = cv.minAreaRect(poly[0]);

        let rect = {
            x: rotatedRect.center.x - rotatedRect.size.width / 2,
            y: rotatedRect.center.y - rotatedRect.size.height / 2,
            width: rotatedRect.size.width,
            height: rotatedRect.size.height
        };
        console.log(rotatedRect, rect);
        src = src.roi(rect);

        /*
        // DRAW contours
        let vertices = cv.RotatedRect.points(rotatedRect);
        for (let i = 0; i < 4; i++)
          cv.line(src, vertices[i], vertices[(i + 1) % 4], rectangleColor, 1, cv.LINE_AA, 0);
        */
    }

    // show results
    let canvas = document.createElement("canvas");
    cv.imshow(canvas, src);
    callback(canvas.toDataURL());
    src.delete();
    dst.delete();
}

function denoise(img, callback) {
    console.clear();
    let src = cv.imread(img);
    let dst = new cv.Mat();

    // gray scale image
    var gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);

    // Noise removal via bilateral filtering
    // cv.bilateralFilter(gray, dst, 5, 75, 75, cv.BORDER_DEFAULT);
    // Noise removal via gaussian blur 5x5

    let ksize = new cv.Size(1, 1);

    cv.adaptiveThreshold(gray, gray, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2)

    cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);

    cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)

    let canvas = document.createElement("canvas");
    cv.imshow(canvas, gray);
    callback(canvas.toDataURL());
    src.delete();
    dst.delete();

}

/******************************************************************************/
/************************  WORK IN PROGRESS  **********************************/

/******************************************************************************/
function getCorners(img) {
    /*
    lsd = cv2.createLineSegmentDetector()
    lines = lsd.detect(img)[0]

    corners = []
    if lines is not None:
        lines = lines.squeeze().astype(np.int32).tolist()
        horizontal_lines_canvas = np.zeros(img.shape, dtype=np.uint8)
        vertical_lines_canvas = np.zeros(img.shape, dtype=np.uint8)
        for line in lines:
            x1, y1, x2, y2 = line
            if abs(x2 - x1) > abs(y2 - y1):
                (x1, y1), (x2, y2) = sorted(((x1, y1), (x2, y2)), key=lambda pt: pt[0])
                cv2.line(horizontal_lines_canvas, (max(x1 - 5, 0), y1), (min(x2 + 5, img.shape[1] - 1), y2), 255, 2)
            else:
                (x1, y1), (x2, y2) = sorted(((x1, y1), (x2, y2)), key=lambda pt: pt[1])
                cv2.line(vertical_lines_canvas, (x1, max(y1 - 5, 0)), (x2, min(y2 + 5, img.shape[0] - 1)), 255, 2)

        lines = []

        contours = cv2.findContours(horizontal_lines_canvas, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        contours = contours[1]
        contours = sorted(contours, key=lambda c: cv2.arcLength(c, True), reverse=True)[:2]
        horizontal_lines_canvas = np.zeros(img.shape, dtype=np.uint8)
        for contour in contours:
            contour = contour.reshape((contour.shape[0], contour.shape[2]))
            min_x = np.amin(contour[:, 0], axis=0) + 2
            max_x = np.amax(contour[:, 0], axis=0) - 2
            left_y = int(np.average(contour[contour[:, 0] == min_x][:, 1]))
            right_y = int(np.average(contour[contour[:, 0] == max_x][:, 1]))
            lines.append((min_x, left_y, max_x, right_y))
            cv2.line(horizontal_lines_canvas, (min_x, left_y), (max_x, right_y), 1, 1)
            corners.append((min_x, left_y))
            corners.append((max_x, right_y))

        contours = cv2.findContours(vertical_lines_canvas, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        contours = contours[1]
        contours = sorted(contours, key=lambda c: cv2.arcLength(c, True), reverse=True)[:2]
        vertical_lines_canvas = np.zeros(img.shape, dtype=np.uint8)
        for contour in contours:
            contour = contour.reshape((contour.shape[0], contour.shape[2]))
            min_y = np.amin(contour[:, 1], axis=0) + 2
            max_y = np.amax(contour[:, 1], axis=0) - 2
            top_x = int(np.average(contour[contour[:, 1] == min_y][:, 0]))
            bottom_x = int(np.average(contour[contour[:, 1] == max_y][:, 0]))
            lines.append((top_x, min_y, bottom_x, max_y))
            cv2.line(vertical_lines_canvas, (top_x, min_y), (bottom_x, max_y), 1, 1)
            corners.append((top_x, min_y))
            corners.append((bottom_x, max_y))

        corners_y, corners_x = np.where(horizontal_lines_canvas + vertical_lines_canvas == 2)
        corners += zip(corners_x, corners_y)

    corners = self.filter_corners(corners)
    return corners
    */
}

function getContour(image) {
    image = image.clone();
    var IM_HEIGHT = image.rows;
    var IM_WIDTH = image.cols;

    console.log(IM_HEIGHT, IM_WIDTH);

    var gray = new cv.Mat();
    cv.cvtColor(image, gray, cv.COLOR_RGB2GRAY);
    let ksize = new cv.Size(7, 7);
    cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);

    var kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(MORPH, MORPH));
    var dilated = new cv.Mat();
    cv.dilate(gray, dilated, kernel);

    console.log(kernel, dilated);

    var edged = new cv.Mat();
    cv.Canny(dilated, edged, 0, CANNY);

    var test_corners = getCorners(edged);

    var approx_contours = [];

    /*



      if len(test_corners) >= 4:
          quads = []

          for quad in itertools.combinations(test_corners, 4):
              points = np.array(quad)
              points = transform.order_points(points)
              points = np.array([[p] for p in points], dtype = "int32")
              quads.append(points)

          # get top five quadrilaterals by area
          quads = sorted(quads, key=cv2.contourArea, reverse=True)[:5]
          # sort candidate quadrilaterals by their angle range, which helps remove outliers
          quads = sorted(quads, key=self.angle_range)

          approx = quads[0]
          if self.is_valid_contour(approx, IM_WIDTH, IM_HEIGHT):
              approx_contours.append(approx)

          # for debugging: uncomment the code below to draw the corners and countour found
          # by get_corners() and overlay it on the image

          # cv2.drawContours(rescaled_image, [approx], -1, (20, 20, 255), 2)
          # plt.scatter(*zip(*test_corners))
          # plt.imshow(rescaled_image)
          # plt.show()

      # also attempt to find contours directly from the edged image, which occasionally
      # produces better results
      (_, cnts, hierarchy) = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
      cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:5]

      # loop over the contours
      for c in cnts:
          # approximate the contour
          approx = cv2.approxPolyDP(c, 80, True)
          if self.is_valid_contour(approx, IM_WIDTH, IM_HEIGHT):
              approx_contours.append(approx)
              break

      # If we did not find any valid contours, just use the whole image
      if not approx_contours:
          TOP_RIGHT = (IM_WIDTH, 0)
          BOTTOM_RIGHT = (IM_WIDTH, IM_HEIGHT)
          BOTTOM_LEFT = (0, IM_HEIGHT)
          TOP_LEFT = (0, 0)
          screenCnt = np.array([[TOP_RIGHT], [BOTTOM_RIGHT], [BOTTOM_LEFT], [TOP_LEFT]])

      else:
          screenCnt = max(approx_contours, key=cv2.contourArea)

      return screenCnt.reshape(4, 2);*/
}

/*
  img: html image element with document to analyze
  callback: function(base64) with returned cleaned and cropped document
*/
function documentScanner_old(img, callback) {
    var img = cv.imread(img);

    // get the contour of the document
    var screenCnt = getContour(img);

    // apply the perspective transformation
    var warped = img; // transform.four_point_transform(orig, screenCnt * ratio);

    // convert the warped image to grayscale
    var gray = new cv.Mat();
    cv.cvtColor(warped, gray, cv.COLOR_BGR2GRAY);

    // show results
    let canvas = document.createElement("canvas");
    cv.imshow(canvas, gray);
    callback(canvas.toDataURL());
    img.delete();
    gray.delete();

}

function documentScanner_old2(img, callback) {
    console.clear();
    let src = cv.imread(img);
    let dst = new cv.Mat();

    // show results
    let canvas = document.createElement("canvas");
    cv.imshow(canvas, src);
    callback(canvas.toDataURL());
    src.delete();
    dst.delete();
}

