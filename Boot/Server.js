'use strict';

var express = require('express');
var	http = require('http');
var fs = require('fs');
var join = require('path').join;
var path      = require("path");
var mongoose = require( 'mongoose' );
var nunjucks = require('nunjucks')
const session =  require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var passport = require('passport');
var cookieSession = require('cookie-session');
var jwt = require('jsonwebtoken');
var FCM = require('fcm-node');
// var cookieSession = require('cookie-session');

var LocalStrategy = require('passport-local').Strategy;



//var routes = join(__dirname, '../routes');

var winston = require('winston'); // Logger
require('winston-daily-rotate-file'); // Sys Logger  Daily

var Sys  = new require('../Boot/Sys');



var fileStoreOptions = {};
Sys.App = express();
// Session
Sys.App.use(session({
	// store: new FileStore({}),
    secret: 'maulik maniar', // Use a strong secret key for security
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));
console.log("session",session);
console.log("fileStoreOptions",fileStoreOptions);

// Sys.App.use(cookieSession({
//   name: 'session',
//   keys: ["golfcookie"],
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

// Passport
Sys.App.use(passport.initialize());
Sys.App.use(passport.session());

Sys.App.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');
  next();
});

// Body Parser

Sys.App.use(fileUpload());

// for parsing application/json
Sys.App.use(bodyParser.json());

// for parsing application/xwww-
Sys.App.use(bodyParser.urlencoded());
// Sys.App.use(bodyParser.urlencoded({ extended: true }));

// Flash  for Error & Message
Sys.App.use(flash());

// Set Views
nunjucks.configure('./App/Views', {
    autoescape: true,
    express: Sys.App,
    watch: false,
});
Sys.App.set('view engine', 'html');
Sys.App.use(express.static('./public'));
Sys.App.use('/node_modules', express.static('./node_modules'));
Sys.Server = require('http').Server(Sys.App);



var https_options = {
   key: fs.readFileSync('public/SSL/cert.pem'),
   cert: fs.readFileSync('public/SSL/fullchain.pem')
};


// var https_options = {
//
//  key: fs.readFileSync("public/SSL/dsn.key"),
//
//  cert: fs.readFileSync("public/SSL/dsn.aistechnolabs.in.crt"),
//
//  ca: [
//
//          // fs.readFileSync('SSL/to/CA_root.crt'),
//
//          fs.readFileSync('public/SSL/ca_bundle.crt')
//
//       ]
// };


//Sys.Server = require('http').Server(https_options, Sys.App);




Sys.fcm = FCM;

// middleware to use session data in all routes
Sys.App.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});


Sys.Config = new Array();
fs.readdirSync(join(__dirname, '../Config'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
  	Sys.Config[file.split('.')[0]] = require(join(join(__dirname, '../Config'), file))
});



Sys.Helper = new Array();
fs.readdirSync(join(__dirname, '../Helper'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
  	Sys.Helper[file.split('.')[0]] = require(join(join(__dirname, '../Helper'), file))
});

//  console.log("Helper.",Sys.Helper.Poker.numFormater(1000330000));


// Logger Load
const myCustomLevels = {
  levels: {
    trace: 9,
			input: 8,
			verbose: 7,
			prompt: 6,
			debug: 5,
			info: 4,
			data: 3,
			help: 2,
			warn: 1,
			error: 0
  },
  colors: {
    trace: 'magenta',
			input: 'grey',
			verbose: 'cyan',
			prompt: 'grey',
			debug: 'blue',
			info: 'green',
			data: 'grey',
			help: 'cyan',
			warn: 'yellow',
			error: 'red'
  }
};

Sys.Log = winston.createLogger({

  format: winston.format.json(),
  levels: myCustomLevels.levels ,
  prettyPrint: function ( object ){
	return JSON.stringify(object);
  },
  transports: [
    new (winston.transports.DailyRotateFile)({
	   filename: path.join(Sys.Config.App.logger.logFolder, '/'+ Sys.Config.App.logger.logFilePrefix +'-%DATE%.log'),
	   datePattern: 'DD-MM-YYYY', // YYYY-MM-DD-HH
	   zippedArchive: true,
	   maxSize: '20m',
	   maxFiles: '14d'
 	})
  ]
});


