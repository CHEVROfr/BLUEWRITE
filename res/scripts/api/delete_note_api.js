var tools_universal = require("../universal/tools_universal")
var delete_note_universal = require("../universal/delete_note_universal")

/*
ERRORS :
- 0000 = invalid auth token
*/

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
                delete_note_universal.deleteNote(req.body.nid).then((responseDelete) => {
                    if(responseDelete["status"] == "sucess") {
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
                            code: responseDelete["code"],
                            err: responseDelete["err"]
                        }
                        res.send(jsonRes)
                    }
                })
            }
        }).catch((err) => {
            jsonRes = {
                status: "error",
                code: "0000",
                err: "deleteApiPost : " + err
            }
            res.send(jsonRes)
        })
    })
}