const { response } = require('express');
var Sys = require('../../../Boot/Sys');

module.exports = function(Socket) {

    // **********  Dubai slot intigraction start *************

    
    Socket.on("logIn", async function(data,response) {
        response(await Sys.Game.Common.Controllers.PlayerController.logIn(data,Socket));
    });
   
    
    // **********  Dubai slot intigraction End *************
}