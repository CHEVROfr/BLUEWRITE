var tools_webclient = require("../webclient/tools_webclient")
var configs = require("../../configs/configs")

exports.get = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            tools_webclient.sendErrors("0000", req, res)
        } else {
            res.redirect(configs.get("nameServerDomain") + "/logout?r=" + configs.get("domain"))
        }
    })
}