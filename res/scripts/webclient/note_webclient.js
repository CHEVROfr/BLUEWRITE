var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var note_universal = require("../universal/note_universal")
var configs = require("../../configs/configs")
var lang = require('../universal/language_universal')
var markdown_webclient = require("../webclient/markdown_webclient")
var ejs = require("ejs")
var puppeteer = require('puppeteer')
var mime_ext = require('mimetype-extension')

exports.get = (req, res, format) => {
    return new Promise((resolveP, rejectP) => {
        tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
            note_universal.getNote(responseCheck["uid"], req.params.nid).then((responseNote) => {
                if(responseNote["status"] == "sucess") {
                    if(req.params.format && (req.params.format == "md" || req.params.format == "markdown")) {

                        let markdownContent = "# " + responseNote["note"]["title"] + "\n\n" + responseNote["note"]["text"]

                        let mdBuffer = Buffer.from(markdownContent, "utf-8")

                        res.setHeader("Content-Type", mime_ext.get("md"))
                        res.setHeader('Content-Disposition', 'attachment; filename=' + tools_universal.slugify(responseNote["note"]["title"]) + '.md')
                        res.send(mdBuffer)
                    }
                    else {
                        let ciconsUrl = "/files/cicons/cicons.svg"
                        if(req.params.format) {
                            ciconsUrl = req.protocol + "://" + req.headers.host + "/files/cicons/cicons.svg"
                        }

                        let content = '<h1 id="noteTitle">' + tools_webclient.htmlspecialchars(responseNote["note"]["title"]) + '</h1>'
                        let canEdit = false

                        let bookName = responseNote["note"]["book"]["bName"]
                        if(responseNote["note"]["book"]["bid"] == "0") {
                            bookName = lang.get("no_one", req.session.lang)
                        }
                        content += '<a href="/books?bid=' + responseNote["note"]["book"]["bid"] + '#b_' + responseNote["note"]["book"]["bid"] + '" class="noteBook"><svg><use xlink:href="' + ciconsUrl + '#book"></use></svg><p class="noteBookName">' + bookName + '</p></a>'
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
                                        shareList += '<button class="shareListCanEdit" canEdit="true" onclick="setCanEdit(this, \'' + responseNote.note["shareWith"][i]["uid"] + '\')"><svg><use xlink:href="' + ciconsUrl + '#edit"></use></svg></button>'
                                    }
                                    else {
                                        shareList += '<button class="shareListCanEdit"><svg><use xlink:href="' + ciconsUrl + '#edit"></use></svg></button>'
                                    }
                                }
                                else {
                                    if(responseNote["note"]["isOwner"]) {
                                        shareList += '<button class="shareListCanEdit" canEdit="false" onclick="setCanEdit(this, \'' + responseNote.note["shareWith"][i]["uid"] + '\')"><svg><use xlink:href="' + ciconsUrl + '#eye"></use></svg></button>'
                                    }
                                    else {
                                        shareList += '<button class="shareListCanEdit"><svg><use xlink:href="' + ciconsUrl + '#eye"></use></svg></button>'
                                    }
                                }
                                shareList += '<div class="separator"></div>'
                                if(responseNote["note"]["isOwner"]) {
                                    shareList += '<button class="shareListRemove" onclick="removeShareWith(this, \'' + responseNote.note["shareWith"][i]["uid"] + '\')"><svg><use xlink:href="' + ciconsUrl + '#trash"></use></svg></button>'
                                }
                                shareList += '</div>' +
                                '<hr id="' + responseNote.note["shareWith"][i]["uid"] + "_hr" + '" class="shareListSeparator"></hr>'
                            }
                        }

                        tools_webclient.getBooksDatalist(responseNote["note"]["book"]["bid"], req.session).then((htmlBooks) => {
                            let ejsOptions = {
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
                                charsStr: lang.get("chars", req.session.lang),
                                wordsStr: lang.get("words", req.session.lang)
                            }

                            if(req.params.format && req.params.format == "pdf") {
                                ejsOptions["stylesheets"] = '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/general.css?v=10" />' +
                                                            '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/markdown.css?v=10" />' +
                                                            '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/note.css?v=10" />' +
                                                            '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/katex.min.css?v=10">'
                                if(req.query.theme && req.query.theme == "dark") {
                                    ejsOptions["stylesheets"] += '<link rel="stylesheet" media="print" href="' + req.protocol + "://" + req.headers.host + '/files/css/note-dark-print.css?v=10" />'
                                    // for no white space in bottom
                                    //ejsOptions["content"] += '<div style="height: 90vh; width: 100%; background: #0d0d0d; -webkit-print-color-adjust: exact;"></div>'
                                }
                                else {
                                    ejsOptions["stylesheets"] += '<link rel="stylesheet" media="print" href="' + req.protocol + "://" + req.headers.host + '/files/css/note-light-print.css?v=10" />'
                                }

                                ejsOptions["jsFiles"] = ""
                                ejsOptions["ciconsUrl"] = ciconsUrl

                                ejs.renderFile("./views/note.ejs", ejsOptions, (err, data) => {
                                    if (err) {
                                        // Unknown Error
                                        console.error(err)
                                        tools_webclient.sendErrors("0000", req, res)
                                    } else {
                                        let headerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #fff; -webkit-print-color-adjust: exact; margin: 0;"></div>'
                                        let footerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #fff; -webkit-print-color-adjust: exact; margin: 0;"></div>'

                                        if(req.query.theme && req.query.theme == "dark") {
                                            headerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #0d0d0d; -webkit-print-color-adjust: exact; margin: 0;"></div>'
                                            footerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #0d0d0d; -webkit-print-color-adjust: exact; margin: 0;"></div>'
                                        }

                                        puppeteer.launch({headless: true, args: ['--no-sandbox']}).then((browser) => {
                                            browser.newPage().then((page) => {
                                                page.setContent(data, {waitUntil: "networkidle2"}).then(() => {
                                                    page.pdf({
                                                        format: "A4",
                                                        margin: {
                                                            top: '1.5cm',
                                                            right: '0',
                                                            left: '0',
                                                            bottom: '1.5cm',
                                                        },
                                                        
                                                        printBackground: true,
                                                        headerTemplate: headerTemplate,
                                                        footerTemplate: footerTemplate,
                                                        displayHeaderFooter: true
                                                    }).then((buffer) => {
                                                        /* fs.writeFile("out.pdf", buffer, (err, result) => {
                                                            if(err) {
                                                                // Unknown Error
                                                                console.error(err)
                                                                tools_webclient.sendErrors("0000", req, res)
                                                            }
                                                            else {
                                                                res.send(data)
                                                            }
                                                        }) */
                                                        res.setHeader("Content-Type", mime_ext.get("pdf"))
                                                        res.setHeader('Content-Disposition', 'attachment; filename=' + tools_universal.slugify(responseNote["note"]["title"]) + '.pdf')
                                                        res.send(buffer)
                                                    }).finally(() => {
                                                        browser.close()
                                                    })
                                                })                                                
                                            }) 
                                        })
                                    }
                                })
                            }
                            else {
                                ejsOptions["stylesheets"] = '<link rel="stylesheet" href="/files/css/codemirror.min.css?v=10" />' +
                                                            '<link rel="stylesheet" href="/files/css/general.css?v=10" />' +
                                                            '<link rel="stylesheet" href="/files/css/markdown.css?v=10" />' +
                                                            '<link rel="stylesheet" href="/files/css/note.css?v=10" />' +
                                                            '<link rel="stylesheet" href="/files/css/toastui-editor.custom.css?v=10" />' +
                                                            '<link rel="stylesheet" href="/files/css/note-light-print.css?v=10" />' +
                                                            '<link rel="stylesheet" href="/files/css/katex.min.css">'
                                ejsOptions["jsFiles"] = '<script src="/files/js/toastui-editor-all.custom.js?v=10"></script>' +
                                                        '<script src="/files/js/fullscreen.js?v=10"></script>' +
                                                        '<script src="/files/js/note_browserify.js?v=10"></script>'
                                ejsOptions["ciconsUrl"] = ciconsUrl
                                res.render("note.ejs", ejsOptions)
                            }
                            
                        }).catch((err) => {
                            // Unknown Error
                            console.error(err)
                            tools_webclient.sendErrors("0000", req, res)
                        })
                    } 
                }
                else {
                    if(responseNote["code"] == "0002") {
                        tools_webclient.sendErrors("0002", req, res)
                    }
                    else {
                        console.error(responseNote)
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