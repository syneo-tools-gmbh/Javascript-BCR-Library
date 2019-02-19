# [Javascript BCR Library](https://github.com/syneo-tools-gmbh/Javascript-BCR-Library) 0.0.4
## Authors: Gaspare Ferraro, Renzo Sala, Simone Ponte, Paolo Macco

BCR Library is a javascript library, using the OCR engine Tesseract.JS, that extracts name, company name, job, address, phone numbers, email and web address out of a business card picture.

The library is written in Javascript and can be used in any Javascript project (included in projects using frameworks for hybrid mobile applications, like Apache Cordova, Phonegap or Ionic).

The library can be used offline, no online dependencies are required.

# Installation
Copy the content of the repository and reference bcr via `script` tag in your HTML project
  
  `<script type="text/javascript" src="src/bcr.js"></script>`

# Sample
The sample application in the repository must be executed on a web server.

# Reference

## Methods
### Init method
bcr.initialize();

### Recognize business card 
bcr.recognizeBcr(base64image, displayResultCallback, displayProgressCallback);

## Returned values

The `displayResultCallback(data)` returns a json structured as following:
```
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
The `displayProgressCallback(data)` returns a json which can be used to track the library progress.


## JS Libraries used 

* [Tesseract.JS](https://github.com/naptha/tesseract.js) - 1.0.14<br/>
Tesseract.js wraps an emascript port of the Tesseract OCR Engine.

## Required Cordova Plugins (in case of cordova project) 

* [cordova-plugin-ionic-webview](https://github.com/ionic-team/cordova-plugin-ionic-webview/) - 3.1.2<br/>
A Web View plugin for Cordova, focused on providing the highest performance experience for Ionic apps (but can be used with any Cordova app).

### Contribution ###

The current status of the library is alpha. Looking forward for your contribution to make the first release.
