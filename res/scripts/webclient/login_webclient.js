var tools_universal = require("../universal/tools_universal")
var tools_webclient = require("../webclient/tools_webclient")
var configs = require("../../configs/configs")

exports.get = (req, res) => {
    return new Promise((resolve, reject) => {
        if(req.query.t) {
            tools_universal.checkUserToken(req.query.t).then((responseCheck) => {
                req.session.auth_token = req.query.t    
                req.session.save(function(err) {
                    if(err) { console.error(err) }

                    req.session.connected = "true"
                    req.session.uid = responseCheck["uid"]
                    req.session.pseudo = responseCheck["pseudo"]
                    req.session.lang = "fr"

                    if(req.query.r) {
                        res.redirect(req.query.r)
                    }
                    else if(req.session.r) {
                        let redirect = req.session.r
                        req.session.r = ''
                        req.session.save(function(err) {
                            res.redirect(redirect)
                        })
                    }
                    else {
                        res.redirect("/")
                    }
                })
            }).catch((err) => {
                if(req.query.r) {
                    req.session.r = req.query.r
                }
                req.session.save(function(err) {
                    res.redirect(configs.get("nameServerDomain") + "/profile/token?r=" + configs.get("domain") + "/login")
                })
            })
        }
        else {
            tools_universal.checkUserToken(req.session.auth_token).then((responseCheck) => {
                req.session.connected = "true"
                req.session.uid = responseCheck["uid"]
                req.session.pseudo = responseCheck["pseudo"]
                req.session.lang = "fr"

                if(req.query.r) {
                    res.redirect(req.query.r)
                }
                else if(req.session.r) {
                    let redirect = req.session.r
                    req.session.r = ''
                    req.session.save(function(err) {
                        res.redirect(redirect)
                    })
                }
                else {
                    res.redirect("/")
                }
            }).catch((err) => {
                if(req.query.r) {
                    req.session.r = req.query.r
                }
                req.session.save(function(err) {
                    res.redirect(configs.get("nameServerDomain") + "/profile/token?r=" + configs.get("domain") + "/login")
                })
            })
        }
    })
}