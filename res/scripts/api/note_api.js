var tools_universal = require("../universal/tools_universal")
var note_universal = require("../universal/note_universal")

exports.post = (req, res) => {
    /*
        Return a Promise which resolves a list of notes for the user whose token is being passed
        Return an object:

        Same as note_universal.js - getNote()
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
            note_universal.getNote(responseCheck["uid"], req.body.nid).then((responseNote) => {
                if(responseNote["status"] == "sucess") {
                    // Sucess
                    jsonRes = {
                        status: "sucess",
                        note: responseNote["note"],
                    }
                    res.send(jsonRes)
                }
                else {
                    // Unknown Error
                    jsonRes = {
                        status: "error",
                        code: responseNote["code"],
                        err: responseNote["err"]
                    }
                    res.send(jsonRes)
                }
            })
        }).catch((err) => {
            if(err["code"] == "0001") {
                // Invalid Token
                jsonRes = {
                    status: "error",
                    code: "0001",
                    err: err["err"]
                }
                res.send(jsonRes)
            }
            else {
                // Unknown Error
                jsonRes = {
                    status: "error",
                    code: "0000",
                    err: err["err"]
                }
                res.send(jsonRes)
            }
        })
    })
}