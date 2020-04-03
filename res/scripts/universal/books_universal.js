var db = require('../../configs/db')

exports.getBooks = (uid) => {
    /*
        Return a Promise which resolves a list of books for the user whose uid is being passed
        Return an object:

        On sucess: 
            If there are no books:
                {
                    status: "sucess",
                    notes: []
                }

            If there are notes:
                {
                    status: "sucess",
                    books: [
                        {
                            bid: "xxx",
                            uid: "xxx",
                            name: "xxx"
                        }
                    ]
                }

        On error:
            Unknown error:
                {
                    status: "error",
                    code: "0000",
                    err: "error text"
                }
    */
    return new Promise((resolveP, reject) => {
        db.Books.find({uid: uid}, "bid uid name", (err, datas) => {
            if(err) { 
                console.error("getBooks : " + err)
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "getBooks : " + err
                })
            } 

            let books = []

            for(i = 0; i < datas.length; i++) {
                let book = {
                    bid: datas[i]['bid'],
                    uid: datas[i]['uid'],
                    name: datas[i]['name']
                }

                books.push(book)
            }

            resolveP({
                status: "sucess",
                books: books
            })    
        })
    })
}