var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var prototypes_webclient = require("../webclient/prototypes_webclient")
var add_note_universal = require("../universal/add_note_universal")
var configs = require("../../configs/configs")
var lang = require('../universal/language_universal')
var markdown_webclient = require("../webclient/markdown_webclient")

exports.get = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            add_note_universal.addNote(
                responseCheck["uid"], 
                lang.get("nameless", req.session.lang), 
                lang.get("start_writing_something_incredible", 
                req.session.lang), 
                ""
            ).then((responseAdd) => {
                res.redirect("/note/" + responseAdd["nid"] + "#edit")
            }).catch((err) => {
                console.error(err)
                tools_webclient.sendErrors("0000", req, res)
            })
        }).catch((err) => {
            // Invalid Token
            tools_webclient.sendErrors("0001", req, res)
        })
    })
}

exports.post = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            add_note_universal.addNote(responseCheck["uid"], req.body.title, req.body.text, req.body.books).then((responseAdd) => {
                if(responseAdd["status"] == "sucess") {
                    res.redirect("/note/" + responseAdd['nid'])
                }
                else {
                    if(responseAdd["code"] == "0002") {
                        tools_webclient.sendErrors("0002", req, res)
                    }
                    else if(responseAdd["code"] == "0006") {
                        res.redirect("/notes")
                    }
                    else {
                        // Unknown Error
                        console.error(responseAdd["err"])
                        tools_webclient.sendErrors("0000", req, res)
                    }
                }
            }).catch((err) => {
                // Unknown Error
                console.error(err)
                tools_webclient.sendErrors("0000", req, res)
            })
        }).catch((err) => {
            // Invalid Token
            tools_webclient.sendErrors("0001", req, res)
        })
    })
}