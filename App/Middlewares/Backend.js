var Sys = require('../../Boot/Sys');
var url  = require('url');
module.exports = {
    loginCheck: function(req, res, next) {
        if (req.session.login) {
           
            return res.redirect('/userManagement');
        } else {
            next();
        }
    },
    Authenticate: async function(req, res, next) {
        console.log("req.session.login",req.session.login);
        if (req.session.login) {

            if (!req.session.details) {
                req.session.details = {};
            }
            next();
           
        } else {
            if (!req.session.details) {
                req.session.details = {};
            }
            res.redirect('/');
        }
        // next();
    },
    HasRole: function(...allowed) {
        const isAllowed = role => allowed.indexOf(role) > -1;
        return function(req, res, next) {
            console.log("isAllowed",typeof isAllowed(req.session.details.role));
            console.log("role",req.session.details.role);
            if (!isAllowed(req.session.details.role)) {
                console.log("if codition");
                req.flash('error', 'You are Not allowed to access that page.');
                return res.redirect('/');
            } else{ 
                console.log("else condition");
                next()};
        }
    },
}