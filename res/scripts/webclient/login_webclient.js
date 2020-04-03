var tools_universal = require("../universal/tools_universal")
var configs = require("../../configs/configs")

exports.checkLogin = (req, res) => {
    return new Promise((resolveP, reject) => {
        if(req.query.t) {
            tools_universal.checkUserToken(req.query.t).then((responseCheck) => {
                if(responseCheck["status"] == "error") {
                    if(responseCheck["code"] == "0001") {
                        // Invalid Token
                        this.sendErrors("0001", req, res)
                    }
                    else {
                        // Unknown Error
                        this.sendErrors("0000", req, res)
                    }
                }
                else {
                    req.session.connected = "true"
                    req.session.uid = responseCheck["uid"]
                    req.session.pseudo = responseCheck["pseudo"]
                    req.session.auth_token = req.query.t
                    req.session.lang = "fr"

                    if(req.session.lastPage) {
                        res.redirect(req.session.lastPage)
                    }
                    else {
                        res.redirect("/notes")
                    }
                }
            }).catch((err) => {
                // Unknown Error
                console.err(err)
                this.sendErrors("0000", req, res)
            })
        }
        else if(req.session.connected != "true") {
            //var fullUrl = configs.get("domain") + req.originalUrl
            var fullUrl = configs.get("domain") + "/login/check"
            res.redirect(configs.get("nameServerDomain") + "/my_token?r=" + fullUrl)
        }
        else {
            res.redirect("/notes")
        }
    })
}

exports.redirectLogin = (req, res) => {
    let url = configs.get("domain") + "/login/check"
    res.redirect(configs.get("nameServerDomain") + "/login?r=" + url)
}