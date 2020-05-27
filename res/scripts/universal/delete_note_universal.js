var tools_universal = require("../universal/tools_universal")
var db = require("../../configs/db")

/*
ERRORS :
- 0000 = invalid auth token
*/

exports.deleteNote = (nid) => {
    return new Promise((resolveP, rejectP) => {
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
    })
}