/**
 * Cordova BCR Library 0.0.8
 * Authors: Gaspare Ferraro, Renzo Sala
 * Contributors: Simone Ponte, Paolo Macco
 * Filename: bcr.utility.js
 * Description: various utilities
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

function titleCase(text) {
    if (!text) return text;
    if (typeof text !== 'string') throw "invalid argument";

    return text.toLowerCase().split(' ').map(value => {
        return value.charAt(0).toUpperCase() + value.substring(1);
    }).join(' ');
}

function editDistance(word1, word2) {
    let i, j, Cmin;
    if (typeof word1 === "undefined" && typeof word2 === "undefined") {
        return 1;
    }
    if (typeof word1 === "undefined" || word1.length === 0) {
        return word2.length;
    }
    if (typeof word2 === "undefined" || word2.length === 0) {
        return word1.length;
    }

    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();

    let len1 = word1.length;
    let len2 = word2.length;

    let dp = Array(len1 + 1).fill(0).map(() => Array(len2 + 1).fill(0));

    for (i = 0; i <= len1; i++) {
        dp[i][0] = i;
    }
    for (j = 0; j <= len2; j++) {
        dp[0][j] = j;
    }

    for (i = 0; i < len1; i++) {
        let c1 = word1.charAt(i);

        for (j = 0; j < len2; j++) {
            let c2 = word2.charAt(j);

            if (c1 === c2) {
                dp[i + 1][j + 1] = dp[i][j];
            } else {
                let Creplace = dp[i][j] + 1;
                let Cinsert = dp[i][j + 1] + 1;
                let Cdelete = dp[i + 1][j] + 1;

                Cmin = Math.min(Creplace, Math.min(Cinsert, Cdelete));
                dp[i + 1][j + 1] = Cmin;
            }
        }
    }

    return dp[len1][len2];
}

function substringEditDistance(word1, word2) {
    let i, j, Cmin;
    if (typeof word1 === "undefined" && typeof word2 === "undefined") {
        return 1;
    }
    if (word1 === undefined || word1.length === 0) {
        return word2.length;
    }
    if (word2 === undefined || word2.length === 0) {
        return word1.length;
    }

    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();

    let len1 = word1.length;
    let len2 = word2.length;

    let dp = Array(len1 + 1).fill(0).map(() => Array(len2 + 1).fill(0));

    for (i = 0; i <= len1; i++) {
        dp[i][0] = i;
    }
    for (j = 0; j <= len2; j++) {
        dp[0][j] = 0;
    }

    for (i = 0; i < len1; i++) {
        let c1 = word1.charAt(i);

        for (j = 0; j < len2; j++) {
            let c2 = word2.charAt(j);

            if (c1 === c2) {
                dp[i + 1][j + 1] = dp[i][j];
            } else {
                let Creplace = dp[i][j] + 1;
                let Cinsert = dp[i][j + 1] + 1;
                let Cdelete = dp[i + 1][j] + 1;

                Cmin = Math.min(Creplace, Math.min(Cinsert, Cdelete));
                dp[i + 1][j + 1] = Cmin;
            }
        }
    }

    let minLastRow = dp[len1][0];
    for (i = 0; i <= len2; i++) {
        minLastRow = Math.min(minLastRow, dp[len1][i]);
    }

    return minLastRow;
}

function substringSimilarity(word1, word2) {
    if (typeof word1 === "undefined" || typeof word2 === "undefined") {
        return 0.;
    }
    if (word1.length === 0 || word2.length === 0) {
        return 0.;
    }
    return 1. - substringEditDistance(word1, word2) / Math.max(word1.length, word2.length);
}

function stringSimilarity(word1, word2) {
    if (typeof word1 === "undefined" || typeof word2 === "undefined") {
        return 0.;
    }
    if (word1.length === 0 || word2.length === 0) {
        return 0.;
    }
    return 1. - editDistance(word1, word2) / Math.max(word1.length, word2.length);
}

function capitalize(str) {
    if (typeof str === "undefined" || str.length === 0) {
        return "";
    }
    return str.substr(0, 1).toUpperCase() + str.substring(1);
}

function sSimilarity(sa1, sa2) {

    // for my purposes, comparison should not check case or whitespace
    let s1 = sa1.replace(/\s/g, "").toLowerCase();
    let s2 = sa2.replace(/\s/g, "").toLowerCase();

    function intersect(arr1, arr2) {
        // I didn't write this.  I'd like to come back sometime
        // and write my own intersection algorithm.  This one seems
        // clean and fast, though.  Going to try to find out where
        // I got it for attribution.  Not sure right now.
        let r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    let pairs = function (s) {
        // Get an array of all pairs of adjacent letters in a string
        let pairs = [];
        for (let i = 0; i < s.length - 1; i++) {
            pairs[i] = s.slice(i, i + 2);
        }
        return pairs;
    };

    let similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    let similarity_den = pairs(s1).length + pairs(s2).length;

    return similarity_num / similarity_den;
}

File.prototype.convertToBase64 = function (callback) {
    let reader = new FileReader();
    reader.onloadend = function (e) {
        console.log(e);
        callback(e.target.result, e.target.error);
    };
    reader.readAsDataURL(this);
};
