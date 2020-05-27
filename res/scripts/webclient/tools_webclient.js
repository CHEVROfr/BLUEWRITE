var configs = require("../../configs/configs")
var lang = require('../../scripts/universal/language_universal')
var mime_ext = require('mimetype-extension')
var books_universal = require("../universal/books_universal")

exports.getAppTitleRedirect = (sess) => {
    if(sess.connected != "true") {
        return "/"
    }
    else {
        return "/notes"
    }
}

exports.sendErrors = (errorNum, req, res, redirect="") => {
    switch(errorNum) {
        case "0000":
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.render("error.ejs", {
                appTitleRedirect: this.getAppTitleRedirect(req.session),
                redirect: this.getAppTitleRedirect(req.session),
                redirectText: "RETOUR À L'ACCUEIL",
                errorText: "Unknown Error",
                errorCode: "0000"
            })
            break;
        case "0001":
            res.setHeader("Content-Type", mime_ext.get("html"))
            req.session.lastPage = configs.get("domain") + req.originalUrl
            res.redirect("/login")
            break;
        case "0002":
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.render("error.ejs", {
                appTitleRedirect: this.getAppTitleRedirect(req.session),
                redirect: this.getAppTitleRedirect(req.session),
                redirectText: "RETOUR À L'ACCUEIL",
                errorText: lang.get("note_does_not_exist_or_not_authorized", req.session.lang),
                errorCode: "0002"
            })
            break;
        case "0005":
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.render("error.ejs", {
                appTitleRedirect: this.getAppTitleRedirect(req.session),
                redirect: this.getAppTitleRedirect(req.session),
                redirectText: "RETOUR AUX BOOKS",
                errorText: lang.get("book_does_not_exist_or_not_authorized", req.session.lang),
                errorCode: "0005"
            })
            break;
        case "1415":
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.render("error.ejs", {
                appTitleRedirect: this.getAppTitleRedirect(req.session),
                redirect: this.getAppTitleRedirect(req.session),
                redirectText: "RETOUR À L'ACCUEIL",
                errorText: lang.get("api_inaccessible", req.session.lang),
                errorCode: "1415"
            })
            break;
        case "301":
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.status(301)
            res.redirect(redirect)
            break;
        default:
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.status(404)
            res.render('error.ejs', { 
                appTitleRedirect: this.getAppTitleRedirect(req.session),
                redirect: this.getAppTitleRedirect(req.session),
                redirectText: "RETOUR À L'ACCUEIL",
                errorText: "File Not Found",
                errorCode: "404"
            })
            break;
    }
}

exports.htmlspecialchars = (str) => {
    if (typeof(str) == "string") {
        str = str.replace(/"/g, "&quot;")
        str = str.replace(/'/g, "&#039;")
        str = str.replace(/</g, "&lt;")
        str = str.replace(/>/g, "&gt;")
    }
    return str
}

exports.removeHtmlTags = (res, lenght = "all") => {
    res = res.replace(/<\/p>/g, '\n')
    res = res.replace(/<\/h.>/g, '\n')
    res = res.replace(/<[^>]*>?/g, '')
    res = res.replace(/&nbsp;/g, " ")
    res = res.replace(/&emsp;/g, " ")
    res = res.replace(/&/g, "&amp;")

    if(lenght != "all") {
        res = res.substr(0, lenght)
    }
    return res
}

exports.getBooksDatalist = (bid, sess) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('token', sess.token)

        books_universal.getBooks(sess.uid).then((responseBooks) => {
            if(responseBooks["status"] == "sucess") {
                let html = '<select name="books" id="booksSelector">'
                html += '<option value="">' + lang.get("no_one", sess.lang) + '</option>'
                for(i = 0; i < responseBooks['books'].length; i++) {
                    if(bid == responseBooks['books'][i]["bid"]) {
                        html += '<option selected value="' + responseBooks['books'][i]["bid"] + '">' + responseBooks["books"][i]["name"] + '</option>'
                    }
                    else {
                        html += '<option value="' + responseBooks['books'][i]["bid"] + '">' + responseBooks["books"][i]["name"] + '</option>'
                    }
                }

                html += '</select>'

                resolve(html)
            }
            else {
                reject()
            }
        })
    })
}