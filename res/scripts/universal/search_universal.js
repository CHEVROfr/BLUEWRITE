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

            if(resultSearch.length == 0) { // if no notes, return empty string
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

        /* db.Notes.findOne({nid: nid, uid: uid}, "nid shareWith", (err, resultNote) => {
            let shareWith = {}
            if(err) {
                resolveP({
                    status: "error",
                    code: "0000",
                    err: "deshareNote : " + err
                })
            }
            else if(!resultNote) {
                resolveP({
                    status: "error",
                    code: "0002",
                    err: "The note does not exist or you do not have the right to read it"
                })
            }
            else if(resultNote) {
                shareWith = resultNote.shareWith
                new Promise((resolve, reject) => {
                    tools_universal.getUidOfPseudo(deshareWith).then((responseUid) => {
                        if(responseUid) {
                            resolve(responseUid)
                        }
                        else {
                            tools_universal.getPseudoOfUid(deshareWith).then((responsePseudo) => {
                                if(responsePseudo) {
                                    resolve(deshareWith)
                                }
                                else {
                                    resolveP({
                                        status: "error",
                                        code: "0004",
                                        err: "the user you want to deshare your note with does not exist"
                                    })
                                }
                            }).catch((err) => {
                                resolveP({
                                    status: "error",
                                    code: "0000",
                                    err: "deshareNote : " + err
                                })
                            })
                        }
                    }).catch((err) => {
                        resolveP({
                            status: "error",
                            code: "0000",
                            err: "deshareNote : " + err
                        })
                    })
                }).then((deshareWithUid) =>{
                    for(i = 0; i < shareWith.length; i++) {
                        if ( shareWith[i].uid == deshareWithUid) {
                            shareWith.splice(i, 1); 
                        }
                    }
                    db.Notes.updateOne({nid: nid}, {shareWith: shareWith}, (err, result) => {
                        resolveP({
                            status: "sucess"
                        })
                    })
                }).catch((err) => {
                    resolveP({
                        status: "error",
                        code: "0000",
                        err: "deshareNote : " + err
                    })
                })
            }
        }) */
    })
}