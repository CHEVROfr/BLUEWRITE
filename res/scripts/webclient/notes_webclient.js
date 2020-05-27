const fetch = require("node-fetch")
const { URLSearchParams } = require('url')

var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var prototypes_webclient = require("../webclient/prototypes_webclient")
var notes_universal = require("../universal/notes_universal")
var configs = require("../../configs/configs")
var lang = require('../universal/language_universal')

exports.get = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            if(responseCheck["status"] == "error") {
                if(responseCheck["code"] == "0001") {
                    // Invalid Token
                    tools_webclient.sendErrors("0001", req, res)
                }
                else {
                    // Unknown Error
                    tools_webclient.sendErrors("0000", req, res)
                }
            }
            else {
                notes_universal.getNotes(responseCheck["uid"]).then((responseNotes) => {
                    if(responseNotes["status"] == "sucess") {
                        let notes = ""

                        if(responseNotes["notes"] == "") {
                            notes = '<p id="noNotes">' + lang.get("no_note", req.session.lang) + "</p>"
                        }
                        else {
                            for(i in responseNotes["notes"]) {
                                let note = new prototypes_webclient.note(responseNotes["notes"][i], req.session)
                                notes += note.getHtmlListDiv(true) 
                            }
                        }

                        res.render("notes.ejs", {
                            appTitleRedirect: tools_webclient.getAppTitleRedirect(req.session),
                            pageTitle: lang.get("my_notes", req.session.lang),
                            content: notes,
                            token: req.session.auth_token,
                            uid: req.session.uid,
                            apiHost: configs.get("domain"),
                            noOneStr: lang.get("no_one", req.session.lang)
                        })
                    }
                    else {
                        // Unknown Error
                        tools_webclient.sendErrors("0000", req, res)
                    }
                }).catch((err) => {
                    // Unknown Error
                    tools_webclient.sendErrors("0000", req, res)
                })
            }
        }).catch((err) => {
            tools_webclient.sendErrors("0000", req, res)
        })
    })
}