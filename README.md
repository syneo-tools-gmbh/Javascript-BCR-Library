# [Javascript BCR Library](https://github.com/syneo-tools-gmbh/Javascript-BCR-Library) 0.0.8
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
### Init methods
`bcr.initialize(crop, language, width, height);`

Initialize the bcr reader.

Where:

- **STRING** `crop`: the crop strategy (see [languages](#languages)), default `languages.GERMAN`.
- **STRING** `language`: the language trained data (see [cropStrategy](#cropStrategy)), default `cropStrategy.SMART`.
- **NUMBER** `width`: max internal width, default `2160`.
- **NUMBER** `height`: max internal height, default `1440`.
- Return Promise about JS loading.

---------------

`initializeForBCR(dynamicInclude);`

Initialize bcr reader given the ocr from google mobile vision text recognition API (cordova-plugin-mobile-ocr).

Where:
- **BOOL** `dynamicInclude`: if the references are not included externally (default `true`).
- Return Promise about JS loading.


### Recognize business card 

`bcr.recognizeBcr(base64image, displayResultCallback, displayProgressCallback);`

Where:

- **STRING** `base64image`: base64 string of the image to analyze.
- **FUNCTION** `displayResultCallback(result_data)` function called when the analysis of the business card is completed.
- **FUNCTION** `displayProgressCallback(progress_data)` function called after each progress in the analysis.

-----------------

`bcr.recognizeBcrFromOcr(ocr, displayResultCallback, displayProgressCallback);`

Where:

- **OBJECT** `ocr`: object containing ocr results data.
- **FUNCTION** `displayResultCallback(result_data)` function called when the analysis of the business card is completed.
- **FUNCTION** `displayProgressCallback(progress_data)` function called after each progress in the analysis.

### Getter methods

`cropStrategy()`

- Return the strategy label internally set.

------------

`maxWidth()`

- Return the value of the max width used internally to normalize the resolution.

------------

`maxHeight()`

- Return the value of the max height used internally to normalize the resolution.

------------

`language()`

- Return the value of the language trained data.

------------

`tesseract()`

- Return the initialized tesseract worker.

------------

`ocr()`

- Return the ocr passed.

------------

`onlyBCR()`

- Return if only BCR should be performed.

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

## ENUM

### languages

- `languages.DANISH`: Danish language
- `languages.GERMAN`: German language
- `languages.ENGLISH`: English language
- `languages.FRENCH`: French language
- `languages.ITALIAN`: Italian language
- `languages.SPANISH`: Spanish language
- `languages.SWEDISH`: Swedish language

### cropStrategy

- `cropStrategy.SMART`: clean the image

## JS Libraries used 

* [Tesseract.JS](https://github.com/naptha/tesseract.js) - 1.0.19<br/>
Tesseract.js wraps an [emscripten](https://github.com/kripken/emscripten) [port](https://github.com/naptha/tesseract.js-core) of the [Tesseract](https://github.com/tesseract-ocr/tesseract) [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) Engine.

## Required Cordova Plugins (in case of cordova project) 

* [cordova-plugin-ionic-webview](https://github.com/ionic-team/cordova-plugin-ionic-webview/) - 4.0.0<br/>
A Web View plugin for Cordova, focused on providing the highest performance experience for Ionic apps (but can be used with any Cordova app).

### Contribution ###

The current status of the library is alpha. Looking forward for your contribution to make the first release.
