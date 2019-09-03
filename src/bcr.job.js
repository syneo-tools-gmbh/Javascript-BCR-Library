/**
 * Cordova BCR Library 0.0.9
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
    /\bconsultant\b/g,
    /\barchitect\b/g,

    // German
    /\bgeschäftsführer\b/g,
    /\bvertrieb\b/g,
    /\bproduktmanagement\b/g,
    /\bproduktmanager\b/g,
    /\bprodukttechnik\b/g,
    /\bleiter\b/g,
    /\bberater\b/g,
    /\babteilungsdirektor\b/g,
    /\bdirektor\b/g,
    /\bstellvertretender\b/g,
    /\bangestellter\b/g,
    /\bangestellte\b/g,
    /\banwalt\b/g,
    /\banwältin\b/g,
    /\banwalt\b/g,
    /\bapotheker\b/g,
    /\barchitekt\b/g,
    /\barzt\b/g,
    /\bärztin\b/g,
    /\bbauer\b/g,
    /\bbäuerin\b/g,
    /\bbäuerin\b/g,
    /\bbeamter\b/g,
    /\bbeamtin\b/g,
    /\bbriefträger\b/g,
    /\bbriefträgerin\b/g,
    /\bbuchhalter\b/g,
    /\bbuchhalterin\b/g,
    /\bbusfahrer\b/g,
    /\bbusfahrerin\b/g,
    /\bbäcker\b/g,
    /\bbäckerin\b/g,
    /\bchemiker\b/g,
    /\bchemikerin\b/g,
    /\bchirurg\b/g,
    /\bchirurgin\b/g,
    /\bdolmetscher\b/g,
    /\bdolmetscherin\b/g,
    /\belektriker\b/g,
    /\belektrikerin\b/g,
    /\bfernfahrer\b/g,
    /\bfernfahrerin\b/g,
    /\bfeuerwehrmann\b/g,
    /\bfeuerwehrfrau\b/g,
    /\bfischer\b/g,
    /\bfischerin\b/g,
    /\bfleischer\b/g,
    /\bfleischerin\b/g,
    /\bfremdenführer\b/g,
    /\bfremdenführerin\b/g,
    /\bfriseur\b/g,
    /\bfriseurin\b/g,
    /\bfriseuse\b/g,
    /\bgärtner\b/g,
    /\bgärtnerin\b/g,
    /\bhandwerker\b/g,
    /\bhandwerkerin\b/g,
    /\bhotelfachmann\b/g,
    /\bhotelfachfrau\b/g,
    /\bingenieur\b/g,
    /\bingenieurin\b/g,
    /\bjournalist\b/g,
    /\bjournalistin\b/g,
    /\bkaufmann\b/g,
    /\bkauffrau\b/g,
    /\bkassierer\b/g,
    /\bkassiererin\b/g,
    /\bkrankenpfleger\b/g,
    /\bkrankenschwester\b/g,
    /\bkellner\b/g,
    /\bkellnerin\b/g,
    /\bkoch\b/g,
    /\bköchin\b/g,
    /\blehrer\b/g,
    /\blehrerin\b/g,
    /\bmaler\b/g,
    /\bmalerin\b/g,
    /\bmathematiker\b/g,
    /\bmathematikerin\b/g,
    /\bmechaniker\b/g,
    /\bmechanikerin\b/g,
    /\bmetzger\b/g,
    /\bmetzgerin\b/g,
    /\bmusiker\b/g,
    /\bmusikerin\b/g,
    /\bpastor\b/g,
    /\bpastorin\b/g,
    /\bpfarrer\b/g,
    /\bpfarrerin\b/g,
    /\bphysiker\b/g,
    /\bphysikerin\b/g,
    /\bpolitiker\b/g,
    /\bpolitikerin\b/g,
    /\bpolizist\b/g,
    /\bpolizistin\b/g,
    /\bprogrammierer\b/g,
    /\bprogrammiererin\b/g,
    /\bpsychiater\b/g,
    /\bpsychiaterin\b/g,
    /\bputzfrau\b/g,
    /\braumpfleger\b/g,
    /\brechtsanwalt\b/g,
    /\brechtsanwältin\b/g,
    /\breporter\b/g,
    /\breporterin\b/g,
    /\brichter\b/g,
    /\brichterin\b/g,
    /\bschauspieler\b/g,
    /\bschauspielerin\b/g,
    /\bschriftsteller\b/g,
    /\bschriftstellerin\b/g,
    /\bsekretär\b/g,
    /\bsekretärin\b/g,
    /\bsportler\b/g,
    /\bsportlerin\b/g,
    /\bsoldat\b/g,
    /\bsoldatin\b/g,
    /\btierarzt\b/g,
    /\btierärztin\b/g,
    /\btänzer\b/g,
    /\btänzerin\b/g,
    /\bverkäufer\b/g,
    /\bverkäuferin\b/g,
    /\bvertreter\b/g,
    /\bvertreterin\b/g,
    /\bwinzer\b/g,
    /\bwinzerin\b/g,
    /\bzahnarzt\b/g,
    /\bzahnärztin\b/g,
    /\bübersetzer\b/g,
    /\bübersetzerin\b/g,
    /\bchef\b/g,
    /\bchefin\b/g,
    /\bstudent\b/g,
    /\bstudentin\b/g,

    // Italian
    /\bprogrammatore\b/g,
    /\banalista\b/g,
    /\bsviluppatore\b/g,
    /\bpresidente\b/g,
    /\bvicepresidente\b/g,
    /\bvice-presidente\b/g,
    /\bvice-\b/g,
    /\bamministratore\b/g,
    /\bamministratore delegato\b/g,
    /\bfondatore\b/g

    // French

    // Spanish

    // Danish

    // Swedish
];

// titles to be kept
let titleDS = [

    // x-language
    /\bprof\b/g,
    /\bprof.\b/g,

    // English
    /\bprofessor\b/g,
    /\bdr\b/g,
    /\bdr.\b/g,
    /\bdoc\b/g,
    /\bdoc.\b/g,
    /\bdoctor\b/g,
    /\bmr\b/g,
    /\bmr.\b/g,
    /\bmrs.\b/g,
    /\bmrs\b/g,
    /\bms.\b/g,
    /\bms\b/g,
    /\bmiss\b/g,
    /\brev\b/g,
    /\brev.\b/g,

    // German
    /\bmag\b/g,
    /\bmag.\b/g,
    /\bherr\b/g,
    /\bfrau\b/g,
    /\bdoktor\b/g,
    /\bmagister\b/g,
    /\bingenieur\b/g,

    // Italian
    /\bprofessore\b/g,
    /\bdottore\b/g,
    /\bdottor\b/g,
    /\bdott.\b/g,
    /\bavvocato\b/g,
    /\bavv\b/g,
    /\bavv.\b/g,

    // French
    /\bdocteur\b/g,
    /\bprofesseur\b/g,
    /\bmonsieur\b/g,
    /\bmadame\b/g,
    /\bmademoiselle\b/g

    // Spanish

    // Danish

    // Swedish


];

// titles to be trashed
let titleTrashDS = [

    // english
    /\bing\b/g,
    /\bing.\b/g,
    /\bing.-\b/g,
    /\bphd\b/g,
    /\bphd.-\b/g,

    // German
    /\bpd\b/g,
    /\bpd.\b/g,
    /\bpd.-\b/g,
    /\bdipl\b/g,
    /\bdipl.\b/g,
    /\bdipl.-\b/g,

    // italian
    /\blegale\b/g,
    /\bragioniere\b/g,
    /\bragionier\b/g,
    /\brag\b/g,
    /\brag.\b/g,
    /\bgeom\b/g,
    /\bgeom.\b/g

    // French

    // Spanish

    // Danish

    // Swedish
];

console.log("Loaded", jobDS.length, "jobs");
console.log("Loaded", titleDS.length, "titles");