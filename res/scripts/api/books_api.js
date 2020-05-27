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
        }
    }).catch((err) => {
        jsonRes = {
            status: "error",
            code: "0000",
            err: "booksApiPost : " + err
        }
        res.send(jsonRes)
    })
})

    return new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('client', "bluewrite")
        params.append('key', configs.get("nameServerApiKey"))
        params.append('token', token)

        fetch(configs.get("nameServerApiHost") + "/check", {method: "post", body: params}).then((responseCheck) => { 
            responseCheck.json().then((responseCheck) => {
                if(responseCheck["status"] == "sucess") {
                    Books.find({uid: responseCheck["uid"]}, "bid uid name", (err, datas) => {
                        if(err) { console.error(err) }
                        let books = []

                        for(i = 0; i < datas.length; i++) {
                            let book = {
                                bid: datas[i]['bid'],
                                uid: datas[i]['uid'],
                                name: datas[i]['name']
                            }

                            books.push(book)
                        }
                
                        var responseP = new Array()
                        responseP["status"] = "sucess"
                        responseP["books"] = books
                        resolve(responseP)
                                
                    })
                }
                else {
                    var responseP = new Array()
                    responseP["status"] = "error"
                    responseP["error"] = "0000"
                    resolve(responseP)
                }
            })
        })
    })
}