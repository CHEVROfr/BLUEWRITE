var db = require("../../configs/db")
var tools_universal = require("../universal/tools_universal")
var lang = require("../universal/language_universal")

/*
ERRORS :
- 0000 = invalid auth token
- 0001 = note don't exist for this user
*/

exports.editNote = (uid, nid, title, text, book) => {
    return new Promise((resolveP, rejectP) => {
        /* if(!title || title == "" || !title.trim()) {
            title = lang.get("nameless")
        }

        if(!text || text == "" || !text.trim()) {
            text = lang.get("start_writing_something_incredible")
        }
 */
        db.Notes.findOne({$and: 
            [
                {nid: nid}, 
                {$or: 
                    [
                        {uid: uid}, 
                        {"shareWith.uid": uid, "shareWith.canEdit": true}
                    ]
                }
            ]
        }, "nid title text lastUpdateDate book", (err, resultNote) => {
            if(err) {
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "editNote : " + err
                })
            }
            else if(!resultNote) {
                resolveP({
                    status: "error",
                    code: "0002",
                    err: "the note does not exist or you do not have the right to read it"
                })
            }
            else if(resultNote) {
                if(!book) {
                    book = resultNote["book"]
                }
                if((resultNote["title"] == title) &&
                    (resultNote["text"] == text) &&
                    (resultNote["book"] == book)) { // don't update if nothing change

                    resolveP({
                        status: "sucess"
                    })
                }
                else {
                    new Promise((resolve, reject) => {
                        db.Books.findOne({bid: book}, "bid uid name", (err, resultBook) => {
                            if(err) {
                                resolveP({
                                    status: "error",
                                    code: "0000",
                                    err: "editNote : " + err
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
                                        console.error("err")
                                        resolveP({
                                            status: "error",
                                            code: "0000",
                                            err: "editNote : " + err
                                        })
                                    }
                
                                    resolve(genId)
                                })
                            }
                            else {
                                resolve(book)
                            }
                        })
                    }).then((book) => {
                        let date = tools_universal.getFormatDate()
                        db.Notes.updateOne({nid: nid}, {$set: {title: title, text: text, lastUpdateDate: date, book: book}}, () => {
                            resolveP({
                                status: "sucess"
                            })
                        })
                    })
                }
            }
        }) 
    })
}