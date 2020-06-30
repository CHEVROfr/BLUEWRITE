var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var prototypes_webclient = require("../webclient/prototypes_webclient")
var delete_note_universal = require("../universal/delete_note_universal")
var configs = require("../../configs/configs")
var lang = require('../universal/language_universal')
var markdown_webclient = require("../webclient/markdown_webclient")

exports.get = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            delete_note_universal.deleteNote(req.params.nid).then((responseDelete) => {
                if(responseDelete["status"] == "sucess") {
                    res.redirect("/notes")
                }
                else {
                    // Unknown Error
                    console.error(responseCheck["err"])
                    tools_webclient.sendErrors("0000", req, res)
                }
            }).catch((err) => {
                // Unknown Error
                console.error(responseCheck["err"])
                tools_webclient.sendErrors("0000", req, res)
            })
        }).catch((err) => {
            // Invalid Token
            tools_webclient.sendErrors("0001", req, res)
        })
    })
}