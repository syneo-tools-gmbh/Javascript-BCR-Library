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
    let IM_HEIGHT = image.rows;
    let IM_WIDTH = image.cols;

    let gray = new cv.Mat();
    cv.cvtColor(image, gray, cv.COLOR_RGB2GRAY);
    let ksize = new cv.Size(7, 7);
    cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);

    let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(MORPH, MORPH));
    let dilated = new cv.Mat();
    cv.dilate(gray, dilated, kernel);

    let edged = new cv.Mat();
    cv.Canny(dilated, edged, 0, CANNY);

    // let test_corners = getCorners(edged);
    // let approx_contours = [];

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

/************************  WORK IN PROGRESS  **********************************/
function documentScanner3(img, callback) {
    let src = cv.imread(img);
    let dst = new cv.Mat();

    cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);

    let ksize = new cv.Size(5, 5);
    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(dst, dst, 50, 100, 3, true);

    let rectangleColor1 = new cv.Scalar(0, 255, 255);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // Get contours
    let poly = [];
    for (let i = 0; i < contours.size(); ++i) {
        let cnt = contours.get(i);
        poly.push(cnt);
    }

    // Sort by area
    poly.sort((a, b) => cv.contourArea(a) - cv.contourArea(b));

    // Biggest area first;
    poly.reverse();

    if (poly.length > 0) {
        let res = new cv.Mat();
        cv.approxPolyDP(poly[0], res, 5, true);

        let rotatedRect = cv.minAreaRect(res);

        let vertices = cv.RotatedRect.points(rotatedRect);
        for (let i = 0; i < 4; i++)
            cv.line(src, vertices[i], vertices[(i + 1) % 4], rectangleColor1, 1, cv.LINE_AA, 0);

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
    callback(canvas.toDataURL());
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

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(dst, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_NONE);

    // Get contours
    let poly = [];
    for (let i = 0; i < contours.size(); ++i) {
        let tmp = new cv.Mat();
        let cnt = contours.get(i);
        let epsilon = 0.05 * cv.arcLength(cnt, true);
        cv.approxPolyDP(cnt, tmp, epsilon, true);
        poly.push(tmp);
    }

    // Filter rectangles
    poly = poly.filter(x => x.rows === 4);

    // Only golder-ratio rectangles
    poly = poly.filter(x => {
        let rect = cv.minAreaRect(x);
        let ratio = rect.size.width / rect.size.height;
        if (ratio < 1) ratio = rect.size.height / rect.size.width;
        return GOLD_RATIO * (1 - GOLD_RATIO_ERROR) <= ratio && ratio <= GOLD_RATIO * (1 + GOLD_RATIO_ERROR);
    });

    // Filter small rect
    poly = poly.filter(x => cv.contourArea(x) > (src.cols * src.rows) * MIN_QUAD_AREA_RATIO);

    // Sort by area
    poly.sort((a, b) => cv.contourArea(a) - cv.contourArea(b));

    // Biggest area first;
    poly.reverse();

    // let rectangleColor = new cv.Scalar(0, 255, 255);

    if (poly.length > 0) {
        let rotatedRect = cv.minAreaRect(poly[0]);

        let rect = {
            x: rotatedRect.center.x - rotatedRect.size.width / 2,
            y: rotatedRect.center.y - rotatedRect.size.height / 2,
            width: rotatedRect.size.width,
            height: rotatedRect.size.height
        };
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

function documentScanner_old(img, callback) {
    img = cv.imread(img);

    // get the contour of the document
    // let screenCnt = getContour(img);

    // apply the perspective transformation
    let warped = img; // transform.four_point_transform(orig, screenCnt * ratio);

    // convert the warped image to grayscale
    let gray = new cv.Mat();
    cv.cvtColor(warped, gray, cv.COLOR_BGR2GRAY);

    // show results
    let canvas = document.createElement("canvas");
    cv.imshow(canvas, gray);
    callback(canvas.toDataURL());
    img.delete();
    gray.delete();
}

function documentScanner_old2(img, callback) {
    let src = cv.imread(img);
    let dst = new cv.Mat();

    // show results
    let canvas = document.createElement("canvas");
    cv.imshow(canvas, src);
    callback(canvas.toDataURL());
    src.delete();
    dst.delete();
}