if (process.env.NODE_ENV !== 'production') {
  Sys.Log.add(new winston.transports.Console({
			level: 'debug',
			timestamp: true,

			format: winston.format.combine(
				winston.format.colorize(),
             	winston.format.simple(),
             	winston.format.timestamp(),
				winston.format.printf((info) => {
				   const {
				        timestamp, level, message, ...args
				   } = info;

				      const ts = timestamp.slice(0, 19).replace('T', ' ');
				      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
				})
            ),
	}));
}

Sys.Log.info('Initializing Server...');


fs.readdirSync(path.join(__dirname, '../','./App'))
.filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
})
.forEach(function(dir) {
	if(dir != 'Views' && dir != 'Routes'){ // Ignore Load Views & Routes in Sys Object
		Sys.App[dir] = {};
		Sys.Log.info('Loading... App '+dir);
		fs
		.readdirSync(path.join(__dirname,  '../', './App', dir))
		.filter(function(file) {
			return (file.indexOf(".") !== 0);
		})
		.forEach(function(file) {
			Sys.App[dir][file.split('.')[0]] = require(path.join(__dirname,  '../', './App', dir, file));
		});
	}

});


Sys.Log.info('Loading... Game Server.');
Sys.Game = {};


let insidePath = null;
fs.readdirSync(path.join(__dirname, '../','./Game'))
.filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
}).forEach(function(dir) {
		Sys.Game[dir] = {};
		//Sys.Log.info('Loading... Game '+dir);
		fs.readdirSync(path.join(__dirname,  '../', './Game', dir)).filter(function(file) {
			return (file.indexOf(".") !== 0);
		}).forEach(function(subDir) {

				//Sys.Log.info('Loading... Game Sub Directory :'+subDir);
				insidePath = dir+'/'+subDir;
				if (fs.existsSync(path.join(__dirname,  '../', './Game', insidePath))) {
					if(fs.lstatSync(path.join(__dirname,  '../', './Game', insidePath)).isFile()){
						//Sys.Log.info('Loading... File :'+subDir);
						 Sys.Game[dir][subDir.split('.')[0]] = require(path.join(__dirname,  '../', './Game', dir, subDir)); // Add File in Sub Folder Object
					}else{
						Sys.Game[dir][subDir] = {};
						//Sys.Log.info('Loading... Game Sub Directory Folder:'+insidePath);

						fs.readdirSync(path.join(__dirname,  '../', './Game', insidePath)).filter(function(file) {
							return (file.indexOf(".") !== 0);
						}).forEach(function(subInnerDir) {
							insidePath = dir+'/'+subDir+'/'+subInnerDir;
							//Sys.Log.info('Loading... Game Sub  Inner Directory :'+subInnerDir);
							if(fs.lstatSync(path.join(__dirname,  '../', './Game', insidePath)).isFile()){
								//Sys.Log.info('Loading... Sub  File :'+subInnerDir);
								 Sys.Game[dir][subDir][subInnerDir.split('.')[0]] = require(path.join(__dirname,  '../', './Game', dir+'/'+subDir, subInnerDir)); // Add File in Sub Folder Object
							}else{
								Sys.Game[dir][subDir][subInnerDir] = {};
								//Sys.Log.info('Loading... Game Sub Inner Directory Folder:'+insidePath);

								fs.readdirSync(path.join(__dirname,  '../', './Game', insidePath)).filter(function(file) {
									return (file.indexOf(".") !== 0);
								}).forEach(function(subInnerLastDir) {
									insidePath = dir+'/'+subDir+'/'+subInnerDir+'/'+subInnerLastDir;
									//Sys.Log.info('Loading... Game Sub  Inner Directory :'+insidePath);
									if(fs.lstatSync(path.join(__dirname,  '../', './Game', insidePath)).isFile()){
									//	Sys.Log.info('Loading... Sub Last  File :'+subInnerLastDir);
										Sys.Game[dir][subDir][subInnerDir][subInnerLastDir.split('.')[0]] = require(path.join(__dirname,  '../', './Game', dir+'/'+subDir+'/'+subInnerDir, subInnerLastDir)); // Add File in Sub Folder Object
									}else{
									//	Sys.Log.info('Loading... Sub Last  Folder Plase Change Your Code:'+subInnerLastDir);
									}

								});
							}
						});

					}

				}

		});

});


