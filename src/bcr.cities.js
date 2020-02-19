/**
 * Cordova BCR Library 1.0.12
 * Authors: Gaspare Ferraro, Renzo Sala
 * Contributors: Simone Ponte, Paolo Macco
 * Filename: bcr.streets.js
 * Description: dataset of cities
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

window.cities = [];
window.cityDS = {};
window.countryDS = [];

for (let k in languages)
    cities = cities.concat(languagesDS[languages[k]]["city"]);

for (let i = 0; i < cities.length; i++)
    cities[i] = [cities[i][0].toLowerCase(), cities[i][1].toLowerCase(), (cities[i][2] || "").toLowerCase()];

for (let i = 0; i < cities.length; i++) {
    if (typeof cityDS[cities[i][1]] === "undefined")
        cityDS[cities[i][1]] = [];
    cityDS[cities[i][1]].push([cities[i][0], cities[i][2]])
}

Object.keys(cityDS).forEach(k => {
    cityDS[k].sort();
    countryDS.push(k)
});

countryDS.sort();
console.log("Loaded", countryDS.length, "countries");