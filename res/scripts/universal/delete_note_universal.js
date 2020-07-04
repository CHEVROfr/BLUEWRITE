var tools_universal = require("../universal/tools_universal")
var db = require("../../configs/db")

/*
ERRORS :
- 0000 = invalid auth token
*/

exports.deleteNote = (nid, uid) => {
    return new Promise((resolveP, rejectP) => {
        db.Notes.findOne({nid: nid, uid: uid}, (err, results) => {
            if(err) {
                reject(err)
            }
            else if(!results) {
                resolveP({
                    status: "error",
                    code: "0007"
                })
            }
            else {
                db.Notes.deleteOne({nid: nid}, (err) => {
                    if(err) {
                        console.error('deleteNote : ' + err)
                        resolveP({
                            status: "error",
                            code: "0000",
                            err: "deleteNote : " + err
                        })
                    }
                    else {
                        resolveP({
                            status: "sucess"
                        })
                    }
                })
            }
        })
        
    })
}