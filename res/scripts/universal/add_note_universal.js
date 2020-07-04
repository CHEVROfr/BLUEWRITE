var tools_universal = require("../universal/tools_universal")
var db = require("../../configs/db")
var lang = require("../universal/language_universal")

/*
ERRORS :
- 0000 = invalid auth token
*/

exports.addNote = (uid, title, text, book) => {
    return new Promise((resolveP, rejectP) => {
        db.Books.findOne({bid: book}, "bid uid name", (err, resultBook) => {
            new Promise((resolve, reject) => {
                if(err) {
                    console.error("addNote : " + err)
                    resolveP({
                        status: "error",
                        code: "0000",
                        err: "addNotes : " + err
                    })
                }
    
                if(!resultBook && book != "" && book) {
                    let genId = tools_universal.generateId()
                    var newBook = new db.Books({
                        bid: genId, 
                        uid: uid,
                        name: book
                    })
                    
                    newBook.save((err) => {
                        if(err) {
                            console.error("addNotes : " + err)
                            resolveP({
                                status: "error",
                                code: "0000",
                                err: "addNotes : " + err
                            })
                        } 
    
                        resolve(genId)
                    })
                }
                else {
                    resolve(book)
                }
            }).then((bookId) => {
                let genId = tools_universal.generateId()
                let date = tools_universal.getFormatDate()
        
                var newNote = new db.Notes({
                    nid: genId, 
                    uid: uid,
                    book: bookId,
                    title: title, 
                    text: text,
                    creationDate: date,
                    lastUpdateDate: date
                })
                
                newNote.save((err) => {
                    if(err) {
                        console.error("addNotes : " + err)
                        resolveP({
                            status: "error",
                            code: "0000",
                            err: "addNotes : " + err
                        })
                    } 
        
                    resolveP({
                        status: "sucess",
                        nid: genId,
                    })
                })
            })
        })
    })
}