var tools_universal = require("../universal/tools_universal")
var db = require("../../configs/db")

exports.deleteBook = (uid, bid, delNotes) => {
    return new Promise((resolveP, rejectP) => {
        db.Books.deleteOne({bid: bid, uid: uid}, (err) => {
            if(err) {
                console.error("deleteBook : " + err)
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "deleteBook : " + err
                })
            }
            else {
                if(delNotes == "true") {
                    db.Notes.deleteMany({book: bid}, (err) => {
                        if(err) {
                            console.error("deleteBook : " + err)
                            resolveP({
                                status: "error",
                                code: "0000",
                                err: "deleteBook : " + err
                            })
                        }
                        else {
                            resolveP({
                                status: "sucess"
                            })
                        }
                    })
                }
                else {
                    db.Notes.updateMany({book: bid}, {$set: {book: "0"}}, (err) => {
                        if(err) {
                            console.error("deleteBook : " + err)
                            resolveP({
                                status: "error",
                                code: "0000",
                                err: "deleteBook : " + err
                            })
                        }
                        else {
                            resolveP({
                                status: "sucess"
                            })
                        }
                    })
                }
            }
        })
    })
}