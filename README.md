# [Javascript BCR Library](https://github.com/syneo-tools-gmbh/Javascript-BCR-Library) 0.0.4
## Authors: Gaspare Ferraro, Renzo Sala, Simone Ponte, Paolo Macco

BCR Library is a javascript library, using the OCR engine Tesseract.JS, that extracts name, company name, job, address, phone numbers, email and web address out of a business card picture.

The library is written in Javascript and can be used in any Javascript project (included in projects using frameworks for hybrid mobile applications, like Apache Cordova, Phonegap or Ionic).

The library can be used offline, no online dependencies are required.

# Installation
Copy the content of the repository and reference bcr via `script` tag in your HTML project:
  
  `<script type="text/javascript" src="src/bcr.js"></script>`

# Sample
The sample application in the repository must be executed on a web server.

If you have python it's enough to run `python -m http.server 8000` in the project folder.

If you use cordova, you can add the `browser` platform and run it (it works on other platforms like Android or iOS too).

# Reference

## Methods
### Init method
`bcr.initialize();`

### Recognize business card 
`bcr.recognizeBcr(base64image, displayResultCallback, displayProgressCallback);`

Where:

- `base64image` is the base64 string of the image to analyze.
- `displayResultCallback(result_data)` is a function called when the analysis of the business card is completed.
- `displayProgressCallback(progress_data)` is a function called after each progress in the analysis.

## Object

### `result_data`
JSON object in the format:

```json
{
  "Company": "",
  "Email": "",
  "Address": {
      "StreetAddress": "",
      "ZipCode": "",
      "Country": "",
      "Text": "",
      "City": ""
  },
  "Web": "",
  "Phone": "",
  "Text": "",
  "Fax": "",
  "Job": "",
  "Mobile": "",
  "Name": {
      "Text": "",
      "Surname": "",
      "Name": {
          "FirstName": "",
          "Text": "",
          "MiddleName": "",
          "ExtraName": ""
      }
  }
}
```

### `progress_data`

JSON object in the format:

```json
{
  "section": "",
  "progress": {
    "status": "",
    "progress": 1.0
  }
}
```

## JS Libraries used 

* [Tesseract.JS](https://github.com/naptha/tesseract.js) - 1.0.14<br/>
Tesseract.js wraps an [emscripten](https://github.com/kripken/emscripten) [port](https://github.com/naptha/tesseract.js-core) of the [Tesseract](https://github.com/tesseract-ocr/tesseract) [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) Engine.

* [OpenCV.js](https://github.com/opencv/opencv/tree/master/platforms/js) - 4.1.0<br/>


## Required Cordova Plugins (in case of cordova project) 

* [cordova-plugin-ionic-webview](https://github.com/ionic-team/cordova-plugin-ionic-webview/) - 4.0.0<br/>
A Web View plugin for Cordova, focused on providing the highest performance experience for Ionic apps (but can be used with any Cordova app).

### Contribution ###

The current status of the library is alpha. Looking forward for your contribution to make the first release.
