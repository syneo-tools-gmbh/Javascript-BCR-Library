/**
 * Cordova BCR Library 0.0.5
 * Authors: Gaspare Ferraro, Renzo Sala
 * Contributors: Simone Ponte, Paolo Macco
 * Filename: bcr.streets.js
 * Description: dataset of street definitions
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

let streetsDS = [
    // Italian
    /\bvia\b/g,
    /\bparco\b/g,
    /\bpiazza\b/g,
    /\bcorso\b/g,
    /\bviale\b/g,
    /\bstrada\b/g,
    /\blargo\b/g,
    /\bscalinata\b/g,
    /\bsalita\b/g,
    /\bcascina\b/g,
    /\bcalle\b/g,
    /\bbaluardo\b/g,
    /\bcalata\b/g,
    /\bcampo\b/g,
    /\bcarraia\b/g,
    /\bcase\b/g,
    /\bcavalcavia\b/g,
    /\bcontrada\b/g,
    /\bcorte\b/g,
    /\bcrocicchio\b/g,
    /\bcrosa\b/g,
    /\bdiscesa\b/g,
    /\bgradinata\b/g,
    /\bisola\b/g,
    /\blido\b/g,
    /\blocalità\b/g,
    /\blungo/g,
    /\bmerceria\b/g,
    /\bparallela\b/g,
    /\bpassaggio\b/g,
    /\bmolo\b/g,
    /\bmura\b/g,
    /\bpasseggiata\b/g,
    /\bpendio\b/g,
    /\bportico\b/g,
    /\bprato\b/g,
    /\bporto\b/g,
    /\braggio\b/g,
    /\bvico\b/g,
    /\bvicolo\b/g,
    /\bviuzza\b/g,
    /\bvoltone\b/g,
    /\bvicinale\b/g,
    /\btratturo\b/g,
    /\btraversa\b/g,
    /\btronco\b/g,
    /\bterrazza\b/g,
    /\bstretto\b/g,
    /\bstrettoia\b/g,
    /\bstradone\b/g,
    /\bstradetta\b/g,
    /\bstradello\b/g,
    /\bstradale\b/g,
    /\bspiazzo\b/g,
    /\bspianata\b/g,
    /\bsentiero\b/g,
    /\bselciato\b/g,
    /\bscesa\b/g,
    /\bsagrato\b/g,
    /\brio\b/g,
    /\brione\b/g,
    /\bregione\b/g,
    /\brampe\b/g,
    /\bvoltone\b/g,

    // French
    /\brue\b/g,
    /\bplace\b/g,
    /\bpassage\b/g,
    /\bcité\b/g,
    /\bile\b/g,
    /\bboulevard\b/g,
    /\bavenue\b/g,
    /\ballée\b/g,

    // English
    /\bacres\b/g,
    /\bannex\b/g,
    /\bapproach\b/g,
    /\bbay\b/g,
    /\bbend\b/g,
    /\bboardwalk\b/g,
    /\bbow\b/g,
    /\bbrae\b/g,
    /\bbroadway\b/g,
    /\bcanyon\b/g,
    /\bcircus\b/g,
    /\bcliff\b/g,
    /\bclose\b/g,
    /\bcommon\b/g,
    /\bcorner\b/g,
    /\bcottage\b/g,
    /\bcrest\b/g,
    /\bcurve\b/g,
    /\bgarden\b/g,
    /\bgardens\b/g,
    /\bgate\b/g,
    /\bhill\b/g,
    /\bisland\b/g,
    /\blanding\b/g,
    /\bmanor\b/g,
    /\borchard\b/g,
    /\bpark\b/g,
    /\bparkway\b/g,
    /\bplaza\b/g,
    /\bquay\b/g,
    /\bridge\b/g,
    /\bshores\b/g,
    /\bstravenue\b/g,
    /\bvale\b/g,
    /\bwalk\b/g,
    /\bwood\b/g,
    /\bwoods\b/g,
    /\bstreet\b/g,
    /\balley\b/g,
    /\barcade\b/g,
    /\bavenue\b/g,
    /\bboulevard\b/g,
    /\bclose\b/g,
    /\bcrescent\b/g,
    /\bcourt\b/g,
    /\bdrive\b/g,
    /\besplanade\b/g,
    /\bgrove\b/g,
    /\bhighway\b/g,
    /\blane\b/g,
    /\bparade\b/g,
    /\bplace\b/g,
    /\broad\b/g,
    /\bsquare\b/g,
    /\bterrace\b/g,
    /\bway\b/g,

    // German
    /\bkamp\b/g,
    /\ballee\b/g,
    /\bstieg\b/g,
    /\bdamm\b/g,
    /\bstrasse\b/g,
    /\bstraße\b/g,
    /\bweg\b/g,
    /\bplatz\b/g,
    /\bmoor\b/g,

    // Spanish
    /\bcalle\b/g,
    /\bcarrera\b/g,
    /\bcarretera\b/g,
    /\bcuesta\b/g,
    /\bpaseo\b/g,
    /\bplaza\b/g,
    /\bronda\b/g,

    // Danish
    /\bgade\b/g,
    /\bvej\b/g,
    /\bvia\b/g,
    /\bfirkantet\b/g,
    /\bkursus\b/g,
    /\bboulevard\b/g,

    // Swedish
    /\bmäster\b/g,
    /\bnorr\b/g,
    /\bgata\b/g,
    /gatan\b/g,
    /svägen\b/g,
    /\bsätt\b/g,
    /\bfrån\b/g,
    /\bkvadrat\b/g,
    /\bnaturligtvis\b/g,
    /\bavenue\b/g
];

console.log("Loaded", streetsDS.length, "streets");
