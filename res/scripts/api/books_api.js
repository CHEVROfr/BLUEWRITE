var tools_universal = require("../universal/tools_universal")
var books_universal = require("../universal/books_universal")
/*
ERRORS :
- 0000 = invalid auth token
*/
exports.post = (req, res) => {
    /*
        Return a Promise which resolves a list of books for the user whose token is being passed
        Return an object:

        Same as bookss_universal.js - getBooks()
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
            books_universal.getBooks(responseCheck["uid"]).then((responseNotes) => {
                if(responseNotes["status"] == "sucess") {
                    // Sucess
                    jsonRes = {
                        status: "sucess",
                        books: responseNotes["books"]
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