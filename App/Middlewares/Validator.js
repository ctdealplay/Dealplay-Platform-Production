var validate = require('express-validation');
var Joi = require('joi');
module.exports = {
    loginPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            res.redirect('/');
        } else {
            next();
        }
    },

   

}