Sys.Log.info('Loading... Router');
// Load Router
fs.readdirSync(join(__dirname, '../App/Routes'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
	Sys.App.use('/', require(join(join(__dirname, '../App/Routes'), file))); // Register Router to app.use
});


Sys.Log.info('Initializing Variables');
Sys.Rooms = [];
Sys.Tournaments = [];
Sys.Timers = [];

Sys.Log.info('Loading... DB Connection');
// Mongodb Connection

var dbURI = '';
if(Sys.Config.Database.connectionType == 'local'){
  dbURI = 'mongodb://'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+':'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.port+'/'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.database;

}else{
  dbURI = 'mongodb://'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.user+':'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.password+'@'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+':'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.port+'/'+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.database;

}


mongoose.connect(dbURI,Sys.Config.Database.option);

// CONNECTION EVENTS
// When successfully connected
// const customerModel = mongoose.model('customer');
mongoose.connection.on('connected', async function () {
	// await customerModel.updateMany({},{socketId:"",login:false})
	// await customerModel.update({_id:mongoose.Types.ObjectId("66a34bc955facb761f9d98e5")},{freeSpinCount:0,freeSpinBonus:0,freeSpin:false,bonusValue:false,totalBet:0,totalWin:0})
	Sys.Namespace = [];
	Sys.Log.info('Mongoose default connection open to ' + dbURI);
	Sys.Log.info('Loading... Setting');
	// Sys.Setting = await Sys.App.Services.SettingsServices.getSettingsData({});
console.log("connected");
	Sys.Io = require('socket.io')(Sys.Server,{'pingTimeout' :Sys.Config.Socket.pingTimeout,'pingInterval' : Sys.Config.Socket.pingInterval});
	 Sys.Log.info('Loading... Socket');

	 Sys.Io.on('connection',async function(socket) {

		Sys.Io.emit("test","This is a broadcast")
		
		console.log("connection");
		Sys.Log.info('Some One Connected :'+socket.id);
			Object.keys(Sys.Game.Common.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
				Sys.Game.Common.Sockets[key](socket)
			});
			// Socket for Admin Dashboard Only.
			socket.on('dashboardconnection',async function() {
				// Room for Admin Dashboard only
				 socket.join('memory');
			})
			socket.on('disconnect',async () => {
				console.log('User disconnected with socket id:', socket.id);
				// await customerModel.updateOne({socketId:socket.id},{socketId:"",login:false})
			// Additional cleanup and state updates can be performed here
		});
	 });
	
	
	// Common socket connections
	// Sys.Io.of('/').on('connection', function(socket){
	// 	console.log('Common socket connect');
	// 	Object.keys(Sys.Game.Common.Sockets).forEach(function(key){
	// 	   Sys.Game.Common.Sockets[key](socket)
	//    })
   	// });

// Slot game connections
	Sys.Io.of(Sys.Config.Namespace.Slot).on('connection', function(socket){
		console.log('User Connected To Slot');
		Object.keys(Sys.Game.Slot.Sockets).forEach(function(key){
		   Sys.Game.Slot.Sockets[key](socket)
	   })
   	});


	Sys.Server.listen(Sys.Config.Socket.port,'0.0.0.0',function() {
		Sys.App.use(function(req, res, next) {
			res.render('404.html');
		});


		console.log("(---------------------------------------------------------------)");
		console.log(" |                    Server Started...                        |");
		console.log(" |                  http://"+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+":"+Sys.Config.Socket.port+"                      |");
		console.log("(---------------------------------------------------------------)");

		setInterval(function(){
			const {rss,heapTotal} = process.memoryUsage();
			// Send Broadcast only for Dashboard
			let data = {
				rss : parseInt(rss/1024/1024),
				heap : parseInt(heapTotal/1024/1024),
			}
			  Sys.Io.to('memory').emit('live_memory',data ) //
		 }, 1000);


		//Sys.Log.info('Server Start.... Port :'+Sys.Config.Socket.port);
	});

});

// console.log("validator",Sys.App.Middlewares.Validator.loginPostValidate);
// If the connection throws an error
mongoose.connection.on('error',async function (err) {
  Sys.Log.info('Mongoose default connection error: ' + err);
});
// mongoose.set("debug",true)
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  Sys.Log.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    Sys.Log.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


module.exports = {app: Sys.App, server: Sys.Server};
