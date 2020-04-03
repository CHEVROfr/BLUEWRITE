var tools_universal = require("../universal/tools_universal")
var share_universal = require("../universal/share_universal")

exports.postShare = (req, res) => {
    /*
        Return a Promise which resolves a list of notes for the user whose token is being passed
        Return an object:

        Same as share_universal.js - shareNote()
        On error:
            Invalid token:
                {
                    status: "error",
                    code: "0001",
                    err: "Invalid token"
                }
    */
    return new Promise((resolveP, reject) => {
        let jsonRes = {}

        tools_universal.checkUserToken(req.body.token).then((responseCheck) => {
            if(responseCheck["status"] == "error") {
                if(responseCheck["code"] == "0001") {
                    // Invalid Token
                    jsonRes = {
                        status: "error",
                        code: "0001",
                        err: responseCheck["err"]
                    }
                    res.send(jsonRes)
                }
                else {
                    // Unknown Error
                    jsonRes = {
                        status: "error",
                        code: "0000",
                        err: responseCheck["err"]
                    }
                    res.send(jsonRes)
                }
            }
            else {
                share_universal.shareNote(responseCheck["uid"], req.body.nid, req.body.shareWith, req.body.canEdit).then((responseShare) => {
                    if(responseShare["status"] == "sucess") {
                        // Sucess
                        jsonRes = {
                            status: "sucess",
                            canEdit: responseShare["canEdit"],
                            alreadyAdded: responseShare["alreadyAdded"],
                            uid: responseShare["uid"]
                        }
                        res.send(jsonRes)
                    }
                    else {
                        // Unknown Error
                        jsonRes = {
                            status: "error",
                            code: responseShare["code"],
                            err: responseShare["err"]
                        }
                        res.send(jsonRes)
                    }
                })
            }
        }).catch((err) => {
            jsonRes = {
                status: "error",
                code: "0000",
                err: "shareApiPost : " + err
            }
            res.send(jsonRes)
        })
    })
}

exports.postDeshare = (req, res) => {
    /*
        Return a Promise which resolves a list of notes for the user whose token is being passed
        Return an object:

        Same as share_universal.js - deshareNote()
        On error:
            Invalid token:
                {
                    status: "error",
                    code: "0001",
                    err: "Invalid token"
                }
    */
    return new Promise((resolveP, reject) => {
        let jsonRes = {}

        tools_universal.checkUserToken(req.body.token).then((responseCheck) => {
            if(responseCheck["status"] == "error") {
                if(responseCheck["code"] == "0001") {
                    // Invalid Token
                    jsonRes = {
                        status: "error",
                        code: "0001",
                        err: responseCheck["err"]
                    }
                    res.send(jsonRes)
                }
                else {
                    // Unknown Error
                    jsonRes = {
                        status: "error",
                        code: "0000",
                        err: responseCheck["err"]
                    }
                    res.send(jsonRes)
                }
            }
            else {
                share_universal.deshareNote(responseCheck["uid"], req.body.nid, req.body.deshareWith).then((responseShare) => {
                    if(responseShare["status"] == "sucess") {
                        // Sucess
                        jsonRes = {
                            status: "sucess"
                        }
                        res.send(jsonRes)
                    }
                    else {
                        // Unknown Error
                        jsonRes = {
                            status: "error",
                            code: responseShare["code"],
                            err: responseShare["err"]
                        }
                        res.send(jsonRes)
                    }
                })
            }
        }).catch((err) => {
            jsonRes = {
                status: "error",
                code: "0000",
                err: "shareApiPost : " + err
            }
            res.send(jsonRes)
        })
    })
}