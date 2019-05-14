/*
 
Cordova BCR Library 0.0.4
Authors: Gaspare Ferraro, Renzo Sala
Contributors: Simone Ponte, Paolo Macco
Filename: bcr.js
Description: demo app

*/

async function init() {
    console.log("init BCR");
    await bcr.initialize();
    console.log("BCR initialized");
}

// app init
$(document).ready(function() {
    init();
});


