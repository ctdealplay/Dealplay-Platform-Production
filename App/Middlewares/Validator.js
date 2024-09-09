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

    registerUserPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            status: Joi.string().min(3).max(30).required(),
            // role: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
            commission: Joi.number(),
            mobile: Joi.number(),
            referralCode: Joi.string()
                // image: Joi.required()
        });

        const data = {
            username: 'abcd1234',
            status: 'abc1',
            role: 'Joe',
            email: 'not_a_valid_email_to_show_custom_label',
            password: '123456'
        };

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/addSiteOwner');
        } else {
            next();
        }
    },
    registerSubAdminPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            status: Joi.string().min(3).max(30).required(),
            // role: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
            // commission: Joi.number(),
            mobile: Joi.number().required(),
            referralCode: Joi.string(),
            // image: Joi.string().required()
        });

        const data = {
            username: 'abcd1234',
            status: 'abc1',
            role: 'Joe',
            email: 'not_a_valid_email_to_show_custom_label',
            password: '123456'
        };

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/addSiteOwner');
        } else {
            next();
        }
    },

    editUserPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            status: Joi.string().min(3).max(30).required(),
            // role: Joi.string().min(3).max(30).required(),
            // email: Joi.string().email().required(),
            // password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
            commission: Joi.number(),
            mobile: Joi.number(),
            referralCode: Joi.string(),
            // image: Joi.required()
        });

        const data = {
            username: 'abcd1234',
            status: 'abc1',
            role: 'Joe',
            // email: 'not_a_valid_email_to_show_custom_label',
            password: '123456'
        };

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/user');
        } else {
            next();
        }
    },

    editSubAdminPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            status: Joi.string().min(3).max(30).required(),
            // role: Joi.string().min(3).max(30).required(),
            // email: Joi.string().email().required(),
            // password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
            commission: Joi.number(),
            mobile: Joi.number(),
            referralCode: Joi.string(),
            // image: Joi.required()
        });

        const data = {
            username: 'abcd1234',
            status: 'abc1',
            role: 'Joe',
            // email: 'not_a_valid_email_to_show_custom_label',
            password: '123456'
        };

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/user');
        } else {
            next();
        }
    },
    editGrandMasterPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            status: Joi.string().min(3).max(30).required(),
            // role: Joi.string().min(3).max(30).required(),
            // email: Joi.string().email().required(),
            // password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
            commission: Joi.number(),
            mobile: Joi.number(),
            referralCode: Joi.string(),
            // image: Joi.required()
        });

        const data = {
            username: 'abcd1234',
            status: 'abc1',
            role: 'Joe',
            // email: 'not_a_valid_email_to_show_custom_label',
            password: '123456'
        };

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/user');
        } else {
            next();
        }
    },
    /***

    Player Validation
    ------------------

    ***/

    registerPlayerPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().required(),
            //    mobile: Joi.number().required(),
            chips: Joi.number().required(),
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/addPlayer');
        } else {
            next();
        }
    },


    editPlayerPostValidate: function(req, res, next) {
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().required(),
            // chips: Joi.number().required(),
        });

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/player');
        } else {
            next();
        }
    },


    stacksValidation: function(req, res, next) {

        const rulesSchema = Joi.object({
            minStacks: Joi.string().alphanum().min(1).required(),
            maxStack: Joi.string().alphanum().min(1).required(),
            flag: Joi.string().alphanum().min(1).required(),
        });

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/cashgames/stacks');
        } else {
            next();
        }
    },

    // Setting Validation

    settingsValidation: function(req, res, next) {

        const rulesSchema = Joi.object({
            rakePercenage: Joi.number().required(),
            chips: Joi.number().required(),
            defaultDiamonds: Joi.number().required(),
            rackAmount: Joi.number().required(),
            expireTime: Joi.required(),
            id: Joi
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/settings');
        } else {
            next();
        }
    },


    addSitGoTouValidation: function(req, res, next) {

        const rulesSchema = Joi.object({
            sit_n_go_tur_blind_levels: Joi,
            sit_n_go_tur_1st_payout: Joi,
            sit_n_go_tur_2st_payout: Joi,
            sit_n_go_tur_3st_payout: Joi,
            sit_n_go_tur_breaks_start_time: Joi,
            sit_n_go_tur_breaks: Joi,
            sit_n_go_tur_default_game_play_chips: Joi.number().required(),
            sit_n_go_tur_tex_stacks: Joi,
            sit_n_go_tur_tex_buy_in: Joi.number().required(),
            sit_n_go_tur_tex_entry_fee: Joi.number().required(),
            fee: Joi,
            sit_n_go_tur_omh_stacks: Joi,
            sit_n_go_tur_omh_buy_in: Joi.number().required(),
            sit_n_go_tur_omh_entry_fee: Joi.number().required(),

        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error", ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/regular-tournament/tournament');
        } else {
            next();
        }
    },

    /**
     * Payout Management
     */
    payoutValidation: function(req, res, next) {
        const rulesSchema = Joi.object({
            payoutRatio: Joi.number().required(),
            // jackpotPlan: Joi.number().required(),
            // jackpotWinningAt: Joi.number().required(),
            id: Joi
        });

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            console.log("Error In Payout Setting Validation :", ret.error.toString());
            req.flash('error', ret.error.toString());
            res.redirect('/payout');
        } else {
            next();
        }
    }

}