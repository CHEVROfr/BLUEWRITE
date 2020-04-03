const fetch = require("node-fetch")
const { URLSearchParams } = require('url')

var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var prototypes_webclient = require("../webclient/prototypes_webclient")
var notes_universal = require("../universal/notes_universal")
var books_universal = require("../universal/books_universal")
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
                    console.err("checkToken on booksWebClient : " + err)
                    tools_webclient.sendErrors("0000", req, res)
                }
            }
            else {
                notes_universal.getNotes(responseCheck["uid"]).then((responseNotes) => {
                    if(responseNotes["status"] == "sucess") {
                        books_universal.getBooks(responseCheck["uid"]).then((responseBooks) => {
                            if(responseBooks["status"] == "sucess") {
                                if(responseNotes["notes"] == "") {
                                    var response = Array()
                                    response['status'] = "sucess"
                                    response["content"] = '<p id="noNotes">' + lang.get("no_note", sess.lang) + "</p>"
                                    resolveP(response)
                                }
                                else {
                                    booksList = new prototypes_webclient.books({books: responseBooks['books'], notes: responseNotes["notes"]}, req.session)
                                    booksListHtml = booksList.getHtmlListDiv()

                                    res.render("books.ejs", {
                                        appTitleRedirect: tools_webclient.getAppTitleRedirect(req.session),
                                        pageTitle : lang.get("my_books", req.session.lang),
                                        content: booksListHtml
                                    })
                                }
                            }
                            else {
                                // Unknown Error
                                tools_webclient.sendErrors("0000", req, res)
                            }
                        }).catch((err) => {
                            // Unknown Error
                            console.error(err)
                            tools_webclient.sendErrors("0000", req, res)
                        })
                    }
                    else {
                        // Unknown Error
                        tools_webclient.sendErrors("0000", req, res)
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