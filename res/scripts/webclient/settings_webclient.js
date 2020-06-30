var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var prototypes_webclient = require("../webclient/prototypes_webclient")
var note_universal = require("../universal/note_universal")
var edit_universal = require("../universal/edit_universal")
var configs = require("../../configs/configs")
var lang = require('../universal/language_universal')
var markdown_webclient = require("../webclient/markdown_webclient")

exports.get = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            res.render('settings.ejs', {
                pageName: lang.get("settings", req.session.lang), 
                pseudo: req.session.pseudo, 
                logoutString: lang.get("sign_out", req.session.lang)
            })
        }).catch((err) => {
            // Invalid Token
            tools_webclient.sendErrors("0001", req, res)
        })
    })
}