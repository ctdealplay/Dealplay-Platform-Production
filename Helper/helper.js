module.exports = {
    randomString: function(length) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    enc: function(pswd, id) {
        var temp = '';
        // console.log('enc------>>>pswd: ',pswd.length,' id: ',id.length);
        if (pswd) {

            var dt = new Date();

            var k = 0;
            for (let i = 0; i < 3; i++) {
                temp += pswd.substr(k, 8) + id.substr(k, 8);
                k += 8;
            }
            temp += pswd.substr(k, 8);
            temp += dt.getTime();
            temp = temp.toUpperCase();
        }

        return temp;
    },
    sendMail: async function(data) {
        const nodemailer = require("nodemailer");
        var Sys = require('../Boot/Sys');
        try {
            console.log("ys.Config.social_media_login.smtp_user", Sys.Config.social_media_login.smtp_user);
            let transporter = nodemailer.createTransport({
                host: Sys.Config.social_media_login.smtp_host,
                port: Sys.Config.social_media_login.smtp_port,
                secure: true,
                auth: {
                    user: Sys.Config.social_media_login.smtp_user,
                    pass: Sys.Config.social_media_login.smtp_pass
                }
            });

            let info = await transporter.sendMail({
                from: (data.form) ? data.form : Sys.Config.social_media_login.smtp_sender_mail_id,
                to: data.to_email,
                subject: data.subject,
                html: data.message
            });

            return info;
        } catch (error) {
            console.log("Amazon email send error: ", error)
            return false;
        }
    },
    dec: function(txt) {
        var obj = null;
        if (txt && txt.length > 66) {
            var id = '';
            var pswd = '';
            var time = '';

            txt = txt.toLowerCase();
            var k = 0;
            var check = 0;
            for (let i = 0; i < 7; i++) {
                if (check == 1) {
                    id += txt.substr(k, 8);
                    check = 0;
                } else {
                    pswd += txt.substr(k, 10);
                    check = 1;
                }
                k += 8;
            }
            time += txt.substr(k);

            obj = {
                id: id,
                pswd: pswd,
                time: time
            };
        }

        return obj;
    },
    getTimeDiff: function(start, end, type) {
        var diff = end - start;

        if (type == 'day') {
            diff = Math.floor(diff / 1000 / 60 / 60 / 24);
        } else if (type == 'hour') {
            diff = Math.floor(diff / 1000 / 60 / 60);
        } else if (type == 'minute') {
            diff = Math.floor(diff / 1000 / 60);
        } else {
            diff = Math.floor(diff / 1000);
        }
        return diff;
    },
    randomNumber: function(length) {
        var chars = '0123456789';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
}