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
            if(responseCheck["status"] == "error") {
                if(responseCheck["code"] == "0001") {
                    // Invalid Token
                    tools_webclient.sendErrors("0001", req, res)
                }
                else {
                    // Unknown Error
                    console.error(responseCheck["err"])
                    tools_webclient.sendErrors("0000", req, res)
                }
            }
            else {
                note_universal.getNote(responseCheck["uid"], req.params.nid).then((responseNote) => {
                    if(responseNote["status"] == "sucess") {
                        tools_webclient.getBooksDatalist(responseNote["note"]["book"]["bid"], req.session).then((htmlBooks) => {
                            let title = tools_webclient.htmlspecialchars(responseNote["note"]["title"])

                            res.render("edit.ejs", {
                                postForm: "edit/note",
                                pageTitle : title,
                                description: tools_webclient.removeHtmlTags(
                                    markdown_webclient.converter.makeHtml(responseNote["note"]["text"], 300)
                                ),
                                noteId: req.params.nid, 
                                title: title, 
                                booksInputLabel: lang.get("choose_a_book", req.session.lang),
                                books: htmlBooks, 
                                text: tools_webclient.htmlspecialchars(responseNote["note"]["text"]), 
                                titleHolder: lang.get("nameless", req.session.lang), 
                                textHolder: lang.get("start_writing_something_incredible", req.session.lang), 
                                error: "",
                                caractNum : lang.get("characters", req.session.lang),
                                token: req.session.auth_token, 
                                apiHost: configs.get("domain")
                              })
                        }).catch((err) => {
                            // Unknown Error
                            console.error(err)
                            tools_webclient.sendErrors("0000", req, res)
                        })
                    }
                    else {
                        if(responseNote["code"] == "0002") {
                            tools_webclient.sendErrors("0002", req, res)
                        }
                        else {
                            // Unknown Error
                            console.error(responseNote["err"])
                            tools_webclient.sendErrors("0000", req, res)
                        }
                    }
                }).catch((err) => {
                    // Unknown Error
                    console.error(err)
                    tools_webclient.sendErrors("0000", req, res)
                })
            }
        }).catch((err) => {
            // Unknown Error
            console.error(err)
            tools_webclient.sendErrors("0000", req, res)
        })
    })
}

exports.post = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            if(responseCheck["status"] == "error") {
                if(responseCheck["code"] == "0001") {
                    // Invalid Token
                    tools_webclient.sendErrors("0001", req, res)
                }
                else {
                    // Unknown Error
                    console.error(responseCheck["err"])
                    tools_webclient.sendErrors("0000", req, res)
                }
            }
            else {
                edit_universal.editNote(responseCheck["uid"], req.params.nid, req.body.title, req.body.text, req.body.books).then((responseNote) => {
                    if(responseNote["status"] == "sucess") {
                        res.redirect("/note/" + req.params.nid)
                    }
                    else {
                        if(responseNote["code"] == "0002") {
                            tools_webclient.sendErrors("0002", req, res)
                        }
                        else {
                            // Unknown Error
                            console.error(responseNote["err"])
                            tools_webclient.sendErrors("0000", req, res)
                        }
                    }
                }).catch((err) => {
                    // Unknown Error
                    console.error(err)
                    tools_webclient.sendErrors("0000", req, res)
                })
            }
        }).catch((err) => {
            // Unknown Error
            console.error(err)
            tools_webclient.sendErrors("0000", req, res)
        })
    })
}