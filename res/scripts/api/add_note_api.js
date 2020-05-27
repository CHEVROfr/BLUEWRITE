var tools_universal = require("../universal/tools_universal")
var add_note_universal = require("../universal/add_note_universal")

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
                add_note_universal.addNote(responseCheck["uid"], req.body.title, req.body.text, req.body.book).then((responseAdd) => {
                    if(responseAdd["status"] == "sucess") {
                        // Sucess
                        jsonRes = {
                            status: "sucess",
                            nid: responseAdd["nid"],
                        }
                        res.send(jsonRes)
                    }
                    else {
                        // Unknown Error
                        jsonRes = {
                            status: "error",
                            code: responseAdd["code"],
                            err: responseAdd["err"]
                        }
                        res.send(jsonRes)
                    }
                })
            }
        }).catch((err) => {
            jsonRes = {
                status: "error",
                code: "0000",
                err: "noteApiPost : " + err
            }
            res.send(jsonRes)
        })
    })
}