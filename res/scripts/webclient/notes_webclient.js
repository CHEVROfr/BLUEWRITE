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

                    books_universal.getBooks(responseCheck["uid"]).then((responseBooks) => {
                        let books_list = ""

                        for(i in responseBooks["books"]) {
                            books_list += '<li class="book_button" book-id="' + responseBooks["books"][i]["bid"] + '">' + 
                                                '<p>' + responseBooks["books"][i]["name"] + '</p>' +
                                                '<svg class="book_edit" book-id="' + responseBooks["books"][i]["bid"] + '"><use xlink:href="/files/cicons/cicons.svg?v=9#menu_dots"></use></svg>'
                                            '</li>'
                        }
                        
                        if(books_list == "") {
                            books_list = '<ul id="books_buttons_list">' +
                                            '<li class="book_button" book-id="">' + lang.get("my_notes", req.session.lang).toUpperCase() + "</li>" + 
                                        "</ul>" + 
                                        '<p class="no_book">' + lang.get("no_book", req.session.lang) + '</p>'
                        }
                        else {
                            books_list = '<ul id="books_buttons_list">' +
                                '<li class="book_button" book-id=""><p>' + lang.get("my_notes", req.session.lang).toUpperCase() + "</p></li>" + 
                                    books_list + 
                                '<li class="book_button" book-id="0"><p>' + lang.get("other", req.session.lang).toUpperCase() + "</p></li>" + 
                            "</ul>"
                        }

                        res.render("notes.ejs", {
                            appTitleRedirect: tools_webclient.getAppTitleRedirect(req.session),
                            pageTitle: lang.get("my_notes", req.session.lang),
                            content: notes,
                            books_list: books_list,
                            token: req.session.auth_token,
                            uid: req.session.uid,
                            apiHost: configs.get("domain"),
                            noOneStr: lang.get("no_one", req.session.lang), 
                            resultsStr: lang.get("results", req.session.lang).toUpperCase(), 
                            deleteOnlyBookStr: lang.get("delete_only_book", req.session.lang), 
                            deleteBookAndNotesStr: lang.get("delete_book_and_notes", req.session.lang),
                            deleteStr: lang.get("delete", req.session.lang),
                            book_panel_title: lang.get("books", req.session.lang).toUpperCase(),
                            textPlaceholderStr: lang.get("start_writing_something_incredible", req.session.lang),
                            titlePlaceholderStr: lang.get("nameless", req.session.lang)
                        })
                    }).catch((err) => {
                        // Unknown Error
                        console.trace(err)
                        tools_webclient.sendErrors("0000", req, res)
                    })                    
                }
                else {
                    // Unknown Error
                    console.trace(responseNotes["err"])
                    tools_webclient.sendErrors("0000", req, res)
                }
            }).catch((err) => {
                // Unknown Error
                console.trace(err)
                tools_webclient.sendErrors("0000", req, res)
            })
        }).catch((err) => {
            // Invalid Token
            console.trace(err)
            tools_webclient.sendErrors("0001", req, res)
        })
    })
}