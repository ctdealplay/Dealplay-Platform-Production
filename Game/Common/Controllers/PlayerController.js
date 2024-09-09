var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var moment = require('moment');
var helper = require('../../../Helper/helper');
const mongoose = require('mongoose')
module.exports = {

    logIn: async function(data,socket) {
        try {
            console.log("data",typeof data,data);
            data = JSON.parse(data)
            if(!data.email){
                return {
                    status: 'error',
                    result: null,
                    message: 'Please enter email.',
                    statusCode: 400
                }
            }
            if(!data.password){
                return {
                    status: 'error',
                    result: null,
                    message: 'Please enter password.',
                    statusCode: 400
                }
            }
            let player = await Sys.App.Services.LearnerServices.findSingleLearner({ email: data.email });
           
            // await Sys.Game.Common.Services.PlayerServices.updateCoustomer({uniqueId: data.pin},{freeSpinCount:0,freeSpin:false,bonusValue:false})
            console.log("player",player);

            if( player && bcrypt.compareSync(data.password, player.password)){
                // if(player.login){
                //     return {
                //         status: 'error',
                //         result: null,
                //         message: 'This player is already login!',
                //         statusCode: 400
                //     }
                // }
                // await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ uniqueId: data.pin },{socketId:socket.id,login:true})
                let game = await Sys.App.Services.ModuleServices.findModule({learnerId:player._id})
                console.log("game",game);
                
let gameData = {FeaturedModules:[],ActionModules:[],StoredModules:[],AllModules:[]}
                for(let gameCount=0 ;gameCount<game.length;gameCount++){
                    console.log("gameCount",game[gameCount]);
                    
                    if(game[gameCount].tag == "featured"){
                        gameData.FeaturedModules.push({
                            ModuleName: game[gameCount].title,
                            BundleUrl:game[gameCount].buildUrl,
                            ImageUrl:game[gameCount].image
                        })
                    } if(game[gameCount].tag == "action"){
                        gameData.ActionModules.push({
                            ModuleName: game[gameCount].title,
                            BundleUrl:game[gameCount].buildUrl,
                            ImageUrl:game[gameCount].image
                        })
                    } if(game[gameCount].tag == "store"){
                        gameData.StoredModules.push({
                            ModuleName: game[gameCount].title,
                            BundleUrl:game[gameCount].buildUrl,
                            ImageUrl:game[gameCount].image
                        })
                    }
                    gameData.AllModules.push({
                        ModuleName: game[gameCount].title,
                        BundleUrl:game[gameCount].buildUrl,
                        ImageUrl:game[gameCount].image
                    })
                }
                console.log("game-------->",game);
                return {
                    status: 'success',
                    result: {
                        ModuleData:gameData,
                        PlayerData:player
                    },
                    message: 'You are logged in successfully',
                    statusCode: 200
                }
            }else{
                return {
                    status: 'error',
                    result: null,
                    message: 'Please enter valid email and password.',
                    statusCode: 400
                }
            }
           
        } catch (e) {
            console.log("Game-->Common-->PlayerController-->pinAuth", e);
        }
    },

}

function myFunction() {
    var x = Math.floor((Math.random() * 100) + 1);
    return x;
}

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}