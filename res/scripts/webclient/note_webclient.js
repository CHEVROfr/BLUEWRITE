var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var prototypes_webclient = require("../webclient/prototypes_webclient")
var note_universal = require("../universal/note_universal")
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
                        let content = '<h1 id="noteTitle">' + tools_webclient.htmlspecialchars(responseNote["note"]["title"]) + '</h1>'
                        let canEdit = false

                        let bookName = responseNote["note"]["book"]["bName"]
                        if(responseNote["note"]["book"]["bid"] == "0") {
                            bookName = lang.get("no_one", req.session.lang)
                        }
                        content += '<a href="/books?bid=' + responseNote["note"]["book"]["bid"] + '#b_' + responseNote["note"]["book"]["bid"] + '" class="noteBook"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#book"></use></svg><p class="noteBookName">' + bookName + '</p></a>'
                        content += '<div id="little_separator"></div>'
                        
                        content += '<div class="noteText" id="noteText">' + 
                                    //andmrkow.render(responseNote["note"]["text"], {"ugc": true}).html + 
                                    markdown_webclient.converter.makeHtml(responseNote["note"]["text"])
                                    '</div>'
                        
                        if(!responseNote["note"]["isOwner"]) {
                            if(responseNote["note"]["pseudo"] == "") {
                                content = '<p id="ownerString">' + lang.get('note_off', req.session.lang) + " " + lang.get('deleted', req.session.lang) + "</p>" + content
                            }
                            else {
                                content = '<p id="ownerString">' + lang.get('note_off', req.session.lang) + " " + responseNote["note"]["pseudo"] + "</p>" + content
                            }
                        }

                        let shareList = '<p id="noShare">' + lang.get('no_contributors', req.session.lang) + "</p>"

                        if(responseNote.note["shareWith"].length != 0) {
                            shareList = '<p id="noShare" style="display: none;">' + lang.get('no_contributors', req.session.lang) + "</p>"
                            for(i = 0; i < responseNote.note["shareWith"].length; i++) {
                                if((req.session.uid == responseNote.note["shareWith"][i]["uid"] && responseNote.note["shareWith"][i]["canEdit"] == true)|| responseNote["note"]["isOwner"]) {
                                    canEdit = true
                                }
                                shareList += "<div id='" + responseNote.note["shareWith"][i]["uid"] + "' class='shareListElement'>" +
                                '<p class="shareListName">' + responseNote.note["shareWith"][i]["name"] + '</p>'
                                if(responseNote.note["shareWith"][i]["canEdit"]) {
                                    if(responseNote["note"]["isOwner"]) {
                                        shareList += '<button class="shareListCanEdit" canEdit="true" onclick="setCanEdit(this, \'' + responseNote.note["shareWith"][i]["uid"] + '\')"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#edit"></use></svg></button>'
                                    }
                                    else {
                                        shareList += '<button class="shareListCanEdit"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#edit"></use></svg></button>'
                                    }
                                }
                                else {
                                    if(responseNote["note"]["isOwner"]) {
                                        shareList += '<button class="shareListCanEdit" canEdit="false" onclick="setCanEdit(this, \'' + responseNote.note["shareWith"][i]["uid"] + '\')"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#eye"></use></svg></button>'
                                    }
                                    else {
                                        shareList += '<button class="shareListCanEdit"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#eye"></use></svg></button>'
                                    }
                                }
                                shareList += '<div class="separator"></div>'
                                if(responseNote["note"]["isOwner"]) {
                                    shareList += '<button class="shareListRemove" onclick="removeShareWith(this, \'' + responseNote.note["shareWith"][i]["uid"] + '\')"><svg><use xlink:href="/files/cicons/cicons.svg?v=7#trash"></use></svg></button>'
                                }
                                shareList += '</div>' +
                                '<hr id="' + responseNote.note["shareWith"][i]["uid"] + "_hr" + '" class="shareListSeparator"></hr>'
                            }
                        }

                        tools_webclient.getBooksDatalist(responseNote["note"]["book"]["bid"], req.session).then((htmlBooks) => {
                            res.render("note.ejs", {
                                appTitleRedirect: tools_webclient.getAppTitleRedirect(req.session),
                                pageTitle: tools_webclient.htmlspecialchars(responseNote["note"]["title"]),
                                description: tools_webclient.removeHtmlTags(markdown_webclient.converter.makeHtml(responseNote["note"]["text"], 300)),
                                content: content,
                                shareList: shareList, 
                                noteId: req.params.nid, 
                                token: req.session.auth_token, 
                                isOwner: responseNote["note"]["isOwner"], 
                                canEdit: canEdit,
                                apiHost: configs.get("domain"),
                                errorTextCantSave: lang.get("cant_autosave_note", req.session.lang),
                                errorTextWaitWhileSaving: lang.get("please_wait_while_saving_your_note", req.session.lang),
    
                                text: tools_webclient.htmlspecialchars(responseNote["note"]["text"]), 
                                titleHolder: lang.get("nameless", req.session.lang), 
                                textHolder: lang.get("start_writing_something_incredible", req.session.lang),
                                title: responseNote["note"]["title"],
                                error: "",
                                booksInputLabel: lang.get("choose_a_book", req.session.lang),
                                books: htmlBooks, 
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