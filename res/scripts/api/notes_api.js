var tools_universal = require("../universal/tools_universal")
var notes_universal = require("../universal/notes_universal")

exports.post = (req, res) => {
    /*
        Return a Promise which resolves a list of notes for the user whose token is being passed
        Return an object:

        Same as notes_universal.js - getNotes()
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
                notes_universal.getNotes(responseCheck["uid"]).then((responseNotes) => {
                    if(responseNotes["status"] == "sucess") {
                        // Sucess
                        jsonRes = {
                            status: "sucess",
                            notes: responseNotes["notes"],
                            date: responseNotes["date"]
                        }
                        res.send(jsonRes)
                    }
                    else {
                        // Unknown Error
                        jsonRes = {
                            status: "error",
                            code: "0000",
                            err: responseNotes["err"]
                        }
                        res.send(jsonRes)
                    }
                })
            }
        }).catch((err) => {
            jsonRes = {
                status: "error",
                code: "0000",
                err: "notesApiPost : " + err
            }
            res.send(jsonRes)
        })
    })
}