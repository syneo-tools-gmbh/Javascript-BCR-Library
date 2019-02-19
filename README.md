# [Javascript BCR Library](https://github.com/syneo-tools-gmbh/Javascript-BCR-Library) 0.0.4
## Authors: Gaspare Ferraro, Renzo Sala, Simone Ponte, Paolo Macco

BCR Library is a javascript library, using the OCR engine Tesseract.JS, that extract name, company name, job, address, phone numbers, email and web address out of a picture of a business card.

The library is written in Javascript and can be used in any Javascript project (included in projects using frameworks for hybrid mobile applications, like Apache Cordova or Ionic).

The library can be used offline, no online dependencies are required.

# Installation
Copy the content of the repository and reference bcr via the `script` tag in your HTML project:
  
  `<script type="text/javascript" src="src/bcr.js"></script>`

# Sample
The sample application in the repository must be executed on a web server.

If you have python it's enough to run `python -m http.server 8000` in the project folder.

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
  Company: "",
  Email: "",
  Address: {
      StreetAddress: "",
      ZipCode: "",
      Country: "",
      Text: "",
      City: ""
  },
  Web: "",
  Phone: "",
  Text: "",
  Fax: "",
  Job: "",
  Mobile: "",
  Name: {
      Text: "",
      Surname: "",
      Name: {
          FirstName: "",
          Text: "",
          MiddleName: "",
          ExtraName: ""
      }
  }
}
```

### `progress_data`

JSON object in the format:

```json
{
  section: "",
  progress: {
    status: ""
    progress: 1.0
  }
}
```

## JS Libraries used 

* [Tesseract.JS](https://github.com/naptha/tesseract.js) - 1.0.14<br/>
Tesseract.js wraps an ecmascript port of the Tesseract OCR Engine.

## Required Cordova Plugins (in case of cordova project) 

* [cordova-plugin-ionic-webview](https://github.com/ionic-team/cordova-plugin-ionic-webview/) - 3.1.2<br/>
A Web View plugin for Cordova, focused on providing the highest performance experience for Ionic apps (but can be used with any Cordova app).

### Contribution ###

The current status of the library is alpha. Looking forward for your contribution to make the first release.
