var db = require("../../configs/db")
var tools_universal = require("../universal/tools_universal")

/*
ERRORS :
- 0000 = invalid auth token
- 0001 = note don't exist for this user
*/

exports.getNote = (uid, nid) => {
    return new Promise((resolveP, rejectP) => {
        new Promise((resolve, reject) => {
            db.Notes.findOne({$and: 
                [
                    {nid: nid}, 
                    {$or: 
                        [
                            {uid: uid}, 
                            {"shareWith.uid": uid}
                        ]
                    }
                ]
            }, "nid uid book title text shareWith", (err, resultNote) => {
                if(err) { 
                    resolveP({
                        status: "error",
                        code: "0000",
                        err: "getNote : " + err
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
                    resolve(resultNote)
                }
            })
        }).then((noteDatas) => {
            db.Books.findOne({bid: noteDatas["book"]}, "bid uid name", (err, resultBook) => {
                if(err) {
                    resolveP({
                        status: "error",
                        code: "0000",
                        err: "getNote : " + err
                    })
                }
                else {
                    if(!resultBook) {
                        var resultBook = []
                        resultBook["bid"] = "0"
                    }
    
                    let uids = ""
                    for(i = 0; i < noteDatas["shareWith"].length; i++) {
                        if(i != noteDatas["shareWith"].length - 1) {
                            uids += noteDatas["shareWith"][i]["uid"] + ","
                        }
                        else {
                            uids += noteDatas["shareWith"][i]["uid"]
                        }
                    }
    
                    tools_universal.getPseudosOfUids(uids).then((responsePseudos) => {
                        for(i = 0; i < noteDatas["shareWith"].length; i++) {
                            noteDatas["shareWith"][i] = {
                                uid: noteDatas["shareWith"][i]["uid"],
                                canEdit: noteDatas["shareWith"][i]["canEdit"],
                                name: responsePseudos[i]
                            }
                        }
                        let note = {}

                        let isOwner = false
                        if(noteDatas['uid'] == uid) {
                            isOwner = true
                        }

                        tools_universal.getPseudoOfUid(noteDatas["uid"]).then((responsePseudo) => {
                            if(!responsePseudo) {
                                responsePseudo = "Deleted"
                            }
                            note = {
                                nid: noteDatas['nid'],
                                isOwner: isOwner,
                                uid: noteDatas['uid'],
                                book: {bid: resultBook['bid'], bName: resultBook["name"]},
                                pseudo: responsePseudo,
                                title: noteDatas['title'],
                                text: noteDatas['text'],
                                shareWith: noteDatas["shareWith"]
                            }
                            
                            resolveP({
                                status: "sucess",
                                note: note
                            })

                        }).catch((err) => {
                            resolveP({
                                status: "error",
                                code: "0000",
                                err: "getNote : " + err
                            })
                        })
                    }).catch((err) => {
                        resolveP({
                            status: "error",
                            code: "0000",
                            err: "getNote : " + err
                        })
                    })
                }
            })
        }) 
    })
}