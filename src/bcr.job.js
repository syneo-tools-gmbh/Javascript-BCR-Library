/**
 * Cordova BCR Library 0.0.6
 * Authors: Gaspare Ferraro, Renzo Sala
 * Contributors: Simone Ponte, Paolo Macco
 * Filename: bcr.streets.js
 * Description: dataset of job definitions
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

// job type
let jobDS = [

    // Corporate title
    /\bcae\b/g,
    /\bcaio\b/g,
    /\bcao\b/g,
    /\bcbdo\b/g,
    /\bcbo\b/g,
    /\bcco\b/g,
    /\bcdo\b/g,
    /\bceo\b/g,
    /\bcfo\b/g,
    /\bcgo\b/g,
    /\bchro\b/g,
    /\bcino\b/g,
    /\bcio\b/g,
    /\bciso\b/g,
    /\bcito\b/g,
    /\bcko\b/g,
    /\bclo\b/g,
    /\bcmo\b/g,
    /\bcno\b/g,
    /\bcoo\b/g,
    /\bcpo\b/g,
    /\bcqo\b/g,
    /\bcrdo\b/g,
    /\bcro\b/g,
    /\bcse\b/g,
    /\bcso\b/g,
    /\bcto\b/g,
    /\bcvo\b/g,
    /\bcwo\b/g,
    /\bcxo\b/g,

    // Levels	
    /\bintern\b/g,
    /\bjunior\b/g,
    /\bsenior\b/g,
    /\blead\b/g,

    // English
    /\banalyst\b/g,
    /\bcustomer\b/g,
    /\badministrative\b/g,
    /\bhead\b/g,
    /\bchief\b/g,
    /\bdirector\b/g,
    /\bvice\b/g,
    /\bpresident\b/g,
    /\bmanager\b/g,
    /\bsupervisor\b/g,
    /\bassistant\b/g,
    /\bspecialist\b/g,
    /\bartist\b/g,
    /\bworker\b/g,

    // German

    // Italian

    // French

    // Spanish

    // Danish

    // Swedish
];

console.log("Loaded", jobDS.length, "jobs");