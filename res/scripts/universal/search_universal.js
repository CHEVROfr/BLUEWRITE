var prototypes_universal = require("../universal/prototypes_universal")
var tools_universal = require("../universal/tools_universal")
var db = require('../../configs/db')

exports.search = (uid, query) => {
    return new Promise((resolveP, rejectP) => {
        db.Notes.find({
            $or: [ // search for notes where current user is in uid, or in shareWith list
                {uid: uid}, 
                {"shareWith.uid": uid}
            ],
            $text: {$search: query}}, {score: {$meta: "textScore"}
            }).sort({score: {$meta: "textScore"}}).exec((err, resultSearch) => {
            
            if(err) {
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "deshareNote : " + err
                })
            }

            if(!resultSearch || resultSearch.length == 0) { // if no notes, return empty string
                resolveP({
                    status: "sucess",
                    notes: ""
                })
            }
            else { // else, return the notes
                let promises = []
                var notes = []

                for(i = 0; i < resultSearch.length; i++) {
                    promises.push(new Promise((resolve, reject) => {
                        let datas = resultSearch[i]
                        var note = new prototypes_universal.Note(nid = datas['nid'],
                            uid = datas['uid'],
                            bookId = datas["book"],
                            title = datas['title'],
                            text = datas['text'],
                            creationDate = datas["creationDate"],
                            lastUpdateDate = datas["lastUpdateDate"],
                            shareWith = datas["shareWith"]
                        )
                        note.set().then(() => {
                            resolve(note.getForListObject())
                        })
                    }))
                }
                
                Promise.all(promises).then((responses) => {
                    responses.map(response => notes.push(response))
                }).then(() => {
                    notes.sort((a,b) => {
                        aDateDatas = tools_universal.getUnformatDate(a['lastUpdateDate'])
                        aDate = new Date(aDateDatas.year, aDateDatas.month, aDateDatas.day, aDateDatas.hour, aDateDatas.minutes, aDateDatas.seconds, aDateDatas.milliseconds)

                        bDateDatas = tools_universal.getUnformatDate(b["lastUpdateDate"])
                        bDate = new Date(bDateDatas.year, bDateDatas.month, bDateDatas.day, bDateDatas.hour, bDateDatas.minutes, bDateDatas.seconds, bDateDatas.milliseconds)

                        return bDate - aDate
                    })

                    resolveP({
                        status: "sucess",
                        notes: notes
                    })
                })
            }
        })
    })
}