var tools_universal = require("../universal/tools_universal")
var search_universal = require("../universal/search_universal")

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
            search_universal.search(responseCheck["uid"], req.body.query).then((responseNotes) => {
                if(responseNotes["status"] == "sucess") {
                    // Sucess
                    jsonRes = {
                        status: "sucess",
                        notes: responseNotes["notes"]
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