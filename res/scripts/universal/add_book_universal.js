var tools_universal = require("../universal/tools_universal")
var db = require("../../configs/db")

exports.addBook = (uid, name) => {
    return new Promise((resolveP, rejectP) => {
        db.Books.findOne({name: name, uid: uid}, "bid uid name", (err, resultBook) => {
            if(err) {
                console.error("addBook : " + err)
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "addBook : " + err
                })
            }

            if(!resultBook) {
                let genId = tools_universal.generateId()
                var newBook = new db.Books({
                    bid: genId, 
                    uid: uid,
                    name: name
                })
                
                newBook.save((err) => {
                    if(err) {
                        resolveP({
                            status: "error",
                            code: "0000",
                            err: "addBook : " + err
                        })
                    } 

                    resolveP({
                        status: "sucess",
                        bid: genId
                    })
                })
            }
            else {
                resolveP({
                    status: "error",
                    code: "0005",
                    err: "a book with this name already exists"
                })
            }
        })
    })
}