var tools_universal = require("../universal/tools_universal")
var delete_book_universal = require("../universal/delete_book_universal")

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
            delete_book_universal.deleteBook(responseCheck["uid"], req.body.bid, req.body.all).then((responseDelete) => {
                if(responseDelete["status"] == "sucess") {
                    // Sucess
                    jsonRes = {
                        status: "sucess",
                        bid: responseDelete["bid"],
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